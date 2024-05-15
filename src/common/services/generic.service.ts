import {
  FindManyOptions,
  FindOneOptions,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { ListDto } from '../dto/list.dto';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { DeleteDto } from '../dto/delete.dto';
import { ListResult } from '../types/list-result';

export class GenericService<T> {
  constructor(private readonly _repository: Repository<T>) {}

  async findOneById(id: number) {
    // @ts-ignore
    return await this._repository.findOneBy({ id });
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return await this._repository.find(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    return await this._repository.findOne(options);
  }

  async count(options?: FindManyOptions<T>) {
    return await this._repository.count(options);
  }

  /**
   * 获取列表数据
   * @param dto
   * @param options
   */
  async list(
    dto: ListDto,
    options?: FindManyOptions<T>,
  ): Promise<ListResult<T>> {
    const page = dto.page || 1;

    const pageSize = dto.pageSize || 10;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    return {
      list: await this._repository.find({
        ...options,
        skip,
        take,
        order: {
          // @ts-ignore
          createdAt: 'DESC',
        },
      }),
      currentPage: page,
      pageSize: pageSize,
      total: await this.count(options),
    };
  }

  async delete(criteria: DeleteDto | FindOptionsWhere<T>) {
    return {
      count: (await this._repository.delete(criteria)).affected,
    };
  }

  async deleteAll() {
    return await this.delete({});
  }

  async softDelete(criteria: DeleteDto | FindOptionsWhere<T>) {
    return {
      count: (await this._repository.softDelete(criteria)).affected,
    };
  }

  async deletedList(dto: ListDto, options?: FindManyOptions<T>) {
    const result = await this.list(dto, {
      withDeleted: true,
      where: {
        // @ts-ignore
        deletedAt: Not(IsNull()),
      },
    });
    return {
      ...result,
      total: await this._repository.count({
        withDeleted: true,
        where: {
          // @ts-ignore
          deletedAt: Not(IsNull()),
        },
      }),
    };
  }
}
