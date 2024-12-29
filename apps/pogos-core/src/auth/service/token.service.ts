import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class TokenService {
  
  private jwtSecret = this.configService.get<string>('JWT_SECRET');

  constructor(private readonly jwtService:JwtService,private readonly configService:ConfigService) {}

  generateTokens(payload:any) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m', secret: this.jwtSecret });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '45m', secret: this.jwtSecret });
    return { accessToken, refreshToken }
  }

  verifyToken(token:string){
    return this.jwtService.verify(token, { secret: this.jwtSecret });
  }
}