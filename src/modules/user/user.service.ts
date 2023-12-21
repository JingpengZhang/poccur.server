import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import MongooseExceptions from '../../common/exceptions/MongooseExceptions';
import { BcryptService } from '../../common/services/bcrypt.service';
import { Role } from '../../constants/role.enum';
import MongoUtils from '../../utils/mongo-utils';
import { FileService } from '../file/file.service';
import * as dayjs from 'dayjs';
import { UserCreateDto } from './dto/user.create.dto';
import { UserFindOneByIdDto } from './dto/user.find-one-by-id.dto';
import { UserFindOneByEmailDto } from './dto/user.find-one-by-email.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { UserUpdateAvatarDto } from './dto/user.update-avatar.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<User>,
    private bcryptService: BcryptService,
    private fileService: FileService,
  ) {}

  async create(createUserDto: UserCreateDto) {
    try {
      const password = this.bcryptService.encodePassword(
        createUserDto.password,
      );
      const user = new this.model({ ...createUserDto, password });
      if (!createUserDto.username)
        user.username = 'user_' + user._id.toString().slice(-4);
      user.registerTime = dayjs().valueOf();
      await user.save();
    } catch (err) {
      console.log(err);
      throw new MongooseExceptions(err);
    }
  }

  async findOneByEmail(findOneUserByEmailDto: UserFindOneByEmailDto) {
    try {
      return await this.model
        .findOne({ email: findOneUserByEmailDto.email })
        .populate('avatar', 'path');
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async findOneById(dto: UserFindOneByIdDto) {
    const result = await this.model.findById(dto.id).populate('avatar', 'path');
    if (!result)
      throw new BadRequestException({
        message: '用户不存在',
      });
    const { password, avatar, ...rest } = MongoUtils.formatDoc<any>(result);
    let profile = {};
    Object.assign(profile, rest);
    profile['avatar'] = avatar ? avatar.path : '';
    return profile;
  }

  async findSuper() {
    try {
      return await this.model.findOne({
        roles: { $elemMatch: { $eq: Role.Super } },
      });
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async update(body: UserUpdateDto) {
    try {
      const { id, ...rest } = body;
      await this.model.findByIdAndUpdate(id, rest);
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async updateAvatar(dto: UserUpdateAvatarDto) {
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
