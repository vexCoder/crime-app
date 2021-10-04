import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@ObjectType()
@Schema({
  id: false,
  _id: false,
})
export class Location {
  @Field(() => Number)
  @Prop()
  lng: number;

  @Field(() => Number)
  @Prop()
  lat: number;

  @Field(() => String, { nullable: true })
  @Prop()
  address?: string;

  @Field(() => String, { nullable: true })
  @Prop()
  country?: string;

  @Field(() => String, { nullable: true })
  @Prop()
  zipcode?: string;
}
