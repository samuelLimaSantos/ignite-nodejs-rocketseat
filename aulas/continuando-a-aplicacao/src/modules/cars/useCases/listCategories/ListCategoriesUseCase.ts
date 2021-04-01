import { inject, injectable } from "tsyringe";

import { Category } from "../../entities/Category";
import { CategoryRepository } from "../../repositories/implementations/CategoriesRepository";

@injectable()
class ListCategoriesUseCase {
  constructor(
    @inject("CategoryRepository")
    private categoriesRepository: CategoryRepository
  ) {}
  async execute(): Promise<Category[]> {
    const categories = await this.categoriesRepository.list();

    return categories;
  }
}

export { ListCategoriesUseCase };
