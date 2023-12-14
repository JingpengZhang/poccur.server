import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { BcryptService } from '../../services/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from './auth.dto';
import MongooseExceptions from '../../exceptions/MongooseExceptions';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private bcryptService: BcryptService, private jwtService: JwtService) {
  }

  async signIn(signInDto: SignInDto) {

    try {
      const userInfo = await this.userService.findOneByEmail(signInDto);
      if (!userInfo || !this.bcryptService.comparePassword(signInDto.password, userInfo.password)) throw new BadRequestException('登陆失败,用户名或密码错误');

      return {
        token: await this.jwtService.signAsync({
          id: userInfo._id,
          email: userInfo.email,
          roles: userInfo.roles,
        }),
        userInfo: {
          id: userInfo._id,
          username: userInfo.username,
          email: userInfo.email,
          roles: userInfo.roles,
          avatar: userInfo.avatar,
          registerTime: userInfo.registerTime,
          description: userInfo.description,
        },
      };
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const { autoSignIn, ...rest } = signUpDto;
    await this.userService.create(rest);
    if (autoSignIn) {
      return await this.signIn(rest);
    }
  }
}