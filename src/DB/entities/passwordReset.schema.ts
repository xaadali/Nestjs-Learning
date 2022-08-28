import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PasswordResetDocument = PasswordReset &
  Document & {
    _id?: any;
  };

@Schema({ timestamps: true })
export class PasswordReset {
  @Prop()
  email: string;

  @Prop()
  code: string;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);
