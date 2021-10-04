import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User, UserDocument } from '../user/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (@InjectModel(User.name) private UserModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test',
    });
  }

  async validate (payload: any) {
    const { _id } = payload;

    const user = await this.UserModel.findById(_id);
    return user;
  }
}
