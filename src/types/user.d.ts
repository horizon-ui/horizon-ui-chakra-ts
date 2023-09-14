import { Parlay } from "./bet";

export interface AccountBalance {
  USD: number;
  MBTK: number;
  CRDT: number;
}

export interface User {
  email: string;
  parlays: Parlay[];
  accountBalance: AccountBalance;
}

export interface UserAuth {
  authToken: string | undefined;
  refreshToken: string | undefined;
  isVerified?: boolean | any;
}
export type Code = {
  code: number | string;
  country: string;
};

export type Region = "US" | "India";
