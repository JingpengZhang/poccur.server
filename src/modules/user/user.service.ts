import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, FindOneUserByEmailDto, FindOneUserByIdDto, UpdateAvatarDto, UpdateUserDto } from './user.dto';
import MongooseExceptions from '../../exceptions/MongooseExceptions';
import { BcryptService } from '../../services/bcrypt.service';
import { Role } from '../auth/role.enum';
import MongoUtils from '../../common/mongo-utils';
import { FileService } from '../file/file.service';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>, private bcryptService: BcryptService, private fileService: FileService) {
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
      return await this.model.findOne({ email: findOneUserByEmailDto.email }).populate('avatar', 'path');
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async findOneById(dto: FindOneUserByIdDto) {
    const result = await this.model.findById(dto.id).populate('avatar', 'path');
    if (!result) throw new BadRequestException({
      message: '用户不存在',
    });
    const {
      password,
      avatar,
      ...rest
    } = MongoUtils.formatDoc<any>(result);
    let profile = {};
    Object.assign(profile, rest);
    profile['avatar'] = avatar.path;
    return profile;
  }

  async findSuper() {
    try {
      return await this.model.findOne({ roles: { $elemMatch: { $eq: Role.Super } } });
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async update(body: UpdateUserDto) {
    try {
      const { id, ...rest } = body;
      await this.model.findByIdAndUpdate(id, rest);
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async updateAvatar(dto: UpdateAvatarDto) {
    try {
      const { uploaderId, file } = dto;

      const fileModel = await this.fileService.saveFile(file, uploaderId);
      const oldInfo = await this.model.findByIdAndUpdate(uploaderId, {
        avatar: fileModel.id,
      });
      // 删除旧头像文件
      if (oldInfo.avatar)
        await this.fileService.delete({ ids: [oldInfo.avatar] });

      return fileModel.path;
    } catch (err) {
      console.log(err);
      throw new MongooseExceptions(err);
    }
  }
}