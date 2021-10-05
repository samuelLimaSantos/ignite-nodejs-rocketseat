import { ICreateUserTokens } from "../dtos/ICreateUserTokens";
import { UserTokens } from "../infra/typeorm/entities/UserTokens";

interface IUsersTokensRepository {
  create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokens): Promise<UserTokens>;
}

export { IUsersTokensRepository };
