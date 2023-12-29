import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import * as fs from 'fs';
import * as dayjs from 'dayjs';
import * as util from 'util';
import { pipeline } from 'stream';
import { File, FileExtraProperty } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericService } from '../../common/services/generic.service';
import { ListDto } from '../../common/dto/list.dto';
import { DeleteQueryDto } from '../../common/dto/delete-query.dto';
import type { File as TFile } from 'formidable';
import fileUtils from '../../common/utils/file-utils';
import { customAlphabet } from 'nanoid';
import { UserService } from '../user/user.service';
import { FileType } from '../../constants/file-type.enum';
import { CreateFileDto } from './dto/create-file.dto';
import { FolderService } from '../folder/folder.service';

const pump = util.promisify(pipeline);

@Injectable()
export class FileService extends GenericService<File> {
  constructor(
    @InjectRepository(File)
    private readonly repository: Repository<File>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => FolderService))
    private readonly folderService: FolderService,
  ) {
    super(repository);
  }

  async storageFile(file: TFile) {
    const { name, extension } = fileUtils.getNameAndExtension(
      file.originalFilename,
    );

    const fileType = fileUtils.getFileTypeByExtension(extension);

    const now = dayjs();

    const storageLocation =
      fileUtils.getFileStorageLocationByType(fileType) +
      '/' +
      now.format('YYYYMMDD');

    if (!fs.existsSync(storageLocation)) fs.mkdirSync(storageLocation);

    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

    const fileName = name + '_' + nanoid() + '.' + extension;

    const filePath = storageLocation + '/' + fileName;

    fs.renameSync(file.filepath, filePath);

    const publicPath = filePath.replace('./storage', '/public');

    return {
      publicPath,
      storagePath: filePath,
      fileName,
      fileType,
      fileExtension: extension,
    };
  }

  async upload(dto: CreateFileDto) {
    const { file, uploaderId, filename, folderId, ...rest } = dto;

    const uploader = await this.userService.findOneById(uploaderId);
    if (!uploader) throw new BadRequestException('非法上传');

    const folder = folderId
      ? await this.folderService.findOneById(folderId)
      : null;
    // 存储到磁盘
    const fileInfo = await this.storageFile(file);

    const fileEntity = new File();
    fileEntity.path = fileInfo.publicPath;
    fileEntity.filename = fileInfo.fileName;
    fileEntity.type = fileInfo.fileType;
    fileEntity.filesize = file.size;
    fileEntity.extension = fileInfo.fileExtension;
    fileEntity.uploader = uploader;
    fileEntity.storagePath = fileInfo.storagePath;
    fileEntity.extra = {};
    fileEntity.folder = folder;
    Object.assign(fileEntity, rest);

    if (fileInfo.fileType === FileType.Image) {
      const dimensions = fileUtils.getImageDimensions(fileInfo.storagePath);
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
      // const info = await this.saveFile(file, uploaderId);
      // data.push(info);
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
