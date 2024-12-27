import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginRequestDto } from './model/dto/request/login-request.dto';
import { AuthService } from './auth.service';
import { SignupRequestDto } from './model/dto/request/signup-request.dto';


@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginRequestDto) {
    console.log("login request");
    console.log(loginDto);
  }

  @Post('signup')
  @HttpCode(201)
  signup(@Body() signupDto: SignupRequestDto) {

  }
  
}