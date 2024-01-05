import { forwardRef, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from './file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { FolderModule } from '../folder/folder.module';
import { StorageService } from '../../common/services/storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    forwardRef(() => UserModule),
    forwardRef(() => FolderModule),
  ],
  controllers: [FileController],
  providers: [FileService, StorageService],
  exports: [FileService],
})
export class FileModule {}
