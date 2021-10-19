import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

import { IMailProvider } from "../IMailProvider";

@injectable()
export class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch((err) => console.error(err));
  }

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    const templateFile = fs.readFileSync(path).toString("utf-8");

    const handlebarsTemplate = handlebars.compile(templateFile);

    const htmlTemplate = handlebarsTemplate(variables);

    const message = {
      from: "No reply <rentx@rentx.com>",
      to,
      subject,
      html: htmlTemplate,
    };

    const response = await this.client.sendMail(message);

    console.log("Message sent: %s", response.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(response));
  }
}
