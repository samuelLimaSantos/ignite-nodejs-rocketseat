import "./database";
import "reflect-metadata";
import express from "express";
import swaggerApi from "swagger-ui-express";

import { routes } from "./routes";
import swaggerFile from "./swagger.json";

const app = express();

app.use(express.json());

app.use("/api/v1", swaggerApi.serve, swaggerApi.setup(swaggerFile));

app.use(routes);

const port = 3333;

app.listen(port, () => console.log(`Listening at port ${port}`));
