import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Sport } from "./bet";
import {
  CCPaymentMethod,
  PaymentMethod,
  PaymentMethodType,
  RegistrationData,
  TransferType,
} from "./payment";

export type ScreenParamList = {
  // Registration
  PaymentMethodScreen: {
    type: WalletType;
    amount?: number;
    toBet?: boolean;
  };
  LoginScreen: undefined;
  LoginScreenDefault: undefined;
  PasswordReset: undefined;
  AddressScreen: undefined;
  HowToPlayScreen: undefined;
  HelpAndSupportScreen: undefined;
  OtpVerificationScreen: {
    phoneCode?: string;
    phoneNumber?: string;
    email?: string;
    type: OtpScreen;
    isVerified?: boolean;
  };
  ForgotPasswordScreen: {
    email: string;
  };
  SplashScreen: undefined;
  WalletScreen: {
    type: WalletType;
    amount?: number;
    toBet?: boolean;
  };
  RedeemScreen: {
    amount?: number;
  };
  RedeemSelectionScreen: {
    amount?: number;
  };
  RedeemFormScreen: {
    amount?: number;
    card?: number;
  };
  TokenWalletScreen: undefined;
  CreatePasswordScreen: undefined;
  SavePaymentScreen: undefined;
  WalletConfirmScreen: undefined;
  TransactionScreen: undefined;
  AccountUpdateScreen: undefined;
  CreateAccountEmailPasswordScreen: {
    phoneNumber?: string;
    email?: string;
  };
  CreateAccountNameDOBScreen: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    phoneNumber?: string;
    isSocial?: boolean;
  };
  CreateAccountSelectStateScreen: {
    payment?: RegistrationData;
  };
  CreateUsernameScreen: {
    idToken?: string;
    email?: string;
    phoneNumber?: string;
    givenName?: string;
    familyName?: string;
    birthDate?: string;
  };
  ChooseSportScreen: {
    firstTime: boolean;
    tutorial?: boolean;
  };
  RegistrationUsernameScreen: { email: string };
  RegistrationPlayingForScreen: { email: string };
  RegistrationPaymentNameScreen: { email: string };
  RegistrationPaymentDOBScreen: {
    email: string;
    payment: {
      firstName: string;
      lastName: string;
    };
  };
  RegistrationPaymentAddressScreen: {
    email: string;
    payment: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
    };
  };
  RegistrationPasswordScreen: {
    email: string;
    payment?: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      state: string;
    };
  };
  PasswordResetScreen: undefined;
  PasswordResetConfirmScreen: undefined;
  // Marketplace
  SportsScreen: { tutorial?: boolean; firstTime?: boolean };
  TestScreen: { tutorial?: boolean };
  MarketplaceScreen: { tutorial: 1 | 2 | 4; firstTime?: boolean };
  MatchScreen: { tutorial: 1 | 2 | 4 };

  CartScreen: undefined;
  CongratulationsModal: undefined;
  LeaderboardModal: undefined;
  // Ledger
  LedgerScreen: undefined;
  SettledPicksScreen: undefined;
  // Account
  AccountScreen: { tutorial: boolean };
  HelpModal: undefined;
  DeleteAccountModal: undefined;
  // Payment
  PlayingForScreen: undefined;
  PaymentRegistrationScreen: {
    type: TransferType;
    amount: number;
    toBet?: boolean;
    promo: string;
  };
  PaymentRegistrationScreenAddress: {
    type: TransferType;
    amount: number;
    toBet?: boolean;
    promo: string;
    registrationData?: Pick<
      RegistrationData,
      "firstName",
      "lastName",
      "dateOfBirth"
    >;
  };
  PaymentRegistrationPendingScreen: undefined;
  PaymentTransferScreen: {
    type: TransferType;
    amount?: number;
    toBet?: boolean;
  };
  PaymentMethodsScreen: {
    type: TransferType;
    amount: number;
    toBet?: boolean;
    registrationData?: RegistrationData;
    promo: string;
  };
  AddPaymentMethodScreen: {
    type: TransferType;
    amount: number;
    toBet?: boolean;
    registrationData?: RegistrationData;
    promo: string;
  };

  AddPaymentMethodBillingScreen: {
    type: TransferType;
    amount: number;
    toBet?: boolean;
    registrationData?: RegistrationData;
    promo: string;
    cardInfo: {
      fullName: string;
      creditCardNumber: string;
      cvv: number;
      expirationDate: string;
    };
  };
  PaymentReviewScreen: {
    type: TransferType;
    amount: number;
    toBet?: boolean;
    registrationData?: RegistrationData;
    promo: string;
  };
  PaymentConfirmationScreen: {
    type: TransferType;
    amount: number;
    toBet?: boolean;
  };
  HowToPlayScreen: undefined;
  HelpScreen: undefined;
  TransferLedgerScreen: undefined;
  LeaderBoardScreen: undefined;
  PrizesScreen: undefined;
  PaypalScreen: {
    type: TransferType;
    amount: number;
    clientId: string;
    orderId: string;
    toBet?: boolean;
  };
  // Misc
  DeveloperOptionsModal: undefined;
  ResponsibleGamblingModal: undefined;
};

export type Screen = keyof ScreenParamList;

export type ScreenComponent<T> = (
  props: NativeStackScreenProps<ScreenParamList, T>
) => JSX.Element | null;

export type WalletType = "deposit" | "withdraw";
export type OtpScreen = "forgetPassword" | "createAccount";
