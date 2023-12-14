import { Module } from '@nestjs/common';
import { MenuModule } from './modules/menu/menu.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MenuModule,UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {
}
