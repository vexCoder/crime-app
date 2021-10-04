import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InitService } from '../common/init.service';
import { CrimeType, CrimeTypeSchema } from '../crime/crime.type.model';
import { Post, PostSchema } from '../post/models/post.model';
import { User, UserSchema } from '../user/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: CrimeType.name, schema: CrimeTypeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ InitService ],
})
export class InitModule implements OnModuleInit {
  constructor (private readonly init: InitService) {}

  onModuleInit () {
    this.init.start();
  }
}
