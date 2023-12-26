import { Injectable } from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import * as fs from 'fs';
import FileUtils from '../../utils/file-utils';
import * as dayjs from 'dayjs';
import { customAlphabet } from 'nanoid';
// import { File, FileExtraProperty } from './file.schema';
import * as util from 'util';
import { pipeline } from 'stream';
import { FileType } from '../../constants/file-type.enum';
import { File, FileExtraProperty } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericService } from '../../common/services/generic.service';
import { ListDto } from '../../common/dto/list.dto';
import { DeleteQueryDto } from '../../common/dto/delete-query.dto';

const pump = util.promisify(pipeline);

@Injectable()
export class FileService extends GenericService<File> {
  constructor(@InjectRepository(File) private repository: Repository<File>) {
    super(repository);
  }

  async saveFile(file: MultipartFile, uploaderId: number) {
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

    const fileEntity = new File();
    fileEntity.path = publicPath;
    fileEntity.filename = fileName;
    fileEntity.type = fileType;
    fileEntity.filesize = fileStat.size;
    fileEntity.extension = extension;
    // @ts-ignore
    fileEntity.uploader = uploaderId;
    fileEntity.storagePath = filePath;
    fileEntity.extra = {};

    // const modelInfo = {
    //   path: publicPath,
    //   filename: fileName,
    //   type: fileType,
    //   filesize: fileStat.size,
    //   extension: extension,
    //   uploadTime: now.valueOf(),
    //   uploader: uploaderId,
    //   storagePath: filePath,
    //   extra: {},
    // };

    if (fileType === FileType.Image) {
      const dimensions = FileUtils.getImageDimensions(filePath);
      (fileEntity.extra as FileExtraProperty).width = dimensions.width;
      (fileEntity.extra as FileExtraProperty).height = dimensions.height;
    }

    return await this.repository.save(fileEntity);
  }

  async saveFiles(
    files: AsyncIterableIterator<MultipartFile>,
    uploaderId: number,
  ) {
    const data = [];
    for await (const file of files) {
      const info = await this.saveFile(file, uploaderId);
      data.push(info);
    }
    return data;
  }

  async getList(dto: ListDto) {
    return await super.list(dto, {
      relations: {
        uploader: true,
      },
      select: {
        uploader: {
          id: true,
          username: true,
        },
      },
    });
  }

  async deleteFiles(dto: DeleteQueryDto) {
    let toDeleteIds = (
      Array.isArray(dto.data) ? dto.data : [dto.data]
    ) as number[];

    for await (const id of toDeleteIds) {
      const file = await this.repository.findOneBy({ id });
      if (file) {
        fs.rmSync(file.storagePath);
      }
    }

    return await super.delete(toDeleteIds);
  }

  async deleteAllFiles() {
    const files = await this.repository.find();

    const storagePaths = files.map((item) => item.storagePath);

    for (const path of storagePaths) {
      fs.rmSync(path);
    }

    return await super.deleteAll();
  }
}
