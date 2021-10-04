import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../services/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'test',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([ { name: User.name, schema: UserSchema } ]),
  ],
  providers: [ UserService, UserResolver, JwtStrategy ],
})
export class UserModule {}
