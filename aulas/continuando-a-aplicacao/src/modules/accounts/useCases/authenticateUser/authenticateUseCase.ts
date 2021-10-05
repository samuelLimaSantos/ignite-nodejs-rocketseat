import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUserTokens";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppErrors } from "@shared/errors/AppErrors";

import authConfig from "../../../../config/auth";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokenRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    const {
      secret_token,
      refresh_token_days,
      refresh_token_expires_in,
      secret_refresh_token,
      token_expires_in,
    } = authConfig;

    if (!user) throw new AppErrors("Email or password incorrect");

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) throw new AppErrors("Email or password incorrect");

    const token = sign({}, secret_token, {
      subject: user.id,
      expiresIn: token_expires_in,
    });

    const refresh_token = sign({ email }, secret_refresh_token, {
      subject: user.id,
      expiresIn: refresh_token_expires_in,
    });

    const expires_date = this.dateProvider.addDays(refresh_token_days);

    await this.usersTokenRepository.create({
      expires_date,
      refresh_token,
      user_id: user.id,
    });

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
      refresh_token,
    };
  }
}

export { AuthenticateUseCase };
