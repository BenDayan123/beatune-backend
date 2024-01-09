import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }
  async searchUsers(
    query: FilterQuery<UserDocument>,
    cursor: number | string,
    limit: number,
  ) {
    return this.UserModel.find(query)
      .skip(+cursor * limit)
      .limit(limit);
  }
  async findOne(params: any): Promise<User> {
    return this.UserModel.findOne(params);
  }
  async createUser(user: IUser) {
    return (await this.UserModel.create(user)).save();
  }
  findOneAndUpdate(filter: any, update: any, options: any) {
    return this.UserModel.findOneAndUpdate(filter, update, options);
  }
}
