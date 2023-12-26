import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from './user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BcryptService } from '../../common/services/bcrypt.service';
import { FileModule } from '../file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   {
    //     name: User.name,
    //     schema: UserSchema,
    //   },
    // ]),
    TypeOrmModule.forFeature([User]),
    FileModule,
  ],
  controllers: [UserController],
  providers: [UserService, BcryptService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
