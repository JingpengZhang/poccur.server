import { BadRequestException, Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
  private captcha: svgCaptcha.CaptchaObj;

  generateCaptcha() {
    this.captcha = svgCaptcha.create({
      background: '#37373d',
      color: false,
      size: 4,
      noise: 2,
      ignoreChars: '0o1i',
      width: 120,
      height: 46,
    });
    return this.captcha.data;
  }

  validateCaptcha(str: string) {
    try {
      return this.captcha.text.toUpperCase() === str.toUpperCase();
    } catch (err) {
      throw new BadRequestException('验证码已过期');
    }
  }
}
