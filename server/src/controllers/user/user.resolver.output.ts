import { Field, ObjectType } from '@nestjs/graphql';
import { Hotline, User } from './user.model';

@ObjectType()
export class UserResponse {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [ User ], { nullable: true })
  users?: User[];

  @Field(() => [ Hotline ], { nullable: true })
  hotlines?: Hotline[];

  @Field(() => Hotline, { nullable: true })
  hotline?: Hotline;

  @Field(() => String, { nullable: true })
  token?: string;
}
