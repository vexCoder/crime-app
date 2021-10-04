import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrimeType, CrimeTypeDocument } from '../crime/crime.type.model';
import { Post, PostDocument } from '../post/models/post.model';
import * as _ from 'lodash';
import * as faker from 'faker';
import { User, UserDocument, UserType } from '../user/user.model';
import * as bcrypt from 'bcrypt';
import { mkdir } from 'fs-extra';
import { join } from 'path';
import * as moment from 'moment';

@Injectable()
export class InitService {
  constructor (
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(CrimeType.name) private CrimeTypeModel: Model<CrimeTypeDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  async start () {
    console.log(`Initializating`);
    const crimeTypes = [
      { label: 'Accident', color: '#e34747' },
      { label: 'Murder', color: '#535353' },
      { label: 'Mob', color: '#e79548' },
      { label: 'Fraud', color: '#e1d74b' },
      { label: 'Theft', color: '#e1479e' },
    ];

    const types = await Promise.all(
      crimeTypes.map(async v => {
        return await this.CrimeTypeModel.findOneAndUpdate({ label: v.label }, v, {
          new: true,
          upsert: true,
          useFindAndModify: false,
        });
      }),
    );

    try {
      const path = join(__dirname, '..', '..', 'uploads');
      await mkdir(path);
    } catch (error) {
      console.log('Upload folder already exists');
    }

    const hashedPass = await bcrypt.hash('adminadmin', 10).then(res => res);
    const admin = {
      name: 'superadmin',
      email: 'superadmin@g.c',
      password: hashedPass,
      type: UserType.Admin,
    };
    await this.UserModel.findOneAndUpdate({ email: admin.email }, admin, { upsert: true });

    await this.mock(types);
  }

  async mock (types: CrimeType[]) {
    const initLoc = [ 125.58712255, 7.09977695 ];

    const hashedPass = await bcrypt.hash('adminadmin', 10).then(res => res);

    const tests = [
      {
        name: 'admin reporter',
        email: 'admin.reporter@g.c',
        password: hashedPass,
        type: UserType.Reporter,
      },
      {
        name: 'admin responder',
        email: 'admin.responder@g.c',
        password: hashedPass,
        type: UserType.Responder,
      },
    ];

    await this.UserModel.deleteMany({
      email: {
        $ne: 'superadmin@g.c',
      },
    });

    await Promise.all(
      tests.map(async v => {
        await this.UserModel.findOneAndUpdate(
          {
            email: v.email,
          },
          v,
          {
            upsert: true,
          },
        );
      }),
    );

    const users = await Promise.all(
      _.range(100).map(async () => {
        return await this.UserModel.create({
          name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          email: faker.internet.email(),
          password: faker.internet.password(),
        });
      }),
    );

    console.log('Users Created:', users?.length);
    await this.PostModel.deleteMany({});
    const test = _.range(5);
    const crimes = await Promise.all(
      test.map(async () => {
        const options = {
          user: _.shuffle(users)[0]._id,
          type: _.shuffle(types)[0]._id,
          description: faker.lorem.sentences(Math.random() * 2 + 1),
          imageCount: 0,
          location: {
            lat: initLoc[1] + _.random(-5, 5) * 0.0001,
            lng: initLoc[0] + _.random(-5, 5) * 0.0001,
            address: 'Test Address',
          },
        };

        return await this.PostModel.create(options);
      }),
    );

    const generatePosts = async () => {
      const crimes = await Promise.all(
        _.range(Math.floor(Math.random() * 5)).map(async () => {
          const options = {
            user: _.shuffle(users)[0]._id,
            type: _.shuffle(types)[0]._id,
            description: faker.lorem.sentences(Math.random() * 2 + 1),
            imageCount: 0,
            location: {
              lat: initLoc[1] + _.random(-5, 5) * 0.0001,
              lng: initLoc[0] + _.random(-5, 5) * 0.0001,
              address: 'Test Address',
            },
          };

          return await this.PostModel.create(options);
        }),
      );

      await this.PostModel.deleteMany({
        createdAt: {
          $lte: moment().subtract(6, 'hours').toDate() as any,
        },
      });

      console.log('Crimes Created:', crimes?.length);
      setTimeout(() => generatePosts(), Math.random() * 30 * 1000);
    };

    setTimeout(() => generatePosts(), Math.random() * 30 * 1000);
    console.log('Crimes Created:', crimes?.length);
  }
}
