import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) {
  }

  async getSystemConfig() {
    const superUser = await this.userService.findSuper();
    return {
      superExist: !!superUser,
    };
  }
}