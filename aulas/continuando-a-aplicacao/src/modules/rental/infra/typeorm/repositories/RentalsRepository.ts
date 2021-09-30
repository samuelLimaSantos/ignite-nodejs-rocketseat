import { getRepository, Repository } from "typeorm";

import { ICreateRentalsDTO } from "@modules/rental/dtos/CreateRentalsDTO";
import { IRentalsRepository } from "@modules/rental/repositories/IRentalsRepository";

import { Rental } from "../entities/Rental";

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const openCar = await this.repository.findOne({
      where: {
        car_id,
        end_date: null,
      },
    });

    return openCar;
  }
  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const openUser = await this.repository.findOne({
      where: {
        user_id,
        end_date: null,
      },
    });

    return openUser;
  }
  async create({
    car_id,
    expected_return_date,
    user_id,
    id,
    end_date,
    total,
  }: ICreateRentalsDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      expected_return_date,
      user_id,
      id,
      end_date,
      total,
    });

    await this.repository.save(rental);

    return rental;
  }

  async findById(id: string): Promise<Rental> {
    const rental = await this.repository.findOne(id);

    return rental;
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rental = await this.repository.find({
      where: {
        user_id,
      },
      relations: ["car"],
    });

    return rental;
  }
}

export { RentalsRepository };
