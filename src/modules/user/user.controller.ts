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
import { DeleteDocsDto } from '../../common/dto/delete-docs.dto';
import { deleteDocsJoi } from '../../common/joi/delete-docs.joi';
import { ListDto } from '../../common/dto/list.dto';
import { listJoi } from '../../common/joi/list.joi';
import { DeleteDto } from '../../common/dto/delete.dto';
import { DevOnlyPipe } from '../../common/pipes/dev-only.pipe';
import { deleteQueryJoi } from '../../common/joi/delete-query.joi';
import { DeleteQueryDto } from '../../common/dto/delete-query.dto';

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
  @UsePipes(new JoiValidationPipe(deleteQueryJoi))
  async delete(@Body() body: DeleteQueryDto) {
    return this.service.delete(body.data);
  }

  @Post('delete_all')
  @UsePipes(new DevOnlyPipe())
  async deleteAll() {
    return this.service.deleteAll();
  }

  @Post('update')
  @UsePipes(new JoiValidationPipe(userUpdateJoi))
  async update(@Body() body: UserUpdateDto) {
    await this.service.update(body);
  }

  @Post('update_avatar')
  async updateAvatar(@Req() request: FastifyRequest) {
    const file = await request.file();
    // const uploaderId = request['user'].id;
    const uploaderId = 12;
    const path = await this.service.updateAvatar({
      uploaderId,
      file,
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
  async getCurrentUserProfile(@Req() request: FastifyRequest) {
    return {
      profile: await this.service.getUserProfile(request['user'].id),
    };
  }

  @Get('list')
  @UsePipes(new JoiValidationPipe(listJoi))
  async findOne(@Query() query: ListDto) {
    return await this.service.getList(query);
  }
}
