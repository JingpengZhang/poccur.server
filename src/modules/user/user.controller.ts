import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { UserService } from './user.service';
import { Public } from '../../common/decorators/public.decorator';
import { FastifyRequest } from 'fastify';
import { userCreateJoi } from './joi/user.create.joi';
import { UserCreateDto } from './dto/user.create.dto';
import { UserFindOneByIdDto } from './dto/user.find-one-by-id.dto';
import { userFindOneByIdJoi } from './joi/user.find-one-by-id.joi';
import { userUpdateJoi } from './joi/user.update.joi';
import { UserUpdateDto } from './dto/user.update.dto';
import { DocsListDto } from '../../common/dto/docs-list.dto';
import { getListJoi } from '../../common/joi/get-list.joi';
import { GetListPipe } from '../../common/pipes/get-list.pipe';

@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('create')
  @Public()
  @UsePipes(new JoiValidationPipe(userCreateJoi))
  async create(@Body() body: UserCreateDto) {
    await this.service.create(body);
    return;
  }

  @Get('profile')
  @Public()
  @UsePipes(new JoiValidationPipe(userFindOneByIdJoi))
  async getProfile(@Query() query: UserFindOneByIdDto) {
    return {
      profile: await this.service.findOneById(query),
    };
  }

  @Post('current-user-profile')
  async getCurrentUserProfile(@Req() request: FastifyRequest) {
    return {
      profile: await this.service.findOneById({
        id: request['user'].id,
      }),
    };
  }

  @Post('update')
  @Public()
  @UsePipes(new JoiValidationPipe(userUpdateJoi))
  async update(@Body() body: UserUpdateDto) {
    await this.service.update(body);
  }

  @Post('update-avatar')
  async updateAvatar(@Req() request: FastifyRequest) {
    const file = await request.file();
    const uploaderId = request['user'].id;
    const path = await this.service.updateAvatar({
      uploaderId,
      file,
    });
    return {
      path,
    };
  }

  @Get('get-by-id')
  async getUserInfoById(@Query() query: UserFindOneByIdDto) {
    await this.service.findOneById(query);
  }

  @Get('list')
  @UsePipes(new JoiValidationPipe(getListJoi))
  async list(@Query(new GetListPipe()) query: DocsListDto) {
    return {
      list: await this.service.list(query),
      total: await this.service.count(),
    };
  }
}
