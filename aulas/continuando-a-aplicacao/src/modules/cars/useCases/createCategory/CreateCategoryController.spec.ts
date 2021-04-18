import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";

let connection: Connection;

describe("Create te Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const id = uuidv4();

    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, admin, created_at, driver_license)
      VALUES('${id}', 'admin', 'admin@rentx.com', '${password}', true, 'now()', 'XXX-1111')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it("should be able to create a new category", async () => {
    const authenticateResponse = await request(app).post("/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    });

    const { token } = authenticateResponse.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category name",
        description: "Category Supertest",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("should be able to create a new category with the same name", async () => {
    const authenticateResponse = await request(app).post("/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    });

    const { token } = authenticateResponse.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category name",
        description: "Category Supertest",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
