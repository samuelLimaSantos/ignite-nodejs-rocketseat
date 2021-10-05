import { getRepository, Repository } from "typeorm";

import { ICreateUserTokens } from "@modules/accounts/dtos/ICreateUserTokens";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUserTokens";

import { UserTokens } from "../entities/UserTokens";

export class UserTokensRepository implements IUsersTokensRepository {
  repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokens): Promise<UserTokens> {
    const userToken = this.repository.create({
      expires_date,
      refresh_token,
      user_id,
    });

    await this.repository.save(userToken);

    return userToken;
  }
}
