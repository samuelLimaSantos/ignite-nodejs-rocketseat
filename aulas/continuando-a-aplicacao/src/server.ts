import "./database";
import "reflect-metadata";
import "./shared/container";
import express, { json, NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerApi from "swagger-ui-express";

import { AppErrors } from "./errors/AppErrors";
import { routes } from "./routes";
import swaggerFile from "./swagger.json";

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

const port = 3333;

app.listen(port, () => console.log(`Listening at port ${port}`));
