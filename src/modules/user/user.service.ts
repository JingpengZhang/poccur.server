import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, FindOneUserByEmailDto } from './user.dto';
import MongooseExceptions from '../../exceptions/MongooseExceptions';
import { BcryptService } from '../../services/bcrypt.service';
import { Role } from '../auth/role.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>, private bcryptService: BcryptService) {
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const password = this.bcryptService.encodePassword(createUserDto.password);
      let roles =
        createUserDto.roles.indexOf(Role.User) === -1
          ?
          [Role.User].concat(createUserDto.roles)
          :
          createUserDto.roles;
      const user = new this.model({ ...createUserDto, password, roles });
      if (!createUserDto.username) user.username = 'user_' + user._id.toString().slice(-4);
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

  async findSuper() {
    try {
      return await this.model.findOne({ roles: { $elemMatch: { $eq: Role.Super } } });
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }


}