import { Category } from "../model/Category";

interface ICategoryRepository {
  name: string;
  description: string;
}

class CategoryRepository {
  private categories: Category[];

  constructor() {
    this.categories = [];
  }

  public create({ name, description }: ICategoryRepository): void {
    const category = new Category();

    Object.assign(category, {
      name,
      description,
      created_at: new Date(),
    });

    this.categories.push(category);
  }

  public list(): Category[] {
    return this.categories;
  }

  public findByName(name: string): Category | undefined {
    return this.categories.find((category) => category.name === name);
  }
}

export { CategoryRepository };
