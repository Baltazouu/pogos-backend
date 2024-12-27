import { IsEmail, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  mail: string;

  @MinLength(6)
  password: string;
}