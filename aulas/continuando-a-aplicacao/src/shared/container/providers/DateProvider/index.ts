import { container } from "tsyringe";

import { IDateProvider } from "./IDateProvider";
import { DateProvider } from "./implementations/DateProvider";

container.registerSingleton<IDateProvider>("DateProvider", DateProvider);
