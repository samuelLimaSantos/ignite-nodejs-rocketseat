import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppErrors } from "@shared/errors/AppErrors";

import { CreateCarSpecificationUseCase } from "./createCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("CreateCarSpecification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it("should be able to add a new car specification", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    await specificationsRepositoryInMemory.create({
      name: "specification test",
      description: "test",
    });

    await specificationsRepositoryInMemory.create({
      name: "specification2 test",
      description: "test",
    });

    const specification1 = await specificationsRepositoryInMemory.findByName(
      "specification test"
    );
    const specification2 = await specificationsRepositoryInMemory.findByName(
      "specification2 test"
    );

    const specifications_id = [specification1.id, specification2.id];

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationsCars).toHaveProperty("specifications");
    expect(specificationsCars.specifications.length).toBe(2);
  });

  it("should not be able to add a specification to a non existing car", async () => {
    expect(async () => {
      const car_id = "1234";

      const specifications_id = ["123", "1234"];

      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      });
    }).rejects.toBeInstanceOf(AppErrors);
  });
});
