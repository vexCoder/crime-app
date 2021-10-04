import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './models/post.model';
import { LocationInput } from './post.resolver.input';
import * as moment from 'moment';
import { TrackerLocationInput } from '../user/user.resolver.input';
import { User, UserDocument, UserType } from '../user/user.model';
@Injectable()
export class PostAggregator {
  constructor (
    private jwtService: JwtService,
    @InjectModel(Post.name)
    private PostModel: Model<PostDocument>,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
  ) {}

  get _post () {
    return this.PostModel.aggregate();
  }

  get _user () {
    return this.UserModel.aggregate();
  }

  queryPostLoc (
    loc: LocationInput,
    radius: number,
    allowInvalid?: boolean,
    startDate?: number,
    endDate?: number,
  ) {
    const ky = 40000 / 360;
    const kx = Math.cos((Math.PI * loc.lat) / 180.0) * ky;

    return this._post
      .addFields({
        dx: {
          $multiply: [
            {
              $abs: {
                $subtract: [ loc.lng, '$location.lng' ],
              },
            },
            kx,
          ],
        },
        dy: {
          $multiply: [
            {
              $abs: {
                $subtract: [ loc.lat, '$location.lat' ],
              },
            },
            ky,
          ],
        },
      })
      .addFields({
        check: {
          $lte: [
            {
              $sqrt: {
                $add: [ { $multiply: [ '$dx', '$dx' ] }, { $multiply: [ '$dy', '$dy' ] } ],
              },
            },
            radius,
          ],
        },
      })
      .match({
        check: true,
        ...(!allowInvalid && {
          $or: [
            { invalid: false },
            {
              invalid: {
                $exists: false,
              },
            },
          ],
        }),
        ...(!!startDate &&
          !!endDate && {
            createdAt: {
              $gte: moment(startDate, 'X').toDate(),
              $lte: moment(endDate, 'X').toDate(),
            },
          }),
      });
  }

  queryUserLoc (loc: TrackerLocationInput, radius: number) {
    const ky = 40000 / 360;
    const kx = Math.cos((Math.PI * loc.lat) / 180.0) * ky;

    return this._user
      .addFields({
        dx: {
          $multiply: [
            {
              $abs: {
                $subtract: [ loc.lng, '$target.lng' ],
              },
            },
            kx,
          ],
        },
        dy: {
          $multiply: [
            {
              $abs: {
                $subtract: [ loc.lat, '$target.lat' ],
              },
            },
            ky,
          ],
        },
      })
      .addFields({
        check: {
          $lte: [
            {
              $sqrt: {
                $add: [ { $multiply: [ '$dx', '$dx' ] }, { $multiply: [ '$dy', '$dy' ] } ],
              },
            },
            radius,
          ],
        },
      })
      .match({
        check: true,
        tracking: true,
        type: UserType.Responder,
      });
  }
}
