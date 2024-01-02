import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { TagService } from './tag.service';
import { Public } from '../../common/decorators/public.decorator';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { TagCreateDto } from './dto/tag.create.dto';
import { tagUpdateJoi } from './joi/tag.update.joi';
import { TagUpdateDto } from './dto/tag.update.dto';
import { deleteQueryJoi } from '../../common/joi/delete-query.joi';
import { DeleteQueryDto } from '../../common/dto/delete-query.dto';
import { ListDto } from '../../common/dto/list.dto';
import { DevOnlyPipe } from '../../common/pipes/dev-only.pipe';
import { listJoi } from '../../common/joi/list.joi';
import { tagCreateJoi } from './joi/tag.create.joi';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('/tag')
export class TagController {
  constructor(private readonly service: TagService) {}

  @Post('create')
  // @Roles(Role.Super, Role.Admin)
  @UsePipes(new JoiValidationPipe(tagCreateJoi))
  async create(@CurrentUser() userId: number, @Body() body: TagCreateDto) {
    const tag = await this.service.create(body);
    return {
      id: tag.id,
    };
  }

  @Post('update')
  // @Roles(Role.Super, Role.Admin)
  @UsePipes(new JoiValidationPipe(tagUpdateJoi))
  async update(@Body() body: TagUpdateDto) {
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
