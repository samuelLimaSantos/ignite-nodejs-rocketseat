import { verify, sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUserTokens";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppErrors } from "@shared/errors/AppErrors";

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<string> {
    const { sub, email } = verify(token, auth.secret_refresh_token) as IPayload;

    const userToken = await this.usersTokensRepository.findByUserIdAndToken(
      token,
      sub
    );

    if (!userToken) {
      throw new AppErrors("Refresh token does not exists");
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: sub,
      expiresIn: auth.refresh_token_expires_in,
    });

    const expires_date = this.dateProvider.addDays(auth.refresh_token_days);

    await this.usersTokensRepository.create({
      expires_date,
      refresh_token,
      user_id: sub,
    });

    return refresh_token;
  }
}
