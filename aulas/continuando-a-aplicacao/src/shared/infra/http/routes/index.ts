import { Router } from "express";

import { authenticateRoutes } from "./authenticate.routes";
import { carRoutes } from "./car.routes";
import { categoriesRoutes } from "./categories.routes";
import { rentalsRoutes } from "./rentals.routes";
import { specificationsRoutes } from "./specifications.routes";
import { usersRoutes } from "./users.routes";

const routes = Router();

routes.use("/categories", categoriesRoutes);
routes.use("/specifications", specificationsRoutes);
routes.use("/users", usersRoutes);
routes.use("/cars", carRoutes);
routes.use(authenticateRoutes);
routes.use("/rentals", rentalsRoutes);

export { routes };
