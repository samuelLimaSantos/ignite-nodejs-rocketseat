import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";

@Entity("rentals")
class Rental {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  car_id: string;

  @Column()
  user_id: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  expected_return_date: Date;

  @Column()
  total: number;

  @CreateDateColumn()
  created_at: number;

  @UpdateDateColumn()
  updated_at: number;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}

export { Rental };
