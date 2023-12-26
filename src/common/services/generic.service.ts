import { FindManyOptions, Repository } from 'typeorm';
import { ListDto } from '../dto/list.dto';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { DeleteDto } from '../dto/delete.dto';
import {
  FindOptionsRelationByString,
  FindOptionsRelations,
} from 'typeorm/find-options/FindOptionsRelations';

export class GenericService<T> {
  constructor(private readonly _repository: Repository<T>) {}

  async findOneById(id: number) {
    // @ts-ignore
    return await this._repository.findOneBy({ id });
  }

  async find() {
    return await this._repository.find();
  }

  async count() {
    return await this._repository.count();
  }

  /**
   * 获取列表数据
   * @param dto
   * @param options
   */
  async list(dto: ListDto, options?: FindManyOptions<T>) {
    const page = dto.page | 1;
    const pageSize = dto.pageSize | 10;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    return {
      list: await this._repository.find({
        ...options,
        skip,
        take,
      }),
      currentPage: page,
      pageSize: pageSize,
      total: await this.count(),
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
}
