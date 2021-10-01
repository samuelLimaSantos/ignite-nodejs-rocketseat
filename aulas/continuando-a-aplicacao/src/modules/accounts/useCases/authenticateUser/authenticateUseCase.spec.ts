import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { AppErrors } from "@shared/errors/AppErrors";

import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { AuthenticateUseCase } from "./authenticateUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUseCase: AuthenticateUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUseCase = new AuthenticateUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "user test",
      driver_license: "123456",
      email: "user@test.com",
      password: "123456",
    };

    await createUserUseCase.execute(user);

    const expected = await authenticateUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(expected).toHaveProperty("token");
  });

  it("should be not able to authenticate an user with nonexisting email", async () => {
    await expect(
      authenticateUseCase.execute({
        email: "email@nonexisting.com",
        password: "123456",
      })
    ).rejects.toEqual(new AppErrors("Email or password incorrect"));
  });

  it("should be not able to authenticate an user with incorrect password", async () => {
    const user: ICreateUserDTO = {
      name: "user test",
      driver_license: "123456",
      email: "user@test.com",
      password: "123456",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      })
    ).rejects.toEqual(new AppErrors("Email or password incorrect"));
  });
});
