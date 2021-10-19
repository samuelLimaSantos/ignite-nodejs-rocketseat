import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuid } from "uuid";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { DateProvider } from "@shared/container/providers/DateProvider/implementations/DateProvider";
import { EtherealMailProvider } from "@shared/container/providers/MailProvider/implementations/EtherealMailProvider";
import { AppErrors } from "@shared/errors/AppErrors";

@injectable()
export class SendForgotPasswordMailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: DateProvider,
    @inject("MailProvider")
    private mailProvider: EtherealMailProvider
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppErrors("User does not exists!");
    }

    const token = uuid();

    const expires_date = this.dateProvider.addHours(3);

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token: token,
      expires_date,
    });

    const variables = {
      name: user.name,
      link: `${process.env.EMAIL_TEMPLATE_URL}${token}`,
    };

    const filePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "forgotPassword.hbs"
    );

    await this.mailProvider.sendMail(
      email,
      "Recuperação de Senha",
      variables,
      filePath
    );
  }
}
