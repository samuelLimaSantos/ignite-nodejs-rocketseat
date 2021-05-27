interface IDateProvider {
  compareInHours(startDate: Date, endDate: Date): number;
  convertToUtc(date: Date): string;
  getDateNow(): Date;
  compareInDays(startDate: Date, endDate: Date): number;
}

export { IDateProvider };
