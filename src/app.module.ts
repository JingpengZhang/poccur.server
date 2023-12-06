import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './modules/blog/blog.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    BlogModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/poccur'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
