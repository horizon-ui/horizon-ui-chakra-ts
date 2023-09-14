import { PaymentTypes } from "../config/settingsValues";

export type TransferType = "deposit" | "withdraw";

export interface Transaction {
  transfer_list: any;
  status: string;
  type: string;
  amount: number;
  timestamp: string;
  transferredTo: string;
  via: string;
  id: string;
}
export interface PaymentProfile {
  isRegistered: boolean;
  isVerified: boolean;
  paymentMethods: PaymentMethod[];
}

export type PaymentMethod =
  | CCPaymentMethod
  | ACHPaymentMethod
  | OtherPaymentMethod;

export interface CCPaymentMethod extends BasePaymentMethod {
  type: "card";
  fullName: string;
  creditCardNumber: string;
  billingAddress?: Address;
  cvv: number;
  expirationDate: string;
}

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode: string;
  postalCode: string;
  countryCode?: string;
}

export interface ACHPaymentMethod extends BasePaymentMethod {
  type: "bank";
  accountNumber: string;
  routingNumber: string;
}

export interface OtherPaymentMethod extends BasePaymentMethod {
  type: Exclude<PaymentTypes, "card" | "bank">;
}

export interface BasePaymentMethod {
  id: string;
  type: PaymentTypes;
  name?: string;
  userId?: string;
}

export type TransferStatus = "pending" | "completed" | "rejected" | "na";

export interface Transfer {
  id: string;
  type: TransferType;
  status: TransferStatus;
  amount: number;
  date: string;
  paymentMethod?: Partial<PaymentMethod>;
}

export interface TransferAction {
  clientId: string;
  orderId: string;
}

export type RegistrationStatus = "none" | "pending" | "successful";

export interface RegistrationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  state: string;
}

export interface TransactionItem {
  items: { [id: string]: Transaction };
}

export type GiftCardType = "amazon" | "flipkart";
