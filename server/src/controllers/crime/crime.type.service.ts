import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateCrimeTypeInput,
  CrimeTypeResponse,
  UpdateCrimeTypeInput,
} from './crime.type.dto';
import { CrimeType, CrimeTypeDocument } from './crime.type.model';

@Injectable()
export class CrimeTypeService {
  constructor (
    @InjectModel(CrimeType.name) private CrimeTypeModel: Model<CrimeTypeDocument>,
  ) {}

  async getCrimeTypes (): Promise<CrimeTypeResponse> {
    const types = await this.CrimeTypeModel.find({}).lean();

    return {
      types,
    };
  }

  async createType (options: CreateCrimeTypeInput): Promise<CrimeTypeResponse> {
    const type = await this.CrimeTypeModel.create(options);

    return {
      type,
    };
  }

  async updateType (
    id: string | Types.ObjectId,
    options: UpdateCrimeTypeInput,
  ): Promise<CrimeTypeResponse> {
    const type = await this.CrimeTypeModel.findByIdAndUpdate(id, options);

    return {
      type,
    };
  }

  async deleteType (id: string | Types.ObjectId): Promise<CrimeTypeResponse> {
    const type = await this.CrimeTypeModel.findByIdAndDelete(id);

    return {
      type,
    };
  }
}
