import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from './tag.schema';
import { Model, QueryOptions, Types } from 'mongoose';
import { DeleteDocsDto } from '../../common/dto/delete-docs.dto';
import { TagCreateDto } from './dto/tag.create.dto';
import { TagUpdateDto } from './dto/tag.update.dto';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private model: Model<Tag>) {}

  async create(dto: TagCreateDto) {
    const tagModel = new this.model(dto);
    const tag = await tagModel.save();
    return tag._id;
  }

  async update(dto: TagUpdateDto) {
    const { id, ...rest } = dto;
    await this.model.findByIdAndUpdate(id, rest);
  }

  async delete(dto: DeleteDocsDto) {
    const { ids, all } = dto;
    let deleteArr: Types.ObjectId[] = ids;
    if (all) {
      const allTagDoc = await this.model.find({});
      deleteArr = [];
      allTagDoc.forEach((item) => {});
    }
    const result = await this.model.deleteMany({ _id: { $in: deleteArr } });
    return result.deletedCount;
  }

  async list(dto: QueryOptions) {
    return this.model.find({}, null, dto).populate('creator', 'username id');
  }

  async count() {
    return this.model.countDocuments();
  }
}
