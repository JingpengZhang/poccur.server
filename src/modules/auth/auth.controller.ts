import { Body, Controller, ForbiddenException, Get, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../decorators/public.decorator';
import { CaptchaService } from '../../services/captcha.service';
import { JoiValidationPipe } from '../../pipes/joi-validation.pipe';
import { signInSchema } from './auth.joi.schema';
import { SignInDto } from './auth.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly service: AuthService, private readonly captchaService: CaptchaService) {
  }

  @Post('/sign-in')
  @Public()
  @UsePipes(new JoiValidationPipe(signInSchema))
  async signIn(@Body() body: SignInDto) {

    // 校验图形验证码
    if (!this.captchaService.validateCaptcha(body.captchaCode)) throw new ForbiddenException('验证码错误');

    const result = await this.service.signIn(body);
    return {
      token: result.token,
    };
  }

  @Public()
  @Get('captcha')
  getCaptcha() {
    return {
      captcha: this.captchaService.generateCaptcha(),
    };
  }
}