import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Multipart, MultipartFile } from '@fastify/multipart';
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
import { UserService } from '../user/user.service';
import { FileType } from '../../constants/file-type.enum';
import { CreateFileDto } from './dto/create-file.dto';
import { FolderService } from '../folder/folder.service';
import { StorageService } from '../../common/services/storage.service';
import { Folder } from '../folder/folder.entity';
import FileUtils from 'src/utils/file-utils';

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
    private readonly storageService: StorageService,
  ) {
    super(repository);
  }

  // 存储文件到指定文件夹
  async uploadFiles(userId: number, parts: AsyncIterableIterator<Multipart>) {
    // 文件夹
    let folder: Folder;

    // 上传者
    const uploader = await this.userService.findOneById(userId);

    if (uploader) {
      // 文件数据库实体数组
      const fileEntities: File[] = [];

      // 循环处理传入的 parts （包含字段和文件）
      for await (const part of parts) {
        if (part.type === 'file') {
          // 分离文件名称及后缀
          const { name, extension } = fileUtils.getNameAndExtension(
            part.filename,
          );

          // 替换文件名中的空格为 "_"
          const originFileName = name.replaceAll(' ', '_');

          // 获取文件类型
          const fileType = fileUtils.getFileTypeByExtension(extension);

          // 获取文件存储目录
          const storageDir =
            this.storageService.getUserStoragePath(userId, fileType, true) +
            '/';

          // 防重名标识
          const nanoid = this.storageService.getRandomString();

          // 获取最终文件名
          let fileName = originFileName + '_' + nanoid + '.' + extension;

          // 获取最终文件存储地址
          const storagePath = storageDir + fileName;

          // 将文件存储到本地
          await pump(part.file, fs.createWriteStream(storagePath));

          // 读取文件信息
          const stat = fs.statSync(storagePath);

          // 构造数据库存储实体
          const fileEntity = new File();
          fileEntity.path =
            this.storageService.transferToPublicPath(storagePath);
          fileEntity.filename = fileName;
          fileEntity.extension = extension;
          fileEntity.storagePath = storagePath;
          fileEntity.type = fileType;
          fileEntity.filesize = stat.size;
          fileEntity.uploader = uploader;

          // 素材附加信息
          let extra: FileExtraProperty = {};
          // 如果文件为图片类型，获取图片分辨率
          if (fileType === FileType.Image) {
            const dimensions = fileUtils.getImageDimensions(storagePath);
            extra.width = dimensions.width;
            extra.height = dimensions.height;
          } else if (fileType === FileType.Video) {
            // 如果文件为视频类型

            // 获取视频时长
            const duration = await FileUtils.getVideoDuration(storagePath);
            extra.duration = duration;

            // 封面存储地址
            const thumbPath =
              storageDir + originFileName + '_' + nanoid + '_thumb.jpg';

            // 截取封面
            await FileUtils.generateVideoThumb(storagePath, thumbPath);

            // 存储封面文件
            extra.thumb = thumbPath;
          } else if (fileType === FileType.Audio) {
            // 如果文件为音频类型
            // 获取音频时长
            extra.duration = await FileUtils.getAudioDuration(storagePath);
          }
          fileEntity.extra = extra;

          // 将数据实体存储实体数组
          fileEntities.push(fileEntity);
        } else {
          if (part.fieldname === 'folder_id') {
            const folderId = parseInt(part.value as string);

            // 查找文件夹实体
            folder = await this.folderService.findOneById(folderId);
          }
        }
      }

      // 将文件夹id保存到数据库实体上，并将实体存储到数据库中
      for (let i = 0; i < fileEntities.length; i++) {
        const entity = fileEntities[i];
        entity.folder = folder || null;
        await this.repository.save(entity);
      }
    }
    return;
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
