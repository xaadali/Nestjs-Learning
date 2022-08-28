import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './DB/Connection.module';
import { EmailHandlerModule } from './email-handler/email-handler.module';
import { ProductModule } from './producs/products.module';
import { S3StorageModule } from './s3Storage/s3Storage.module';

@Module({
  imports: [
    ProductModule,
    DatabaseModule,
    AuthModule,
    S3StorageModule,
    EmailHandlerModule,
    // MulterModule.register({
    //   dest: './uploads',
    // }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
