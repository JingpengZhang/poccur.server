import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, FindOneUserByEmailDto } from './user.dto';
import MongooseExceptions from '../../exceptions/MongooseExceptions';
import { BcryptService } from '../../services/bcrypt.service';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>, private bcryptService: BcryptService) {
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const password = this.bcryptService.encodePassword(createUserDto.password);
      const user = new this.model({ ...createUserDto, password });
      await user.save();
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async findOneByEmail(findOneUserByEmailDto: FindOneUserByEmailDto) {
    try {
      return await this.model.findOne({ email: findOneUserByEmailDto.email });
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }
}