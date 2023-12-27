import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BcryptService } from '../../common/services/bcrypt.service';
import { Role } from '../../constants/role.enum';
import { FileService } from '../file/file.service';
import { UserUpdateAvatarDto } from './dto/user.update-avatar.dto';
import { GenericService } from '../../common/services/generic.service';
import { Raw, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDto } from './dto/user.create.dto';
import { nanoid } from 'nanoid';
import { UserUpdateDto } from './dto/user.update.dto';
import { ListDto } from '../../common/dto/list.dto';
import { QueryFailedExceptions } from '../../common/exceptions/query-failed-exceptions';

@Injectable()
export class UserService extends GenericService<User> {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private bcryptService: BcryptService,
    private fileService: FileService,
  ) {
    super(repository);
  }

  async create(dto: UserCreateDto) {
    try {
      const password = this.bcryptService.encodePassword(dto.password);
      const user = new User();
      user.username = 'user_' + nanoid(4);
      user.email = dto.email;
      user.password = password;
      user.roles = (dto.roles || [Role.User]) as unknown as string[];
      await this.repository.save(user);
    } catch (err) {
      throw new QueryFailedExceptions(err, '该邮箱已被注册');
    }
  }

  async deleteUser(id: number) {
    const user = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['files'],
    });

    await this.fileService.deleteFiles({
      data: user.files.map((file) => file.id),
    });

    return await this.delete(id);
  }

  async deleteAllExcludeSuper() {
    const superUser = await this.findSuper();

    const users = await this.find();
    const entitiesToDelete = superUser
      ? users.filter((entity) => entity.id !== superUser.id)
      : users;
    await this.repository.remove(entitiesToDelete);
    return {
      count: entitiesToDelete.length,
    };
  }

  async update(dto: UserUpdateDto) {
    const { id, ...rest } = dto;
    const user = await this.findOneById(dto.id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, rest);
    await this.repository.save(user);
  }

  async getList(dto: ListDto) {
    return await this.list(dto, {
      relations: {
        avatar: true,
      },
      select: {
        avatar: {
          path: true,
        },
      },
    });
  }

  async findOneByEmail(email: string) {
    return await this.repository.findOneBy({
      email: email,
    });
  }

  async getUserProfile(id: number) {
    const user = await this.repository.findOne({
      where: {
        id,
      },
      relations: {
        avatar: true,
      },
      select: {
        avatar: {
          path: true,
        },
        password: false,
      },
    });
    if (!user)
      throw new BadRequestException({
        message: '用户不存在',
      });

    return user;
  }

  async findSuper() {
    return await this.repository.findOne({
      where: {
        roles: Raw(
          (roles) => `JSON_CONTAINS(roles ,JSON_Array(${Role.Super}))`,
        ),
      },
    });
  }

  async updateAvatar(dto: UserUpdateAvatarDto) {
    const file = await this.fileService.saveFile(dto.file, dto.uploaderId);

    const user = await this.repository.findOne({
      where: {
        id: dto.uploaderId,
      },
      relations: {
        avatar: true,
      },
      select: {
        avatar: {
          id: true,
        },
      },
    });

    if (user.avatar.id) await this.fileService.delete(user.avatar.id);

    user.avatar = file;

    return await this.repository.save(user);
  }
}
