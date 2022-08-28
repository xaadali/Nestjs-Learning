import {
  Body,
  Controller,
  Injectable,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ForGetPasswordDto } from './dto/auth-forget-password.dto';
import { LoginCredientialsDto } from './dto/auth-login.dto';
import { RegisterUserDto } from './dto/auth-register.dto';
import { LocalAuthGuard } from './gaurd/local-auth.gaurd';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() AuthCredentialsDto: RegisterUserDto) {
    return await this.authService.InsertNewUser(AuthCredentialsDto);
  }

  @Post('/forgot-password')
  forgotPassword(@Body() ForgotPasswordParams: ForGetPasswordDto) {
    return this.authService.forgotPassword(ForgotPasswordParams);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginUser(@Body() LoginCridentials: LoginCredientialsDto) {
    return await this.authService.userLogin(
      LoginCridentials.email,
      LoginCridentials.password,
    );
  }
}
