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
        subject: 'Sua confirmação de cadastro no News Daily!',
        html: `<div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
  <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: bold; color: #18181b;">
    News Daily - Seu dia começa aqui!
  </p>

  <h1 style="margin: 0 0 16px 0; font-size: 20px; color: #18181b;">
    Bem-vindo(a), ${name}! 
  </h1>

  <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #3f3f46;">
    Sua conta foi criada com sucesso. A partir de agora você faz parte do News Daily!.
  </p>

  <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #3f3f46;">
    Todos os dias, enviaremos aqui para o seu e-mail um novo desafio de algoritmo ou estrutura de dados, no estilo LeetCode, para você treinar e evoluir sua lógica de programação sem sair da rotina.
  </p>

  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #3f3f46;">
    Fique de olho na sua caixa de entrada — o primeiro desafio já está a caminho!
  </p>

  <p style="margin: 0; font-size: 11px; color: #a1a1aa;">
    © 2026 news-daily. Todos os direitos reservados.
  </p>
</div>`,
      });
    } catch (err) {
      throw new ConflictException();
    }
  }
}
