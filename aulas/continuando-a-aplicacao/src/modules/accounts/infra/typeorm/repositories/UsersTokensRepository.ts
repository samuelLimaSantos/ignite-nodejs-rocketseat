import { getRepository, Repository } from "typeorm";

import { ICreateUserTokens } from "@modules/accounts/dtos/ICreateUserTokens";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUserTokens";

import { UserTokens } from "../entities/UserTokens";

export class UsersTokensRepository implements IUsersTokensRepository {
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

  async findByUserIdAndToken(
    token: string,
    user_id: string
  ): Promise<UserTokens> {
    const userToken = await this.repository.findOne({
      user_id,
      refresh_token: token,
    });

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
