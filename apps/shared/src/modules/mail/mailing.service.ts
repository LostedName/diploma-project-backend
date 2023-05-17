import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailingService {
  private url: string;
  private sender: string;
  private password: string;
  private transport: nodemailer.Mailer;

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get<string>('BACKEND_URL');

    const env = this.configService.get<string>('NODE_ENV');
    if (env === 'dev') {
      const port = this.configService.get<number>('FRONT_PORT');
      this.url = this.url + ':' + port;
    }

    const host = this.configService.get<number>('MAILER_HOST');
    const port = this.configService.get<number>('MAILER_PORT');

    this.sender = this.configService.get<string>('MAILER_LOGIN');
    this.password = this.configService.get<string>('MAILER_PASSWORD');

    const mailerConfig = { host, port, secure: false, auth: { user: this.sender, pass: this.password } };
    this.transport = nodemailer.createTransport(mailerConfig);
  }

  async sendConfirmationEmail(username: string, email: string, token: string) {
    const subject = 'Spinach account confirmation';
    const html = `
      <div>
        <h1>Account confirmation</h1>
        <h2>Hello ${username}!</h2>
        <p>Thank you for using our service. Please verify your account by clicking on the following link</p>
        <a href=${this.url}/confirm?token=${token}>Click here</a>
      </div>`;

    this.transport
      .sendMail({
        from: this.sender,
        to: email,
        subject,
        html,
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async sendAuthCode(username: string, email: string, authCode: string) {
    const subject = 'Please confirm that you is an account owner';
    const html = `
      <div>
        <h1>Login Confirmation</h1>
        <h2>Hello ${username}</h2>
        <p>You must confirm that you is trying to login in our system.</p>
        <p>Confirmation code: <h2>${authCode}</h2></p>
        <p>This code will be unvalid after 30 minutes</p>
      </div>`;

    this.transport
      .sendMail({
        from: this.sender,
        to: email,
        subject,
        html,
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async sendChangePasswordLink(username: string, email: string, token: string) {
    const subject = 'Please confirm that you is an account owner';
    const html = `
      <div>
        <h1>Reset password</h1>
        <h2>Hello ${username}!</h2>
        <p>Password reset link</p>
        <a href=${this.url}/reset-password?token=${token}>Click here</a>
      </div>`;

    this.transport
      .sendMail({
        from: this.sender,
        to: email,
        subject,
        html,
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
