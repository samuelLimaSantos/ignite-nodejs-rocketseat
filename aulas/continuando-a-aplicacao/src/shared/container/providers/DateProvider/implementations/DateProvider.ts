import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DateProvider implements IDateProvider {
  getDateNow(): Date {
    return dayjs().toDate();
  }

  convertToUtc(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  compareInHours(startDate: Date, endDate: Date): number {
    const startDateUtc = this.convertToUtc(startDate);
    const endDateUtc = this.convertToUtc(endDate);

    return dayjs(endDateUtc).diff(startDateUtc, "hours");
  }

  compareInDays(startDate: Date, endDate: Date): number {
    const startDateUtc = this.convertToUtc(startDate);
    const endDateUtc = this.convertToUtc(endDate);

    return dayjs(endDateUtc).diff(startDateUtc, "days");
  }

  addDays(days: number): Date {
    return dayjs().add(days, "days").toDate();
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, "hour").toDate();
  }

  compareIfBefore(start_date: Date, end_date: Date): boolean {
    return dayjs(start_date).isBefore(end_date);
  }
}

export { DateProvider };
