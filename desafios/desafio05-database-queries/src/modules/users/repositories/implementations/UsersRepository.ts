import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const users = await this.repository.query(`SELECT * FROM users ORDER BY first_name ASC;`);
    return users;
  }


  async findUserByFullName({first_name, last_name}: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const users = await this.repository.query(
      `SELECT * FROM users WHERE LOWER(users.first_name) = LOWER($1) AND LOWER(users.last_name) = LOWER($2);`,
      [first_name, last_name]
    );

    return users;

  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    const user = await  this.repository.findOne({
      relations: ["games"],
      where: {
        id: user_id
      }
    });

    return user;
  }

}
