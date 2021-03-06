import { Request, Response } from "express";

import { ImportCategoriesUseCase } from "./ImportCategoriesUseCase";

class ImportCategoriesController {
  constructor(private importCategoriesUseCase: ImportCategoriesUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    await this.importCategoriesUseCase.execute(file);

    return response.status(201).send();
  }
}

export { ImportCategoriesController };
