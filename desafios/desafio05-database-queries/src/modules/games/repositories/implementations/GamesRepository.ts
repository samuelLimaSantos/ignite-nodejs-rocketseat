import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder()
      .select()
      .where('title ILIKE :searchTerm', {searchTerm: `%${param}%`})
      .getMany();

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const games = await this.repository.query(`SELECT COUNT(id) FROM users;`);

    return games;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder()
      .relation(Game, "users")
      .of(id)
      .loadMany();
  }
}
