import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { AppErrors } from "@shared/errors/AppErrors";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authorizationToken = request.headers.authorization;

  const usersTokensRepository = new UsersTokensRepository();

  if (!authorizationToken) throw new AppErrors("Token is missing", 401);

  const [, token] = authorizationToken.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      auth.secret_refresh_token
    ) as IPayload;

    const user = await usersTokensRepository.findByUserIdAndToken(
      token,
      user_id
    );

    if (!user) throw new AppErrors("User does not exists", 404);

    request.user = user.user;

    next();
  } catch (error) {
    throw new AppErrors("Token is invalid", 401);
  }
}
