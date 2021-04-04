import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
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

  if (!authorizationToken) throw new AppErrors("Token is missing", 401);

  const [, token] = authorizationToken.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      "aa24f8e2bb73e109c93f4ed5f45c2b51"
    ) as IPayload;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(user_id);

    if (!user) throw new AppErrors("User does not exists", 404);

    request.user = user;

    next();
  } catch (error) {
    throw new AppErrors("Token is invalid", 401);
  }
}
