import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { MailConfirmationTemplate } from './templates/mail-confirmation.template';
import { MailChangePasswordTemplate } from './templates/mail-change-password.template';

@Injectable()
export class MailProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendConfirmationEmail(to: string, token: string) {
    await this.templateSendMails(
      to,
      'Confirma tu cuenta',
      'verificacion',
      token,
      MailConfirmationTemplate,
    );
  }

  async MailChangePassword(to: string, token: string) {
    await this.templateSendMails(
      to,
      'Solicitud cambio de contraseña',
      'recuperar-contrasena',
      token,
      MailChangePasswordTemplate,
    );
  }

  async templateSendMails(
    to: string,
    subject: string,
    route: string,
    token: string,
    template: any,
  ) {
    const url = `${process.env.FRONTEND_URL}/${route}?token=${token}`;

    const msg = {
      to,
      from: process.env.EMAIL_SENDGRID,
      subject: subject,
      html: template(url),
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
