import { ICategoryRepository } from "../../repositories/ICategoriesRepository";

interface IRequest {
  name: string;
  description: string;
}

class CreateCategoryUseCase {
  /**
   * O mesmo que:
   * categoriesRepository: CategoryRepository
   * constructor (categoriesRepository: CategoryRepository) {
   *  this.categoriesRepository = categoriesRepository;
   * }
   */
  constructor(private categoriesRepository: ICategoryRepository) {}

  public execute({ name, description }: IRequest): void {
    const categoryAlreadyExists = this.categoriesRepository.findByName(name);

    if (categoryAlreadyExists) throw new Error("Category Already Exists");

    this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };
