import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BcryptService } from '../../common/services/bcrypt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => FileModule)],
  controllers: [UserController],
  providers: [UserService, BcryptService],
  exports: [UserService],
})
export class UserModule {}
