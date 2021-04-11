import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { CreateCarUseCase } from "../createCar/CreateCarUseCase";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let createCarUseCase: CreateCarUseCase;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("should be able to list all available cars", async () => {
    await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    const availableCars = await listAvailableCarsUseCase.execute({});

    expect(availableCars).toContainEqual(
      expect.objectContaining({ available: true })
    );
  });

  it("should be able to list cars by  brand", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    const availableCars = await listAvailableCarsUseCase.execute({
      brand: "Brand",
    });

    expect(availableCars).toContain(car);
  });

  it("should be able to list cars by  name", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    const availableCars = await listAvailableCarsUseCase.execute({
      name: "Name Car",
    });

    expect(availableCars).toContain(car);
  });

  it("should be able to list cars by  category", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    const availableCars = await listAvailableCarsUseCase.execute({
      category_id: "category",
    });

    expect(availableCars).toContain(car);
  });
});
