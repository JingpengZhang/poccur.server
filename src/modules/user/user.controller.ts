import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../../pipes/joi-validation.pipe';
import { createUserSchema } from './user.joi.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { Public } from '../../decorators/public.decorator';

@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {
  }

  @Post('/create')
  @Public()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async create(@Body() body: CreateUserDto) {
    await this.service.create(body);
    return;
  }
}