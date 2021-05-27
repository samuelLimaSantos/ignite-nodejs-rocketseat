import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rental/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rental/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppErrors } from "@shared/errors/AppErrors";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

dayjs.extend(utc);

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );

    if (carUnavailable) throw new AppErrors("Car is unavailable!");

    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(
      user_id
    );

    if (rentalOpenToUser)
      throw new AppErrors("There's a rental in progress for user!");

    const expectedDateNow = this.dateProvider.getDateNow();

    const compareDate = this.dateProvider.compareInHours(
      expectedDateNow,
      expected_return_date
    );

    const minimumHours = 24;

    if (compareDate < minimumHours) throw new AppErrors("Invalid return time!");

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailable(car_id, false);

    return rental;
  }
}

export { CreateRentalUseCase };
