import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { Rental } from "@modules/rental/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rental/repositories/IRentalsRepository";
import { AppErrors } from "@shared/errors/AppErrors";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

dayjs.extend(utc);

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}

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

    const expectedReturnDate = dayjs(expected_return_date)
      .utc()
      .local()
      .format();

    const expectedDateNow = dayjs().utc().local().format();

    const compareDate = dayjs(expectedReturnDate).diff(
      expectedDateNow,
      "hours"
    );

    const minimumHours = 24;

    if (compareDate < minimumHours) throw new AppErrors("Invalid return time!");

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
