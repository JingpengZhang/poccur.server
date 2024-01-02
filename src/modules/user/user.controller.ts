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
import { FastifyRequest } from 'fastify';
import { userCreateJoi } from './joi/user.create.joi';
import { UserCreateDto } from './dto/user.create.dto';
import { UserFindOneByIdDto } from './dto/user.find-one-by-id.dto';
import { userFindOneByIdJoi } from './joi/user.find-one-by-id.joi';
import { userUpdateJoi } from './joi/user.update.joi';
import { UserUpdateDto } from './dto/user.update.dto';
import { ListDto } from '../../common/dto/list.dto';
import { listJoi } from '../../common/joi/list.joi';
import { DevOnlyPipe } from '../../common/pipes/dev-only.pipe';
import { idJoi } from '../../common/joi/id.joi';
import formidable from 'formidable';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('create')
  @UsePipes(new JoiValidationPipe(userCreateJoi))
  async create(@Body() body: UserCreateDto) {
    await this.service.create(body);
    return;
  }

  @Post('delete')
  @UsePipes(new JoiValidationPipe(idJoi))
  async delete(@Body() body: { id: number }) {
    return this.service.deleteUser(body.id);
  }

  @Post('delete_all')
  @UsePipes(new DevOnlyPipe())
  async deleteAll() {
    return this.service.deleteAll();
  }

  @Post('delete_all_exclude_super')
  @UsePipes(new DevOnlyPipe())
  async deleteAllExcludeSuper() {
    return this.service.deleteAllExcludeSuper();
  }

  @Post('update')
  @UsePipes(new JoiValidationPipe(userUpdateJoi))
  async update(@Body() body: UserUpdateDto) {
    await this.service.update(body);
  }

  @Post('update_avatar')
  async updateAvatar(@Req() request: FastifyRequest) {
    const form = formidable();
    const [fields, files] = await form.parse(request.raw);
    const uploaderId = 12;
    const path = await this.service.updateAvatar({
      uploaderId,
      file: Object.values(files)[0][0],
    });
    return {
      path,
    };
  }

  @Get('profile')
  @UsePipes(new JoiValidationPipe(userFindOneByIdJoi))
  async getProfile(@Query() query: UserFindOneByIdDto) {
    return {
      profile: await this.service.getUserProfile(query.id),
    };
  }

  @Get('current_user_profile')
  async getCurrentUserProfile(@CurrentUser() userId: number) {
    return {
      profile: await this.service.getUserProfile(userId),
    };
  }

  @Get('list')
  @UsePipes(new JoiValidationPipe(listJoi))
  async findOne(@Query() query: ListDto) {
    return await this.service.getList(query);
  }
}
