import "reflect-metadata";
import "../../container";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerApi from "swagger-ui-express";

import swaggerFile from "../../../swagger.json";
import { AppErrors } from "../../errors/AppErrors";
import createConnection from "../typeorm";
import { routes } from "./routes";

createConnection();
const app = express();

app.use(express.json());

app.use("/api/v1", swaggerApi.serve, swaggerApi.setup(swaggerFile));

app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppErrors) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal Server Error - ${err.message}`,
    });
  }
);

export { app };
