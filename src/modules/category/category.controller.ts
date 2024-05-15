import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { Public } from '../../common/decorators/public.decorator';
import { categoryCreateJoi } from './joi/category.create.joi';
import { CategoryCreateDto } from './dto/category.create.dto';
import { categoryUpdateJoi } from './joi/category.update.joi';
import { CategoryUpdateDto } from './dto/category.update.dto';
import { deleteQueryJoi } from '../../common/joi/delete-query.joi';
import { DeleteQueryDto } from '../../common/dto/delete-query.dto';
import { DevOnlyPipe } from '../../common/pipes/dev-only.pipe';
import { ListDto } from '../../common/dto/list.dto';
import { listJoi } from '../../common/joi/list.joi';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  // 添加分类
  @Post('create')
  // @Roles(Role.Super, Role.Admin)
  @UsePipes(new JoiValidationPipe(categoryCreateJoi))
  async create(@CurrentUser() userId: number, @Body() body: CategoryCreateDto) {
    const category = await this.service.create({
      creator: userId,
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
      ...(await this.service.list(query)),
    };
  }
}
