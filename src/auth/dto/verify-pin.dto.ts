import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPinDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
