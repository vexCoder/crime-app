import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { HotlineType } from './user.model';

@InputType()
export class RegisterInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class UpdateUserInput extends PartialType(OmitType(RegisterInput, [ 'password' ])) {}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class HotlineInput {
  @Field()
  label: string;

  @Field()
  type: HotlineType;

  @Field()
  number: string;
}

@InputType()
export class TrackerLocationInput {
  @Field()
  lng: number;

  @Field()
  lat: number;
}
