import { Body, Controller, Get, Post, Query, Req, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../../pipes/joi-validation.pipe';
import { createUserSchema, findOneByIdSchema, updateUserSchema } from './user.joi.schema';
import { UserService } from './user.service';
import { CreateUserDto, FindOneUserByIdDto, UpdateUserDto } from './user.dto';
import { Public } from '../../decorators/public.decorator';
import { FastifyRequest } from 'fastify';

@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {
  }

  @Post('create')
  @Public()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async create(@Body() body: CreateUserDto) {
    await this.service.create(body);
    return;
  }

  @Get('profile')
  @Public()
  @UsePipes(new JoiValidationPipe(findOneByIdSchema))
  async getProfile(@Query() query: FindOneUserByIdDto) {
    return {
      profile: await this.service.findOneById(query),
    };
  }

  @Post('update')
  @Public()
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  async update(@Body() body: UpdateUserDto) {
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
  async getUserInfoById(@Query() query) {
    await this.service.findOneById(query);
  }
}