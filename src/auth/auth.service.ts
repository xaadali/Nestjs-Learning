import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, userDocument } from 'src/DB/entities/auth.schema';
import * as bcrypt from 'bcrypt';
import { ForGetPasswordDto } from './dto/auth-forget-password.dto';
import {
  PasswordReset,
  PasswordResetDocument,
} from 'src/DB/entities/passwordReset.schema';
import { EmailHandlerService } from 'src/email-handler/email-handler.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<userDocument>,
    private readonly jwtService: JwtService,
    @InjectModel(PasswordReset.name)
    private readonly PasswordResetModel: Model<PasswordResetDocument>,
    private readonly emailService: EmailHandlerService,
  ) {}

  async InsertNewUser(AuthCredentialsDto) {
    let { password } = AuthCredentialsDto;
    const hashPassword = await bcrypt.hash(password, 10);
    return await this.userModel.create({
      ...AuthCredentialsDto,
      password: hashPassword,
    });
  }

  async userLogin(email: string, password: string) {
    const user = await this.userModel.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      throw new BadRequestException('User doest exist');
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken: string = await this.getJwtToken(user);
      return {
        status: 'success',
        data: {
          accessToken,
          user,
        },
      };
    } else {
      throw new BadRequestException('Wrong Cridentials');
    }
  }
  async changePassword(
    oldPassword: string,
    newPassword: string,
    userId: string,
  ) {
    try {
      const findUser = await this.userModel.findById(userId);
      if (!findUser) throw new NotFoundException({ message: 'user not found' });

      const verified = bcrypt.compareSync(oldPassword, findUser.password);
      if (!verified)
        throw new ForbiddenException({ message: "Password did't match" });

      const hashPassword = bcrypt.hashSync(newPassword, 8);

      const _user = await this.userModel.findByIdAndUpdate(
        { _id: userId },
        { password: hashPassword },
      );
      return 'password changed successfully';
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(ForgotPasswordParams: ForGetPasswordDto) {
    console.log(
      '🚀 ~ file: auth.service.ts ~ line 170 ~ AuthService ~ forgotPassword ~ ForgotPasswordParams',
      ForgotPasswordParams,
    );
    try {
      const { email } = ForgotPasswordParams;
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new NotFoundException('User with the given email not found');
      }

      let code = Math.floor(1000 + Math.random() * 9000);
      console.log(
        '🚀 ~ file: auth.service.ts ~ line 179 ~ AuthService ~ forgotPassword ~ code',
        code,
      );

      const mail = {
        to: email,
        subject: 'Password Reset Email',
        from: 'saad@yopmail.com',
        text: `Your password reset code is ${code}. Please do not share this with anyone.`,
      };

      await this.PasswordResetModel.create({
        email,
        code,
      });

      await this.emailService.sendEmail(mail);

      return {
        message: 'Password reset email has been sent successfully!',
      };
    } catch (err) {
      console.log(
        '🚀 ~ file: auth.service.ts ~ line 198 ~ AuthService ~ forgotPassword ~ err',
        err,
      );
      throw err;
    }
  }

  async getJwtToken(user: any, is2FaAuthenticated = false) {
    const payload: any = {
      userId: user.id,
    };
    return this.jwtService.sign(payload);
  }
}
