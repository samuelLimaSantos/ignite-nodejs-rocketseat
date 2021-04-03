import { Router } from "express";

import { AuthenticateController } from "../modules/accounts/useCases/authenticateUser/authenticateController";

const authenticateRoutes = Router();
const authenticateController = new AuthenticateController();

authenticateRoutes.post("/sessions", authenticateController.handle);

export { authenticateRoutes };
