import { Module } from '@nestjs/common';
import { AdminMenuController } from './admin-menu.controller';
import { AdminMenuService } from './admin-menu.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AdminMenu,
  AdminMenuSchema,
} from 'src/modules/admin-menu/admin-menu.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AdminMenu.name,
        schema: AdminMenuSchema,
      },
    ]),
  ],
  controllers: [AdminMenuController],
  providers: [AdminMenuService],
})
export class AdminMenuModule {}
