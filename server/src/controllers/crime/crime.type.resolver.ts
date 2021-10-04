import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../services/auth.guard';
import {
  CreateCrimeTypeInput,
  CrimeTypeResponse,
  UpdateCrimeTypeInput,
} from './crime.type.dto';
import { CrimeType } from './crime.type.model';
import { CrimeTypeService } from './crime.type.service';

@Resolver(() => CrimeType)
export class CrimeTypeResolver {
  constructor (private readonly service: CrimeTypeService) {}

  @Query(() => CrimeTypeResponse)
  async getCrimeTypes (): Promise<CrimeTypeResponse> {
    try {
      return this.service.getCrimeTypes();
    } catch (e) {
      console.log(e);
    }
  }

  @Mutation(() => CrimeTypeResponse)
  @UseGuards(GqlAuthGuard)
  async createType (@Args('options') options: CreateCrimeTypeInput) {
    return await this.service.createType(options);
  }

  @Mutation(() => CrimeTypeResponse)
  @UseGuards(GqlAuthGuard)
  async updateType (
    @Args('id', { type: () => ID }) id: string,
    @Args('options') options: UpdateCrimeTypeInput,
  ) {
    return await this.service.updateType(id, options);
  }

  @Mutation(() => CrimeTypeResponse)
  @UseGuards(GqlAuthGuard)
  async deleteType (@Args('id', { type: () => ID }) id: string) {
    return await this.service.deleteType(id);
  }
}
