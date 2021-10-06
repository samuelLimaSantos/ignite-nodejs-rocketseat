import { Router } from "express";

import { AuthenticateController } from "@modules/accounts/useCases/authenticateUser/authenticateController";
import { RefreshTokenController } from "@modules/accounts/useCases/refreshTokens/refreshTokenController";

const authenticateRoutes = Router();
const authenticateController = new AuthenticateController();
const refreshTokenController = new RefreshTokenController();

authenticateRoutes.post("/sessions", authenticateController.handle);
authenticateRoutes.post("/refresh-token", refreshTokenController.handle);

export { authenticateRoutes };
