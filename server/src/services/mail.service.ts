import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface IMailService {
  sendActivationMail(email: string, link: string): void;
}

class MailService implements IMailService {
  private transporter: ReturnType<typeof nodemailer.createTransport>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || '',
      port: Number(process.env.SMTP_PORT) || 0,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  public sendActivationMail = async (email: string, link: string) => {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER || '',
      to: email,
      subject: `Acctivation accaunt on ${process.env.API_URL}`,
      text: '',
      html: `
                        <div>
                              <h1>Tap on link for acctivation accaunt</h1>
                              <a href="${link}">${link}</a>
                        </div>
                  `,
    });
  };
}

export default new MailService();
