import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrimeType, CrimeTypeDocument } from '../crime/crime.type.model';
import { Post, PostDocument } from '../post/models/post.model';

@Injectable()
export class AppService {
  getHello (): string {
    return 'Hello World!';
  }
}
