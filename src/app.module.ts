import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './modules/client/client.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ClientModule,
    AdminModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/poccur'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
