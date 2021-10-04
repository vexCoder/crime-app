import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserType } from './user.model';
import { HotlineInput, LoginInput, RegisterInput } from './user.resolver.input';
import * as bcrypt from 'bcrypt';
import { UserResponse } from './user.resolver.output';
import { LocationInput } from '../post/post.resolver.input';

@Injectable()
export class UserService {
  constructor (
    private jwtService: JwtService,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}
  async register (options: RegisterInput, type: UserType): Promise<UserResponse> {
    try {
      const userExists = await this.UserModel.findOne({ email: options.email });
      if (userExists) return { error: 'User already exists' };
      if (options.email.length < 4) {
        return { error: 'Email is less than 4 characters' };
      }
      if (options.password.length < 6) {
        return { error: 'Password is less than 6 characters' };
      }
      const hashedPass = await bcrypt.hash(options.password, 10).then(res => res);
      const user = await this.UserModel.create({
        email: options.email,
        name: options.name,
        password: hashedPass,
        type,
      });

      return {
        user,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  async login (options: LoginInput, type: UserType): Promise<UserResponse> {
    try {
      const user = await this.UserModel.findOne({
        email: options.email,
        ...(type === UserType.Reporter
          ? { type }
          : {
            $or: [ { type: UserType.Responder }, { type: UserType.Admin } ],
          }),
      });
      if (!user) return { error: 'Wrong Email or Password' };
      const checkPass = await bcrypt.compare(options.password, user.password);
      if (!checkPass) return { error: 'Wrong Email or Password' };
      return {
        token: await this.jwtService.signAsync({ email: options.email, _id: user._id }),
        user,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  async addHotline (
    id: string | Types.ObjectId,
    options: HotlineInput,
  ): Promise<UserResponse> {
    try {
      const user = await this.UserModel.findByIdAndUpdate(id, {
        $push: {
          hotlines: options,
        },
      });

      return { user, hotlines: user.hotlines };
    } catch (e) {
      return { error: e.message };
    }
  }

  async deleteHotline (
    id: string | Types.ObjectId,
    options: HotlineInput,
  ): Promise<UserResponse> {
    try {
      const user = await this.UserModel.findByIdAndUpdate(id, {
        $pull: {
          hotlines: options,
        },
      });

      return { user, hotlines: user.hotlines };
    } catch (e) {
      return { error: e.message };
    }
  }

  async updateHotline (
    id: string | Types.ObjectId,
    query: HotlineInput,
    options: HotlineInput,
  ): Promise<UserResponse> {
    try {
      const user = await this.UserModel.findByIdAndUpdate(id, {
        $pull: {
          hotlines: query,
        },
      });

      await this.UserModel.findByIdAndUpdate(id, {
        $push: {
          hotlines: options,
        },
      });

      return { user, hotlines: user.hotlines };
    } catch (e) {
      return { error: e.message };
    }
  }

  async getHotlines (id: string | Types.ObjectId): Promise<UserResponse> {
    try {
      const user = await this.UserModel.findById(id);
      if (!user) return { error: 'Invalid User' };
      return { hotlines: user.hotlines };
    } catch (e) {
      return { error: e.message };
    }
  }

  async getUser (id: string | Types.ObjectId): Promise<UserResponse> {
    try {
      const user = await this.UserModel.findById(id);
      if (!user) return { error: 'Not Logged-in' };

      return { user };
    } catch (e) {
      return { error: e.message };
    }
  }

  async updateResponderLocation (
    id: string | Types.ObjectId,
    loc: LocationInput,
    target: LocationInput,
    tracking: boolean,
  ): Promise<UserResponse> {
    try {
      const user = await this.UserModel.findByIdAndUpdate(id, {
        currentLoc: loc,
        target,
        tracking,
      });

      return { user };
    } catch (e) {
      return { error: e.message };
    }
  }
}
