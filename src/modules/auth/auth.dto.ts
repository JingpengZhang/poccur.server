import { Role } from './role.enum';

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignInBody extends SignInDto {
  captchaCode: string;
}

export interface SignUpDto {
  email: string;
  password: string;
  username?: string;
  autoSignIn?: boolean;
  roles?: Role[];
}