import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class LocationInput {
  @Field(() => Number)
  lng: number;

  @Field(() => Number)
  lat: number;

  @Field(() => String, { nullable: true })
  address?: string;
}

@InputType()
export class CreatePostInput {
  @Field()
  description: string;

  @Field(() => LocationInput)
  location: LocationInput;

  @Field()
  type: string;

  @Field()
  imageCount: number;

  @Field({ nullable: true })
  invalid?: boolean;
}

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {}

@InputType()
export class DeletePostInput {
  @Field()
  id: string;
}

@InputType()
export class GetPostInput {
  @Field()
  id: string;
}
