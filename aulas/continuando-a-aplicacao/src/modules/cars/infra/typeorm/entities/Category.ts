import { Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("categories")
class Category {
  @PrimaryColumn("uuid")
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @UpdateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}

export { Category };
