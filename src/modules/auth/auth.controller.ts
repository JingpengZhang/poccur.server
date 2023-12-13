import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../decorators/public.decorator';

@Controller('/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {
  }

  @Public()
  @Post('/sign-in')
  async signIn() {
    const result = await this.service.signIn();
    return {
      token: result.token,
    };
  }
}