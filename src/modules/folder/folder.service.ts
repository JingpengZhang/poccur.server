import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GenericService } from '../../common/services/generic.service';
import { Folder } from './folder.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { FolderCreateDto } from './dto/folder.create.dto';
import { FolderUpdateDto } from './dto/folder.update.dto';
import { EntityIdDto } from '../../common/dto/entity-id.dto';
import { FileService } from '../file/file.service';
import { File } from '../file/file.entity';

@Injectable()
export class FolderService extends GenericService<Folder> {
  constructor(
    @InjectRepository(Folder) private repository: Repository<Folder>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
  ) {
    super(repository);
  }

  async create(creatorId: number, dto: FolderCreateDto) {
    const { parent, ...rest } = dto;

    // 父文件夹
    const parentFolder = await this.repository.findOne({
      where: {
        id: parent,
      },
    });

    // 检查父文件夹下是否已存在同名文件夹
    const nameExistInParentFolder =
      (
        await this.repository.find({
          where: {
            parent: parentFolder
              ? {
                  id: parentFolder.id,
                }
              : IsNull(),
            name: dto.name,
          },
        })
      ).length !== 0;

    if (nameExistInParentFolder)
      throw new BadRequestException('该文件夹下已存在同名文件夹');

    const folder = new Folder();
    folder.creator = await this.userService.findOneById(creatorId);
    folder.parent = parentFolder;
    Object.assign(folder, rest);
    return this.repository.save(folder);
  }

  async update(dto: FolderUpdateDto) {
    const { id, parent, ...rest } = dto;

    const folder = await this.repository.findOneBy({ id });

    if (id === parent) throw new BadRequestException('ParentID不能为自身');
    folder.parent = await this.repository.findOne({
      where: {
        id: parent,
      },
    });
    Object.assign(folder, rest);

    return await this.repository.save(folder);
  }

  async getChildren(dto: EntityIdDto) {
    let files: File[] = [];
    let folders: Folder[] = [];

    const folder = await this.repository.findOne({
      where: {
        id: dto.id,
      },
      relations: {
        children: true,
        files: true,
      },
    });

    if (folder) {
      files = folder.files;
      folders = folder.children;
    } else {
      folders = await this.repository.find({
        where: {
          parent: IsNull(),
        },
      });
      files = await this.fileService.find({
        where: {
          folder: IsNull(),
        },
      });
    }

    return {
      files,
      folders,
    };
  }
}
