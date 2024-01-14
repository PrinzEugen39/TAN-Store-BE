import nodemailer, { SentMessageInfo, Transporter } from "nodemailer";
import { logger } from "../../logger/winstonLogger";
import pug from "pug";
import { convert } from "html-to-text";

export default class Email {
  to: string;
  from: string;
  name: string;
  url: string;

  constructor(user: { email: string; name: string }, url: string) {
    this.to = user.email;
    this.from = `TAN Store admin <${process.env.EMAIL_FROM}>`;
    this.name = user.name;
    this.url = url;
  }

  newTransport(): Transporter<SentMessageInfo> {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "Brevo",
        host: process.env.PROD_EMAIL_BREVO_HOST,
        port: Number(process.env.PROD_EMAIL_BREVO_PORT),
        auth: {
          user: process.env.PROD_EMAIL_BREVO_LOGIN,
          pass: process.env.PROD_EMAIL_BREVO_SMTP,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject: string) {
    const template = pug.renderFile("views/welcome.pug", {
      firstName: this.name,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: convert(template),
      html: template,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async signUpEmail() {
    await this.send(`Welcome to TAN Store, ${this.name}`);
    logger.info("Email sent");
  }
}
