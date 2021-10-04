import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { createWriteStream } from 'fs';
import { FileUpload } from 'graphql-upload';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { join } from 'path';
import { User, UserDocument } from '../user/user.model';
import { TrackerLocationInput } from '../user/user.resolver.input';
import { Post, PostDocument } from './models/post.model';
import { PostAggregator } from './post.aggregate';
import { CreatePostInput, LocationInput, UpdatePostInput } from './post.resolver.input';
import { PostResponse } from './post.resolver.output';
import * as fs from 'fs-extra';
import * as sharp from 'sharp';

@Injectable()
export class PostService {
  constructor (
    private readonly postAggregate: PostAggregator,
    private jwtService: JwtService,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  async createPost (options: CreatePostInput, user: User): Promise<PostResponse> {
    try {
      const post = await this.PostModel.create({ ...options, user: user._id });

      return {
        post,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  async invalidatePost (id: string | Types.ObjectId): Promise<PostResponse> {
    try {
      let post = await this.PostModel.findById(id);
      post = await this.PostModel.findByIdAndUpdate(
        id,
        { invalid: !post.invalid },
        { new: true },
      );

      return {
        post,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  async uploadPostPhoto (id: string, file: FileUpload): Promise<PostResponse> {
    const { createReadStream, filename } = file;
    const path = join(__dirname, '..', '..', 'uploads', `${id}-${filename}`);
    const pathThumbnail = join(
      __dirname,
      '..',
      '..',
      'uploads',
      `${id}-thumbnail-${filename}`,
    );
    try {
      await new Promise(async (resolve, reject) =>
        createReadStream()
          .pipe(createWriteStream(path))
          .on('finish', () => resolve(true))
          .on('error', () => reject(false)),
      );

      sharp(path)
        .resize(40, 40)
        .toFile(pathThumbnail, (err, info) => {
          if (err) {
            console.error(err);
          }

          console.log(info);
        });
      return {};
    } catch (e) {
      return { error: e.message };
    }
  }

  async getPost (id: string | Types.ObjectId): Promise<PostResponse> {
    try {
      const post = await this.PostModel.findById(id);
      if (!post) return { error: 'No Post Found' };
      return { post };
    } catch (e) {
      return { error: e.message };
    }
  }

  convertToRadius (lat: number, lng: number, radius: number) {
    const minLat = lat;
    const maxLat = lat + radius / 110.574;
    const minLng = lng;
    const maxLng = lng + 111.32 * Math.cos(maxLat);
    return {
      lat: [ minLat, maxLat ],
      lng: [ minLng, maxLng ],
    };
  }

  async getPosts (
    loc: LocationInput,
    radius: number,
    allowInvalid?: boolean,
    startDate?: number,
    endDate?: number,
  ): Promise<PostResponse> {
    try {
      const posts = await this.postAggregate
        .queryPostLoc(loc, radius, allowInvalid)
        .sort('-createdAt')
        .limit(100);

      if (!posts) return { error: 'No Post Found' };

      return { posts };
    } catch (e) {
      return { error: e.message };
    }
  }

  async getUserTracking (loc: TrackerLocationInput, radius: number): Promise<PostResponse> {
    try {
      const users = await this.postAggregate
        .queryUserLoc(loc, radius)
        .sort('-createdAt')
        .limit(100);

      if (!users) return { error: 'No Users Found' };

      return { users };
    } catch (e) {
      return { error: e.message };
    }
  }

  async getLocationOverview (
    loc: LocationInput,
    radius: number,
    allowInvalid?: boolean,
    startDate?: number,
    endDate?: number,
  ): Promise<PostResponse> {
    try {
      const posts = await this.getPosts(loc, radius, allowInvalid);
      const responders = await this.getUserTracking(loc, radius);
      const past6Hours: number = await this.PostModel.count({
        createdAt: {
          $gte: moment().subtract(6, 'hours').toDate() as any,
        },
      });
      const pastHour: number = await this.PostModel.count({
        createdAt: {
          $gte: moment().subtract(1, 'hours').toDate() as any,
        },
      });
      const past30Min: number = await this.PostModel.count({
        createdAt: {
          $gte: moment().subtract(30, 'minute').toDate() as any,
        },
      });

      if (!posts.error && !responders.error)
        return {
          ...posts,
          ...responders,
          stats: {
            past6Hours,
            pastHour,
            past30Min,
          },
        };
    } catch (e) {
      return { error: e.message };
    }
  }

  async checkRadiusNotify (loc: LocationInput, radius: number): Promise<PostResponse> {
    try {
      const posts = await this.postAggregate
        .queryPostLoc(
          loc,
          radius,
          false,
          moment().subtract(30, 'second').unix(),
          moment().unix(),
        )
        .sort('-createdAt');

      if (!posts) return { error: 'No Post Found' };

      return {
        notification: {
          crimesNearby: posts.length,
        },
      };
    } catch (e) {
      return { error: e.message };
    }
  }
}
