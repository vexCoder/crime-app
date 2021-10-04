/* eslint-disable prettierx/options */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../services/jwt.strategy';
import { User, UserSchema } from '../user/user.model';
import { CrimeType, CrimeTypeSchema } from './crime.type.model';
import { CrimeTypeResolver } from './crime.type.resolver';
import { CrimeTypeService } from './crime.type.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'test',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      { name: CrimeType.name, schema: CrimeTypeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ CrimeTypeService, JwtStrategy, CrimeTypeResolver ],
})
export class CrimeTypeModule {}
