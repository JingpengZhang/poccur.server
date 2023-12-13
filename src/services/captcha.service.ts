import { BadRequestException, Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
  private captcha: svgCaptcha.CaptchaObj;

  generateCaptcha() {
    this.captcha = svgCaptcha.create({
      color: true,
      size: 6,
      noise: 2,
      ignoreChars: '0o1i',
    });
    return this.captcha.data;
  }

  validateCaptcha(str: string) {
    try {
      return this.captcha.text === str;
    } catch (err) {
      throw new BadRequestException('验证码已过期');
    }
  }
}