import { Router } from "express";

import { CreateRentalController } from "@modules/rental/useCases/CreateRental/CreateRentalController";
import { DevolutionRentalController } from "@modules/rental/useCases/DevolutionRental/DevolutionRentalController";
import { ListRentalsByUserController } from "@modules/rental/useCases/ListRentalsByUser/ListRentalsByUserController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const rentalsRoutes = Router();
const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();
const listRentalsByUserController = new ListRentalsByUserController();

rentalsRoutes.post("/", ensureAuthenticated, createRentalController.handle);
rentalsRoutes.post(
  "/devolution/:id",
  ensureAuthenticated,
  devolutionRentalController.handle
);
rentalsRoutes.get(
  "/user",
  ensureAuthenticated,
  listRentalsByUserController.handle
);

export { rentalsRoutes };
