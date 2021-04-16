import { Router } from "express";
import multer from "multer";

import multerConfig from "@config/upload";
import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarController";
import { CreateCarSpecificationsController } from "@modules/cars/useCases/createCarSpecification/createCarSpecificationController";
import { ListAvailableCarsController } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsController";
import { UploadCarImagesController } from "@modules/cars/useCases/uploadCarImage/UploadCarImagesController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const uploadImageCar = multer(multerConfig.upload("./tmp/car"));

const carRoutes = Router();
const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationsController = new CreateCarSpecificationsController();
const uploadCarImagesController = new UploadCarImagesController();

carRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle
);

carRoutes.get("/available", listAvailableCarsController.handle);

carRoutes.post(
  "/specifications/:id",
  ensureAuthenticated,
  ensureAdmin,
  createCarSpecificationsController.handle
);

carRoutes.post(
  "/images/:id",
  ensureAuthenticated,
  ensureAdmin,
  uploadImageCar.array("images"),
  uploadCarImagesController.handle
);

export { carRoutes };
