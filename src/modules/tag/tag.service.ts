import { Injectable, NotFoundException } from '@nestjs/common';
import { TagCreateDto } from './dto/tag.create.dto';
import { TagUpdateDto } from './dto/tag.update.dto';
import { GenericService } from '../../common/services/generic.service';
import { Tag } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { pinyin } from 'pinyin-pro';
import { QueryFailedExceptions } from '../../common/exceptions/query-failed-exceptions';

@Injectable()
export class TagService extends GenericService<Tag> {
  constructor(
    @InjectRepository(Tag)
    private repository: Repository<Tag>,
  ) {
    super(repository);
  }

  async create(dto: TagCreateDto) {
    try {
      let alias = dto.alias || pinyin(dto.name, { type: 'array' }).join('_');

      let index = 1;

      while (
        (
          await this.repository.findBy({
            alias: (alias + '_' + index).toLowerCase(),
          })
        ).length !== 0
      ) {
        index++;
      }

      alias = (index === 1 ? alias : alias + '_' + index).toLowerCase();

      const tag = new Tag();
      tag.name = dto.name;
      tag.alias = alias;
      Object.assign(tag, dto);

      return await this.repository.save(tag);
    } catch (err) {
      throw new QueryFailedExceptions(err);
    }
  }

  async update(dto: TagUpdateDto) {
    const { id, ...rest } = dto;
    const tag = await this.findOneById(dto.id);
    if (!tag) throw new NotFoundException('Tag not found');
    Object.assign(tag, rest);
    await this.repository.save(tag);
  }
}
