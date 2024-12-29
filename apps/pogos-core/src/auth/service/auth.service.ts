import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from '../model/dto/request/login-request.dto';
import { TokenService } from './token.service';
import { SignupRequestDto } from '../model/dto/request/signup-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginRequest: LoginRequestDto) {
    const user = await this.usersService.findOneByEmail(loginRequest.email);
    if (!user) {
      throw new NotFoundException('Email not found !');
    }
    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return this.tokenService.generateTokens({
      sub: user.id,
      email: user.email,
    });
  }

  async signup(user: SignupRequestDto) {
    if (await this.usersService.existsByEmail(user.email)) {
      throw new ConflictException('Email already exists');
    }
    user.password = await bcrypt.hash(user.password, 10);

    const savedUser = await this.usersService.create(user);
    const payload = { sub: savedUser.id, email: savedUser.email };
    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(payload);

    return {
      message: 'User successfully registered',
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.tokenService.verifyToken(refreshToken);
      const payload = { sub: decoded.sub, email: decoded.email };
      const { accessToken, refreshToken: newRefreshToken } =
        this.tokenService.generateTokens(payload);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

