import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailsService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendWelcomeEmail(to: string, name: string) {
    try {
        await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'luizfernandofardim@gmail.com', // add your e-mail for tests
      subject: 'Hello World',
      html: `<strong>Bem-vindo, ${name}!</strong>`,
    });
    } catch (err) {
        throw new ConflictException()
    }
    
  }
}