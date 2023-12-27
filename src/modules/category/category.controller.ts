import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { FastifyRequest } from 'fastify';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/role.decorator';
import { Role } from '../../constants/role.enum';
import { categoryCreateJoi } from './joi/category.create.joi';
import { CategoryCreateDto } from './dto/category.create.dto';
import { categoryUpdateJoi } from './joi/category.update.joi';
import { CategoryUpdateDto } from './dto/category.update.dto';
import { deleteQueryJoi } from '../../common/joi/delete-query.joi';
import { DeleteQueryDto } from '../../common/dto/delete-query.dto';
import { DevOnlyPipe } from '../../common/pipes/dev-only.pipe';
import { ListDto } from '../../common/dto/list.dto';
import { listJoi } from '../../common/joi/list.joi';

@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post('create')
  // @Roles(Role.Super, Role.Admin)
  @UsePipes(new JoiValidationPipe(categoryCreateJoi))
  async create(
    @Req() request: FastifyRequest,
    @Body() body: CategoryCreateDto,
  ) {
    const category = await this.service.create({
      creator: request['user'].id,
      ...body,
    });
    return {
      id: category.id,
    };
  }

  @Post('update')
  // @Roles(Role.Super, Role.Admin)
  @UsePipes(new JoiValidationPipe(categoryUpdateJoi))
  async update(@Body() body: CategoryUpdateDto) {
    await this.service.update(body);
    return;
  }

  @Post('delete')
  // @Roles(Role.Super, Role.Admin)
  @UsePipes(new JoiValidationPipe(deleteQueryJoi))
  async delete(@Body() body: DeleteQueryDto) {
    return {
      deleteCount: await this.service.delete(body.data),
    };
  }

  @Post('delete_all')
  @Public()
  @UsePipes(new DevOnlyPipe())
  async deleteAll() {
    return await this.service.deleteAll();
  }

  @Get('list')
  @Public()
  @UsePipes(new JoiValidationPipe(listJoi))
  async list(@Query() query: ListDto) {
    return {
      list: await this.service.list(query),
      total: await this.service.count(),
    };
  }
}
