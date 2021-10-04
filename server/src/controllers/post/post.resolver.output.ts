import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
import { Post } from './models/post.model';

@ObjectType()
export class AccidentCategoryCount {
  @Field(() => ID)
  type: Types.ObjectId;

  @Field(() => String)
  category: string;

  @Field(() => Number)
  number: number;
}

@ObjectType()
export class NotificationResponse {
  @Field(() => Number)
  crimesNearby: number;
}

@ObjectType()
export class Stats {
  @Field(() => Number)
  past6Hours: number;

  @Field(() => Number)
  pastHour: number;

  @Field(() => Number)
  past30Min: number;
}

@ObjectType()
export class PostResponse {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => Post, { nullable: true })
  post?: Post;

  @Field(() => [ Post ], { nullable: true })
  posts?: Post[];

  @Field(() => [ User ], { nullable: true })
  users?: User[];

  @Field(() => Stats, { nullable: true })
  stats?: Stats;

  @Field(() => [ AccidentCategoryCount ], { nullable: true })
  accidentCount?: AccidentCategoryCount[];

  @Field(() => NotificationResponse, { nullable: true })
  notification?: NotificationResponse;
}
