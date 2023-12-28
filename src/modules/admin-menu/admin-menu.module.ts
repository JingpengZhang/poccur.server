import { Module } from '@nestjs/common';
import { AdminMenuController } from './admin-menu.controller';
import { AdminMenuService } from './admin-menu.service';
import { AdminMenu } from 'src/modules/admin-menu/admin-menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AdminMenu])],
  controllers: [AdminMenuController],
  providers: [AdminMenuService],
})
export class AdminMenuModule {}
