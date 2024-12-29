import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { SignupRequestDto } from '../model/dto/request/signup-request.dto';
import { LoginRequestDto } from '../model/dto/request/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() signupRequest: SignupRequestDto) {
    return this.authService.signup(signupRequest);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginRequest: LoginRequestDto) {
    return this.authService.login(loginRequest);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile() {
    console.log("secured endpoint");
  }
  // getProfile(@Req() req) {
  //   return req.user;
  // }
}