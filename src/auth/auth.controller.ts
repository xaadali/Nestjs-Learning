import {
  Body,
  Controller,
  Injectable,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ForGetPasswordDto } from './dto/auth-forget-password.dto';
import { LoginCredientialsDto } from './dto/auth-login.dto';
import { RegisterUserDto } from './dto/auth-register.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { VerifyPinDto } from './dto/verify-pin.dto';
import { JwtAuthGuard } from './gaurd/jwt-auth.gaurd';
import { LocalAuthGuard } from './gaurd/local-auth.gaurd';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async registerUser(@Body() AuthCredentialsDto: RegisterUserDto) {
    return await this.authService.InsertNewUser(AuthCredentialsDto);
  }

  @Post('/forget-password')
  forgotPassword(@Body() ForgotPasswordParams: ForGetPasswordDto) {
    return this.authService.forgotPassword(ForgotPasswordParams);
  }

  @Post('/verify-pin')
  verifyPin(@Body() verifyPinParams: VerifyPinDto) {
    return this.authService.verifyPasswordResetPin(verifyPinParams);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/create-new-password')
  createNewPassword(
    @Body() newPasswordParams: NewPasswordDto,
    @Req() { user },
  ) {
    return this.authService.createNewPassword(newPasswordParams, user);
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
