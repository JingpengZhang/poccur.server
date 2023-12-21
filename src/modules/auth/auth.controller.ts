import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { CaptchaService } from '../../common/services/captcha.service';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { AuthSignUpDto } from './dto/auth.sign-up.dto';
import { authSignUpJoi } from './joi/auth.sign-up.joi';
import { AuthSignInWithCaptchaDto } from './dto/auth.sign-in-with-captcha.dto';
import { authSignInWithCaptchaJoi } from './joi/auth.sign-in-with-captcha.joi';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Post('/sign-up')
  @Public()
  @UsePipes(new JoiValidationPipe(authSignUpJoi))
  async signUp(@Body() body: AuthSignUpDto) {
    return await this.service.signUp(body);
  }

  @Post('/sign-in')
  @Public()
  @UsePipes(new JoiValidationPipe(authSignInWithCaptchaJoi))
  async signIn(@Body() body: AuthSignInWithCaptchaDto) {
    const { captchaCode, ...signInDto } = body;

    // 校验图形验证码
    if (!this.captchaService.validateCaptcha(captchaCode))
      throw new ForbiddenException('验证码错误');

    return await this.service.signIn(signInDto);
  }

  @Public()
  @Get('captcha')
  getCaptcha() {
    return {
      captcha: this.captchaService.generateCaptcha(),
    };
  }
}
