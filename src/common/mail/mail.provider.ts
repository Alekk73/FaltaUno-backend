import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { MailConfirmationTemplate } from './templates/mail-confirmation.template';

@Injectable()
export class MailProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendConfirmationEmail(to: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    const msg = {
      to,
      from: process.env.EMAIL_SENDGRID,
      subject: 'Confirma tu cuenta',
      html: MailConfirmationTemplate(process.env.FRONTEND_URL),
    };

    try {
      await sgMail.send(msg);
    } catch (error: any) {
      console.error(error);
      if (error.response) console.error(error.response.body);
      throw new Error('Error al enviar el email');
    }
  }
}
