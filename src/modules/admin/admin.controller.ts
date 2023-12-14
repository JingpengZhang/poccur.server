import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from '../../decorators/public.decorator';

@Controller('/admin')
export class AdminController {
  constructor(protected readonly service: AdminService) {
  }

  @Get('/system-config')
  @Public()
  async getSystemConfig() {
    return await this.service.getSystemConfig();
  }
}