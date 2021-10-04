import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../user/user.model';
import { Location } from './location.model';

@ObjectType()
@Schema({
  timestamps: true,
})
export class Post {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => String)
  @Prop()
  type: Types.ObjectId;

  @Field(() => String)
  @Prop()
  description: string;

  @Field(() => Boolean, { nullable: true })
  @Prop()
  invalid?: boolean;

  @Field(() => Location)
  @Prop()
  location: Location;

  @Field(() => Number, { nullable: true })
  @Prop()
  imageCount?: number;

  @Field(() => String)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  user: MongooseSchema.Types.ObjectId;

  @Field(() => Number)
  createdAt: number;

  @Field(() => Number)
  updatedAt: number;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
