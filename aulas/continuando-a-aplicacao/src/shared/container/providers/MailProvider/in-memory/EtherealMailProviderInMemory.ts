import { IMailProvider } from "../IMailProvider";

export class EtherealMailProviderInMemory implements IMailProvider {
  private mail: any[] = [];

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    this.mail.push({
      to,
      subject,
      variables,
    });
  }
}
