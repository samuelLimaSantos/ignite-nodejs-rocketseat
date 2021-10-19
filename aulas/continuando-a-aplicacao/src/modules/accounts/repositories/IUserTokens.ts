import { ICreateUserTokens } from "../dtos/ICreateUserTokens";
import { UserTokens } from "../infra/typeorm/entities/UserTokens";

interface IUsersTokensRepository {
  create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokens): Promise<UserTokens>;

  findByUserIdAndToken(token: string, user_id: string): Promise<UserTokens>;

  deleteById(id: string): Promise<void>;

  findByRefreshToken(refresh_token: string): Promise<UserTokens>;
}

export { IUsersTokensRepository };
