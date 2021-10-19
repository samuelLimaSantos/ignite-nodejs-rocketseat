interface IDateProvider {
  compareInHours(startDate: Date, endDate: Date): number;
  convertToUtc(date: Date): string;
  getDateNow(): Date;
  compareInDays(startDate: Date, endDate: Date): number;
  addDays(days: number): Date;
  addHours(hours: number): Date;
  compareIfBefore(start_date: Date, end_date: Date): boolean;
}

export { IDateProvider };
