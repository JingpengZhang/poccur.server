import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { BcryptService } from '../../common/services/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { AuthSignUpDto } from './dto/auth.sign-up.dto';
import { AuthSignInDto } from './dto/auth.sign-in.dto';
import { Role } from '../../constants/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: AuthSignInDto) {
    const user = await this.userService.findOneByEmail(dto.email);
    if (
      !user ||
      !this.bcryptService.comparePassword(dto.password, user.password)
    )
      throw new BadRequestException('登陆失败,用户名或密码错误');

    return {
      token: await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        roles: user.roles,
      }),
    };
  }

  '';

  async signUp(signUpDto: AuthSignUpDto) {
    const { autoSignIn, ...rest } = signUpDto;

    await this.userService.create(rest);
    if (autoSignIn) {
      return await this.signIn(rest);
    }
  }

  async signUpSuper(dto: AuthSignUpDto) {
    // 检查 Super 用户是否已存在
    const superUser = await this.userService.findSuper();
    if (superUser)
      throw new BadRequestException('Super 用户已存在,请勿重复注册');

    dto.roles = [Role.User, Role.Super];
    return await this.signUp(dto);
  }
}
