import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailHandlerService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(
      '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',
    );
  }

  async sendEmail(mail: SendGrid.MailDataRequired) {
    try {
      const transport = await SendGrid.send(mail);
      return transport;
    } catch (err) {
      throw err;
    }
  }
}
