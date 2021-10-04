import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@ObjectType()
@Schema({
  timestamps: true,
})
export class CrimeType {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => String)
  @Prop()
  label: string;

  @Field(() => String)
  @Prop()
  color: string;

  @Field(() => Number)
  createdAt: number;

  @Field(() => Number)
  updatedAt: number;
}

export type CrimeTypeDocument = CrimeType & Document;
export const CrimeTypeSchema = SchemaFactory.createForClass(CrimeType);
