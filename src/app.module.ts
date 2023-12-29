import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { TagModule } from './modules/tag/tag.module';
import MongooseTransformPlugin from './common/plugins/mongoose-transform.plugin';
import { AdminMenuModule } from './modules/admin-menu/admin-menu.module';
import { CategoryModule } from './modules/category/category.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { FolderModule } from './modules/folder/folder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/poccur', {
      connectionFactory: (connection) => {
        connection.plugin(MongooseTransformPlugin);
        return connection;
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'zhang123456',
      database: 'poccur',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AdminMenuModule,
    UserModule,
    AuthModule,
    CategoryModule,
    FileModule,
    TagModule,
    FolderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
