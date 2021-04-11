import { Request, Response, NextFunction } from "express";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppErrors } from "@shared/errors/AppErrors";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { id } = request.user;

  const usersRepository = new UsersRepository();

  const { admin } = await usersRepository.findById(id);

  if (!admin) throw new AppErrors("User is not an admin");

  next();
}
