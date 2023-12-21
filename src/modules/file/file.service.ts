import { Injectable } from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import * as fs from 'fs';
import FileUtils from '../../utils/file-utils';
import * as dayjs from 'dayjs';
import { customAlphabet } from 'nanoid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileExtraProperty } from './file.schema';
import * as util from 'util';
import { pipeline } from 'stream';
import MongooseExceptions from '../../common/exceptions/MongooseExceptions';
import MongoUtils from '../../utils/mongo-utils';
import { FileType } from '../../constants/file-type.enum';
import { DeleteDocsDto } from '../../common/dto/delete-docs.dto';

const pump = util.promisify(pipeline);

@Injectable()
export class FileService {
  constructor(@InjectModel(File.name) private model: Model<File>) {}

  async saveFile(file: MultipartFile, uploaderId: string) {
    const { name, extension } = FileUtils.splitFileNameAndExtension(
      file.filename,
    );
    const fileType = FileUtils.getFileTypeByExtension(extension);

    const now = dayjs();

    const fileLocation =
      FileUtils.getFileStorageLocationByType(fileType) +
      '/' +
      now.format('YYYYMMDD');

    if (!fs.existsSync(fileLocation)) await fs.mkdirSync(fileLocation);

    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

    const fileName = name + '_' + nanoid() + '.' + extension;

    const filePath = fileLocation + '/' + fileName;

    await pump(file.file, fs.createWriteStream(filePath));

    const fileStat = fs.statSync(filePath);

    // 存储文件信息到数据库
    const publicPath = filePath.replace('./storage', '/public');

    const modelInfo = {
      path: publicPath,
      filename: fileName,
      type: fileType,
      filesize: fileStat.size,
      extension: extension,
      uploadTime: now.valueOf(),
      uploader: uploaderId,
      storagePath: filePath,
      extra: {},
    };

    if (fileType === FileType.Image) {
      const dimensions = FileUtils.getImageDimensions(filePath);
      (modelInfo.extra as FileExtraProperty).width = dimensions.width;
      (modelInfo.extra as FileExtraProperty).height = dimensions.height;
    }

    try {
      const fileModel = new this.model(modelInfo);
      await fileModel.save();

      return {
        id: fileModel._id,
        path: publicPath,
      };
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async saveFiles(
    files: AsyncIterableIterator<MultipartFile>,
    uploaderId: string,
  ) {
    const data = [];
    for await (const file of files) {
      const info = await this.saveFile(file, uploaderId);
      data.push(info);
    }

    return data;
  }

  async delete(dto: DeleteDocsDto) {
    const { ids } = dto;
    let deleteCount = 0;
    for await (const id of ids) {
      try {
        const doc = MongoUtils.formatDoc(await this.model.findById(id));
        await this.model.deleteOne({ _id: id });
        fs.rmSync(doc.storagePath);
        deleteCount++;
      } catch (err) {
        throw new MongooseExceptions(err);
      }
    }
    return deleteCount;
  }
}
