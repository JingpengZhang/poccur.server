import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { BcryptService } from '../../services/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private bcryptService: BcryptService, private jwtService: JwtService) {
  }

  async signIn(signInDto: SignInDto) {

    const userInfo = await this.userService.findOneByEmail(signInDto);
    if (!userInfo || !this.bcryptService.comparePassword(signInDto.password, userInfo.password)) throw new BadRequestException('登陆失败,用户名或密码错误');

    return {
      token: await this.jwtService.signAsync({
        id: userInfo._id,
        email: userInfo.email,
        roles: userInfo.roles,
      }),
    };
  }
}