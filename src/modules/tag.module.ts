import { Module } from '@nestjs/common';
import { TagController } from '../controllers/tag.controller';
import { TagService } from '../services/tag.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from '../schemas/tag.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tag.name,
        schema: TagSchema,
      },
    ]),
  ],
  controllers: [TagController],
  providers: [TagService],
})

export class TagModule {
}