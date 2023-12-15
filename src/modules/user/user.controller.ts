import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../../pipes/joi-validation.pipe';
import { createUserSchema, findOneByIdSchema, updateUserSchema } from './user.joi.schema';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Public } from '../../decorators/public.decorator';

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
  async getProfile(@Query() query) {
    return {
      profile: await this.service.getProfile(query),
    };
  }

  @Post('update')
  @Public()
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  async update(@Body() body: UpdateUserDto) {
    await this.service.update(body);
  }
}