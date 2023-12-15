import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './modules/client/client.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ClientModule,
    AdminModule,
    FileModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/poccur'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
