import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignInDto } from './auth.joi.schema';
import { BcryptService } from '../../services/bcrypt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private bcryptService: BcryptService, private jwtService: JwtService) {
  }

  async signIn() {
    const signInDto: SignInDto = {
      email: 'jingpeng@test.com',
      password: 'SSSS22222',
    };

    const userInfo = await this.userService.findOneByEmail(signInDto);
    if (!this.bcryptService.comparePassword(signInDto.password, userInfo.password)) throw new UnauthorizedException();

    return {
      token: await this.jwtService.signAsync({
        id: userInfo._id,
        email: userInfo.email,
        roles: userInfo.roles,
      }),
    };
  }
}