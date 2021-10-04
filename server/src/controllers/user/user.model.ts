import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum HotlineType {
  Ambulance = 'ambulance',
  Dispatch = 'dispatch',
  Fire = 'fire',
  Police = 'police',
}

registerEnumType(HotlineType, {
  name: 'HotlineType',
  description: 'Type of hotline',
});

export enum UserType {
  Responder = 'Responder',
  Reporter = 'Reporter',
  Admin = 'Admin',
}

registerEnumType(UserType, {
  name: 'UserType',
  description: 'UserType',
});

@ObjectType()
@Schema({
  _id: false,
  id: false,
})
export class Hotline {
  @Field(() => String)
  @Prop()
  label: string;

  @Field(() => String, { nullable: true })
  @Prop()
  code?: string;

  @Field(() => String)
  @Prop()
  type: HotlineType;

  @Field(() => String)
  @Prop()
  number: string;
}

@ObjectType()
@Schema({
  _id: false,
  id: false,
})
export class TrackerLocation {
  @Field(() => Number)
  @Prop()
  lng: number;

  @Field(() => Number)
  @Prop()
  lat: number;
}

@ObjectType()
@Schema({
  timestamps: true,
})
export class User {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => String)
  @Prop({ unique: true })
  name: string;

  @Field(() => String)
  @Prop({ unique: true })
  email: string;

  @Field(() => UserType, { nullable: true, defaultValue: UserType.Reporter })
  @Prop({ default: UserType.Reporter })
  type: UserType;

  @Field(() => TrackerLocation, { nullable: true })
  @Prop()
  currentLoc?: TrackerLocation;

  @Field(() => TrackerLocation, { nullable: true })
  @Prop()
  target?: TrackerLocation;

  @Field(() => Boolean, { nullable: true })
  @Prop()
  tracking?: boolean;

  @Field(() => String)
  @Prop()
  password: string;

  @Field(() => [ Hotline ], { nullable: true })
  @Prop()
  hotlines?: Hotline[];

  @Field(() => Number)
  createdAt: number;

  @Field(() => Number)
  updatedAt: number;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
