import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { AppErrors } from "@shared/errors/AppErrors";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe("Create Category", () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

  it("should be able to create a new category", async () => {
    const category = {
      name: "Categoria Teste",
      description: "Descrição Categoria teste",
    };

    await createCategoryUseCase.execute(category);

    const expected = await categoriesRepositoryInMemory.findByName(
      category.name
    );

    expect(expected).toHaveProperty("id");
  });

  it("should be not able to create a category with the same name", () => {
    expect(async () => {
      const category = {
        name: "Categoria Teste",
        description: "Descrição Categoria teste",
      };

      await createCategoryUseCase.execute(category);
      await createCategoryUseCase.execute(category);
    }).rejects.toBeInstanceOf(AppErrors);
  });
});
