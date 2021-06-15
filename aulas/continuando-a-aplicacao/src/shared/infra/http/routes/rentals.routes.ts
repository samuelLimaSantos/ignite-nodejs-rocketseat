import { Router } from "express";

import { CreateRentalController } from "@modules/rental/useCases/CreateRental/CreateRentalController";
import { DevolutionRentalController } from "@modules/rental/useCases/DevolutionRental/DevolutionRentalController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const rentalsRoutes = Router();
const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();

rentalsRoutes.post("/", ensureAuthenticated, createRentalController.handle);
rentalsRoutes.post(
  "/devolution/:id",
  ensureAuthenticated,
  devolutionRentalController.handle
);

export { rentalsRoutes };
