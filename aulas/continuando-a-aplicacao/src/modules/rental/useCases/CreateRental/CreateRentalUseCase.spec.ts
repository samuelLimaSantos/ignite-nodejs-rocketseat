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
    const rental = await createRentalUseCase.execute({
      user_id: "1234",
      car_id: "1234",
      expected_return_date: dateAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new Rental with an unavailable car", () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "1234",
        car_id: "1234",
        expected_return_date: dateAdd24Hours,
      });
      await createRentalUseCase.execute({
        user_id: "4321",
        car_id: "1234",
        expected_return_date: dateAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppErrors);
  });

  it("should not be able to create a new Rental with an unavailable user", () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "1234",
        car_id: "43123",
        expected_return_date: dateAdd24Hours,
      });
      await createRentalUseCase.execute({
        user_id: "1234",
        car_id: "1234",
        expected_return_date: dateAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppErrors);
  });

  it("should not be able to create a new Rental with expected_date less than 24 hours", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "1234",
        car_id: "43123",
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppErrors);
  });
});
