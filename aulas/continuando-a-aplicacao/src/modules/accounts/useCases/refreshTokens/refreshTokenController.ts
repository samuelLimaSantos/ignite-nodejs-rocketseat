import { Request, Response } from "express";
import { container } from "tsyringe";

import { RefreshTokenUseCase } from "./refreshTokensUseCase";

export class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const token =
      request.body.token ||
      request.headers["x-access-token"] ||
      request.query.token;

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

    const refreshToken = await refreshTokenUseCase.execute(token);

    return response.status(200).json({ refresh_token: refreshToken });
  }
}
