import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from './model/dto/request/login-request.dto';
import { SignupRequestDto } from './model/dto/request/signup-request.dto';

@Injectable()
export class AuthService {

  login(loginDto:LoginRequestDto) {

  }

  signUp(signupRequestDto: SignupRequestDto) {

  }

}
