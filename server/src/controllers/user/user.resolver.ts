import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../services/auth.guard';
import { CurrentUser, CurrentUserData } from './user.decorator';
import { User, UserType } from './user.model';
import {
  HotlineInput,
  LoginInput,
  RegisterInput,
  TrackerLocationInput,
} from './user.resolver.input';
import { UserResponse } from './user.resolver.output';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor (private readonly user: UserService) {}

  @Mutation(() => UserResponse)
  async register (@Args('options') options: RegisterInput) {
    return await this.user.register(options, UserType.Reporter);
  }

  @Mutation(() => UserResponse)
  async registerResponder (@Args('options') options: RegisterInput) {
    return await this.user.register(options, UserType.Responder);
  }

  @Mutation(() => UserResponse)
  async login (@Args('options') options: LoginInput) {
    return await this.user.login(options, UserType.Reporter);
  }

  @Mutation(() => UserResponse)
  async loginResponder (@Args('options') options: LoginInput) {
    return await this.user.login(options, UserType.Responder);
  }

  @Mutation(() => UserResponse)
  @UseGuards(GqlAuthGuard)
  async addHotline (
    @CurrentUser() user: CurrentUserData,
    @Args('options') options: HotlineInput,
  ) {
    return await this.user.addHotline(user._id, options);
  }

  @Mutation(() => UserResponse)
  @UseGuards(GqlAuthGuard)
  async updateHotline (
    @CurrentUser() user: CurrentUserData,
    @Args('query') query: HotlineInput,
    @Args('options') options: HotlineInput,
  ) {
    return await this.user.updateHotline(user._id, query, options);
  }

  @Mutation(() => UserResponse)
  @UseGuards(GqlAuthGuard)
  async deleteHotline (
    @CurrentUser() user: CurrentUserData,
    @Args('options') options: HotlineInput,
  ) {
    return await this.user.deleteHotline(user._id, options);
  }

  @Query(() => UserResponse)
  @UseGuards(GqlAuthGuard)
  async getHotlines (@CurrentUser() user: CurrentUserData) {
    return await this.user.getHotlines(user._id);
  }

  @Query(() => UserResponse)
  @UseGuards(GqlAuthGuard)
  async status (@CurrentUser() user: CurrentUserData) {
    return await this.user.getUser(user._id);
  }

  @Mutation(() => UserResponse)
  @UseGuards(GqlAuthGuard)
  async updateResponderLocation (
    @Args('location', { nullable: true }) loc: TrackerLocationInput,
    @Args('target', { nullable: true }) target: TrackerLocationInput,
    @Args('tracking', { nullable: true }) tracking: boolean,
    @CurrentUser() user: CurrentUserData,
  ) {
    return await this.user.updateResponderLocation(user._id, loc, target, tracking);
  }
}
