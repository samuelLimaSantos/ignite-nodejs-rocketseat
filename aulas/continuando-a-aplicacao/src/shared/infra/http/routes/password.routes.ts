import { Router } from "express";

import { ResetPasswordController } from "@modules/accounts/useCases/resetPasswordUser/resetPasswordController";
import { SendForgotPasswordMailController } from "@modules/accounts/useCases/sendForgotPasswordMail/sendForgotPasswordMailController";

const passwordRoutes = Router();
const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetPasswordUserController = new ResetPasswordController();

passwordRoutes.post("/forgot", sendForgotPasswordMailController.handle);
passwordRoutes.post("/reset", resetPasswordUserController.handle);

export { passwordRoutes };
