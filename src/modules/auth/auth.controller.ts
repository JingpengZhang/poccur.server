import { Body, Controller, ForbiddenException, Get, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../decorators/public.decorator';
import { CaptchaService } from '../../services/captcha.service';
import { JoiValidationPipe } from '../../pipes/joi-validation.pipe';
import { signInBodySchema, signUpSchema } from './auth.joi.schema';
import { SignInBody, SignUpDto } from './auth.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly service: AuthService, private readonly captchaService: CaptchaService) {
  }

  @Post('/sign-up')
  @Public()
  @UsePipes(new JoiValidationPipe(signUpSchema))
  async signUp(@Body() body: SignUpDto) {
    return await this.service.signUp(body);
  }

  @Post('/sign-in')
  @Public()
  @UsePipes(new JoiValidationPipe(signInBodySchema))
  async signIn(@Body() body: SignInBody) {

    const { captchaCode, ...signInDto } = body;

    // 校验图形验证码
    if (!this.captchaService.validateCaptcha(captchaCode)) throw new ForbiddenException('验证码错误');

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