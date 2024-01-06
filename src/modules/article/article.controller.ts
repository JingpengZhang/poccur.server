import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createArticleJoi } from './joi/create-article.joi';
import { updateArticleJoi } from './joi/update-article.joi';
import { UpdateArticleDto } from './dto/update-article.dto';
import { deleteQueryJoi } from '../../common/joi/delete-query.joi';
import { DeleteQueryDto } from '../../common/dto/delete-query.dto';
import { listJoi } from '../../common/joi/list.joi';
import { ListDto } from '../../common/dto/list.dto';
import { idJoi } from '../../common/joi/id.joi';
import { EntityIdDto } from '../../common/dto/entity-id.dto';
import { getListByTagJoi } from './joi/get-list-by-tag.joi';
import { GetListByTagDto } from './dto/get-list-by-tag.dto';

@Controller('article')
export class ArticleController {
  constructor(private service: ArticleService) {}

  @Post('create')
  @UsePipes(new JoiValidationPipe(createArticleJoi))
  async create(@CurrentUser() userId: number, @Body() body: CreateArticleDto) {
    return await this.service.create(userId, body);
  }

  @Post('delete')
  @UsePipes(new JoiValidationPipe(deleteQueryJoi))
  async delete(@Body() body: DeleteQueryDto) {
    return await this.service.delete(body.data);
  }

  @Post('soft_delete')
  @UsePipes(new JoiValidationPipe(deleteQueryJoi))
  async softDelete(@Body() body: DeleteQueryDto) {
    return await this.service.softDelete(body.data);
  }

  @Post('update')
  @UsePipes(new JoiValidationPipe(updateArticleJoi))
  async update(@Body() body: UpdateArticleDto) {
    await this.service.update(body);
  }

  @Get('list')
  @UsePipes(new JoiValidationPipe(listJoi))
  async list(@Query() query: ListDto) {
    return await this.service.list(query);
  }

  @Get('deleted_list')
  @UsePipes(new JoiValidationPipe(listJoi))
  async deletedList(@Query() query: ListDto) {
    return await this.service.deletedList(query);
  }

  @Get('detail')
  @UsePipes(new JoiValidationPipe(idJoi))
  async detail(@Query() query: EntityIdDto) {
    return await this.service.detail(query);
  }

  @Get('get_list_by_tag')
  @UsePipes(new JoiValidationPipe(getListByTagJoi))
  async getListByTag(@Query() query: GetListByTagDto) {
    return await this.service.getListByTag(query);
  }
}
