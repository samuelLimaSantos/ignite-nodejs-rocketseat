/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  export interface Request {
    user: {
      id: string;
      avatar: string;
      name: string;
      password: string;
      email: string;
      driver_license: string;
    };
  }
}
