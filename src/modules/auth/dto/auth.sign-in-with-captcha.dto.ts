import { AuthSignInDto } from './auth.sign-in.dto';

export interface AuthSignInWithCaptchaDto extends AuthSignInDto {
  captchaCode: string;
}
