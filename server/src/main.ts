import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './controllers/app/app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';

async function bootstrap () {
  const adapter = new ExpressAdapter();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, adapter);
  app.setGlobalPrefix('api');
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.useStaticAssets(join(__dirname, 'uploads'), { prefix: '/api/uploads/' });
  console.log(join(__dirname, 'uploads'));
  await app.listen(9005);
}

bootstrap();
