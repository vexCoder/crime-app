import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './models/post.model';
import {
  CreatePostInput,
  DeletePostInput,
  GetPostInput,
  LocationInput,
  UpdatePostInput,
} from './post.resolver.input';
import { PostResponse } from './post.resolver.output';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../services/auth.guard';
import { CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.model';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver(() => Post)
export class PostResolver {
  constructor (private readonly postService: PostService) {}

  @Mutation(() => PostResponse)
  @UseGuards(GqlAuthGuard)
  async createPost (
    @Args('options') options: CreatePostInput,
    @CurrentUser() user: User,
  ): Promise<PostResponse> {
    try {
      console.log(options, user);
      return this.postService.createPost(options, user);
    } catch (e) {
      console.log(e);
    }
  }

  @Mutation(() => PostResponse)
  @UseGuards(GqlAuthGuard)
  async uploadFile (
    @Args('id')
    id: string,
    @Args({ name: 'photo', type: () => GraphQLUpload })
    photo: FileUpload,
  ): Promise<PostResponse> {
    try {
      return this.postService.uploadPostPhoto(id, photo);
    } catch (e) {
      console.log(e);
    }
  }

  @Mutation(() => PostResponse)
  @UseGuards(GqlAuthGuard)
  async invalidatePost (@Args('id', { type: () => ID }) id: string): Promise<PostResponse> {
    try {
      return this.postService.invalidatePost(id);
    } catch (e) {
      console.log(e);
    }
  }

  @Mutation(() => PostResponse)
  @UseGuards(GqlAuthGuard)
  async deletePost (@Args('options') options: DeletePostInput): Promise<PostResponse> {
    return Promise.resolve({
      error: 'Delete Post Error',
    });
  }

  @Query(() => PostResponse)
  @UseGuards(GqlAuthGuard)
  async getLocationOverview (
    @Args('location') loc: LocationInput,
    @Args('radius') radius: number,
    @Args('allowInvalid', { nullable: true }) allowInvalid?: boolean,
    @Args('startDate', { nullable: true }) startDate?: number,
    @Args('endDate', { nullable: true }) endDate?: number,
  ): Promise<PostResponse> {
    try {
      return this.postService.getLocationOverview(
        loc,
        radius,
        allowInvalid,
        startDate,
        endDate,
      );
    } catch (error) {
      return Promise.resolve({
        error: 'Get Posts Error',
      });
    }
  }

  @Query(() => PostResponse)
  @UseGuards(GqlAuthGuard)
  async getPost (@Args('options') options: GetPostInput): Promise<PostResponse> {
    try {
      return this.postService.getPost(options.id);
    } catch (e) {
      console.log(e);
    }
  }

  @Query(() => PostResponse)
  @UseGuards(GqlAuthGuard)
  async checkRadiusNotify (
    @Args('location') loc: LocationInput,
    @Args('radius') radius: number,
  ): Promise<PostResponse> {
    try {
      return this.postService.checkRadiusNotify(loc, radius);
    } catch (e) {
      console.log(e);
    }
  }
}
