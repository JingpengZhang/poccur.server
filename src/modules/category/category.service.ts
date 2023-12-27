import { CategoryCreateDto } from './dto/category.create.dto';
import { CategoryUpdateDto } from './dto/category.update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { pinyin } from 'pinyin-pro';
import { QueryFailedExceptions } from '../../common/exceptions/query-failed-exceptions';
import { GenericService } from '../../common/services/generic.service';

@Injectable()
export class CategoryService extends GenericService<Category> {
  constructor(
    @InjectRepository(Category) private repository: Repository<Category>,
  ) {
    super(repository);
  }

  async create(dto: CategoryCreateDto) {
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

      const category = new Category();
      category.name = dto.name;
      category.alias = alias;
      Object.assign(category, dto);

      return await this.repository.save(category);
    } catch (err) {
      throw new QueryFailedExceptions(err);
    }
  }

  async update(dto: CategoryUpdateDto) {
    const { id, ...rest } = dto;
    const tag = await this.findOneById(dto.id);
    if (!tag) throw new NotFoundException('Tag not found');
    Object.assign(tag, rest);
    await this.repository.save(tag);
  }
}
