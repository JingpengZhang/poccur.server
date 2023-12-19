import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from '../schemas/tag.schema';
import { Model, QueryOptions, Types } from 'mongoose';
import { CreateTagDto, UpdateTagDto } from '../dto/tag.dto';
import { DeleteDocsDto } from '../dto/common.dto';
import MongoUtils from '../common/mongo-utils';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private model: Model<Tag>) {
  }


  async create(dto: CreateTagDto) {
    const tagModel = new this.model(dto);
    const tag = await tagModel.save();
    return tag._id;
  }

  async update(dto: UpdateTagDto) {
    const { id, ...rest } = dto;
    await this.model.findByIdAndUpdate(id, rest);
  }

  async delete(dto: DeleteDocsDto) {
    const { ids, all } = dto;
    let deleteArr: Types.ObjectId[] = ids;
    if (all) {
      const allTagDoc = await this.model.find({});
      deleteArr = [];
      allTagDoc.forEach(item => {
        deleteArr.push(item._id);
      });
      console.log(deleteArr);
    }
    const result = await this.model.deleteMany({ _id: { $in: deleteArr } });
    return result.deletedCount;
  }

  async list(dto: QueryOptions) {
    return MongoUtils.formatDocs(await this.model.find({}, null, dto));
  }

  async count() {
    return this.model.countDocuments();
  }
}