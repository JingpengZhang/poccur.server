import { Module } from '@nestjs/common';
import { MenuModule } from './modules/menu/menu.module';

@Module({
  imports: [MenuModule],
  providers: [],
})
export class AdminModule {}
