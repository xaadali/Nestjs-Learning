import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/DB/Connection.module';
import { EmailHandlerModule } from 'src/email-handler/email-handler.module';
import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { JWTStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    EmailHandlerModule,
    JwtModule.register({
      secret: 'f809bba1fedbc42d26135e5aaab72b9c',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JWTStrategy],
})
export class AuthModule {}
