import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rental/repositories/in-memory/RentalsRepositoryInMemory";
import { DateProvider } from "@shared/container/providers/DateProvider/implementations/DateProvider";
import { AppErrors } from "@shared/errors/AppErrors";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dateProvider: DateProvider;

describe("CreateRental", () => {
  const dateAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dateProvider = new DateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new Rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Car test",
      daily_rate: 100,
      license_plate: "test",
      fine_amount: 40,
      brand: "brand",
      category_id: "1234",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "1234",
      car_id: car.id,
      expected_return_date: dateAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new Rental with an unavailable user", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "123456",
      car_id: "1111",
      expected_return_date: dateAdd24Hours,
    });
    await expect(
      createRentalUseCase.execute({
        user_id: "123456",
        car_id: "121212",
        expected_return_date: dateAdd24Hours,
      })
    ).rejects.toEqual(new AppErrors("There's a rental in progress for user!"));
  });

  it("should not be able to create a new Rental with an unavailable car", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "test",
      expected_return_date: dateAdd24Hours,
      user_id: "123456",
    });
    await expect(
      createRentalUseCase.execute({
        user_id: "321",
        car_id: "test",
        expected_return_date: dateAdd24Hours,
      })
    ).rejects.toEqual(new AppErrors("Car is unavailable!"));
  });

  it("should not be able to create a new Rental with expected_date less than 24 hours", async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: "1234",
        car_id: "43123",
        expected_return_date: new Date(),
      })
    ).rejects.toEqual(new AppErrors("Invalid return time!"));
  });
});
