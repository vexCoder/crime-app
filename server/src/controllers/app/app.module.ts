import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { InitModule } from '../common/init.module';
import { CrimeTypeModule } from '../crime/crime.type.module';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/crime-app-db', {
      useCreateIndex: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      playground: true,
      debug: false,
      uploads: false,
      introspection: true,
      useGlobalPrefix: true,
    }),
    UserModule,
    PostModule,
    CrimeTypeModule,
    InitModule,
  ],
  providers: [ AppService, AppResolver ],
})
export class AppModule {}
