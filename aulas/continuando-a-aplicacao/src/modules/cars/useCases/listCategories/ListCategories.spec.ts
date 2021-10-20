import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";

let connection: Connection;

describe("List Categories", () => {
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

  it("should be able to list all categories", async () => {
    const authenticateResponse = await request(app).post("/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    });

    const { refresh_token } = authenticateResponse.body;

    await request(app)
      .post("/categories")
      .send({
        name: "Category name",
        description: "Category Supertest",
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe("Category name");
    expect(response.body[0]).toHaveProperty("id");
  });
});
