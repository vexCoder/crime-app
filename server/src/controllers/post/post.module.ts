/* eslint-disable prettierx/options */
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Post, PostSchema } from './models/post.model';
import { JwtStrategy } from '../services/jwt.strategy';
import { User, UserSchema } from '../user/user.model';
import { PostAggregator } from './post.aggregate';

@Module({
  imports: [
    JwtModule.register({
      secret: 'test',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [
    PostResolver, PostService, JwtStrategy, PostAggregator 
  ],
})
export class PostModule {}
