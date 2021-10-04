import { ObjectType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CrimeType } from './crime.type.model';

@ObjectType()
export class CrimeTypeResponse {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => [ CrimeType ], { nullable: true })
  types?: CrimeType[];

  @Field(() => CrimeType, { nullable: true })
  type?: CrimeType;
}

@InputType()
export class CreateCrimeTypeInput {
  @Field(() => String)
  label: string;

  @Field(() => String)
  color: string;
}

@InputType()
export class UpdateCrimeTypeInput extends PartialType(CreateCrimeTypeInput) {}

@InputType()
export class DeleteCrimeTypeInput {
  @Field(() => String, { nullable: true })
  id?: string;
}
