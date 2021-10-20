import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DateProvider } from "@shared/container/providers/DateProvider/implementations/DateProvider";
import { EtherealMailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/EtherealMailProviderInMemory";
import { AppErrors } from "@shared/errors/AppErrors";

import { SendForgotPasswordMailUseCase } from "./sendForgotPasswordMailUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepository: UsersTokensRepositoryInMemory;
let dateProvider: DateProvider;
let mailProvider: EtherealMailProviderInMemory;
let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;

describe("SendForgotPasswordMailUseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DateProvider();
    mailProvider = new EtherealMailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepository,
      dateProvider,
      mailProvider
    );
  });

  it("should be able to send an email to a forgot user", async () => {
    const spy = spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      driver_license: "123456",
      email: "rojozome@luhba.mv",
      name: "Mattie Mathis",
      password: "123456",
    });

    await sendForgotPasswordMailUseCase.execute("rojozome@luhba.mv");

    expect(spy).toHaveBeenCalled();
  });

  it("should not be able to send an email to a inexistent user", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("hojpo@kud.uz")
    ).rejects.toEqual(new AppErrors("User does not exists!"));
  });

  it("should be able to generate a token", async () => {
    const generateTokenMail = spyOn(usersTokensRepository, "create");

    await usersRepositoryInMemory.create({
      driver_license: "403519",
      email: "foz@siokri.com",
      name: "Derek Griffin",
      password: "123456",
    });

    await sendForgotPasswordMailUseCase.execute("foz@siokri.com");

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
