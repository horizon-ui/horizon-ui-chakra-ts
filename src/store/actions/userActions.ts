import { createAsyncThunk } from "@reduxjs/toolkit";
import { useAuth0 } from "@auth0/auth0-react";

import { RootState } from "..";
import {
  checkNewUsername,
  checkNewEmail,
  deleteUser,
  getTimeUntilNextCheckin,
  getUser,
  login,
  logout,
  register,
  sendPasswordReset,
  tokenCheckin,
  refreshToken,
  appleSignIn,
  googleSignIn,
  passwordLessLogin,
  getInformation,
  changePassword,
  updateUser,
  registerIdToken,
  myInformation,
  verifyAdmin,
  sendPushNotifications,
} from "../../services/userService";
import { User } from "../../types/user";
import Auth0 from "@auth0/auth0-react";
import { UserInformation } from "../slices/userSlice";

const credentials = {
  clientId: "YVQ4TuZIMLBonuP9GECj36G79vzWvGd3",
  domain: "dev-udyutj0x.us.auth0.com",
  clientSecret:
    "lNbdf07PBNUDSnxtOhIIrc7lVkn9F8H5WEE5HjfaGhl4n0-dZjk7LoCw-e8zD-77",
};

// const auth0 = new Auth0(credentials);
export const loginThunk = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: string }) => {
    const sanitizedEmail = email.trim();
    const sanitizedPassword = password.trim();
    if (sanitizedEmail.length === 0 || sanitizedPassword.length === 0)
      throw new Error("Please fill out both your email and password");
    return login(sanitizedEmail, sanitizedPassword);
  }
);

export const passwordLessLoginThunk = createAsyncThunk(
  "user/passwordlessLogin",
  async ({
    access_token,
    refresh_token,
    code,
    authorizationType,
  }: {
    access_token?: string;
    refresh_token?: string;
    code?: string;
    authorizationType?: string;
  }) => {
    return passwordLessLogin(
      access_token,
      refresh_token,
      code,
      authorizationType
    );
  }
);
// export const googleSignin = async (idToken: string) => {
//   return await auth0.auth
//     .exchangeNativeSocial({
//       subjectTokenType: "google-oauth2",
//       subjectToken: idToken,
//       scope: "openid profile",
//     })
//     .catch((error) => console.log(error));
// };

// export const PasswordlessPhone = async (phone: string) => {
//   return auth0.auth.passwordlessWithSMS({
//     phoneNumber: phone,
//   });
// };
// export const AskRefreshToken = async (refreshToken: string) => {
//   let data = await auth0.auth.refreshToken({
//     refresh_token: refreshToken,
//   });
//   // console.log("data_refresh", data);
//   return data;
// };
// export const PasswordlessEmail = async (email: string) => {
//   return auth0.auth.passwordlessWithEmail({
//     email: email,
//     send: "code",
//     connection: "email",
//     authParams: {
//       scope: "openid profile email address phone offline_access",
//     },
//   });
// };
// export const loginWithVerificationCode = async (
//   code: string,
//   phoneNumber?: string,
//   email?: string
// ) => {
//   console.log("email", email);
//   console.log("code", code);
//   console.log("phoneNumber", phoneNumber);
//   if (email !== undefined) {
//     return auth0.auth.loginWithEmail({
//       email: email,
//       code: code,
//       scope: "openid phone profile email address offline_access", // whatever scopes you need
//     });
//   } else {
//     return auth0.auth.loginWithSMS({
//       phoneNumber: phoneNumber,
//       code: code,
//       scope: "openid phone profile email address offline_access", // whatever scopes you need
//     });
//   }
// };

export const getUserInformationThunk = createAsyncThunk<
  UserInformation | undefined,
  void,
  { state: RootState }
>("user/getUserInformation", async (_, thunkAPI) => {
  return getInformation();
});

// export const askRefreshTokenThunk = createAsyncThunk(
//   "user/Auth0refreshToken",
//   async ({ refreshToken }: { refreshToken: string }) => {
//     return await AskRefreshToken(refreshToken);
//   }
// );

// export const registerIdTokenThunk = createAsyncThunk(
//   "user/registerIdToken",
//   async ({
//     email,
//     username,
//     payment,
//     phoneNumber,
//     idToken,
//     givenName,
//     familyName,
//     birthDate,
//   }: {
//     email?: string;
//     username?: string;
//     payment?: RegistrationData;
//     phoneNumber?: string;
//     idToken?: string;
//     givenName?: string;
//     familyName?: string;
//     birthDate?: string;
//   }) => {
//     const sanitizedEmail = email?.trim();
//     const sanitizedUsername = username?.trim();
//     console.log("i was here2", {
//       email,
//       username,
//       payment,
//       phoneNumber,
//       idToken,
//       givenName,
//       familyName,
//     });
//     if (!payment)
//       return await registerIdToken({
//         email: sanitizedEmail,
//         username: sanitizedUsername,
//         phoneNumber: phoneNumber ? phoneNumber : undefined,
//         birthDate: birthDate,
//         idToken: idToken,
//         givenName: givenName,
//         familyName: familyName,
//       });
//     //  const loginInfo = login(sanitizedEmail, sanitizedPassword);
//     // if (payment) addPaymentProfile(payment);
//     // return loginInfo;
//   }
// );

export const updateUserThunk = createAsyncThunk(
  "user/updateUserInfo",
  async ({
    email,
    phoneNumber,
    username,
    nickname,
    birthDate,
    personalReferralCode,
    given_name,
    family_name,
  }: {
    email?: string;
    username?: string;
    nickname?: string;
    phoneNumber?: string;
    personalReferralCode?: string;
    birthDate?: string;
    given_name?: string;
    family_name?: string;
  }) => {
    const sanitizedEmail = email?.trim();
    const sanitizedUsername = username?.trim();
    const sanitizedNickname = nickname?.trim();
    const sanitizedBirthDate = birthDate?.trim();
    const givenName = given_name?.trim();
    const familyName = family_name?.trim();
    const sanitizedPersonalReferralCode = personalReferralCode?.trim();
    const sanitizedPhoneNumber = personalReferralCode?.trim();
    if (
      sanitizedEmail?.length === 0 ||
      sanitizedNickname?.length === 0 ||
      sanitizedPersonalReferralCode?.length === 0 ||
      sanitizedPhoneNumber?.length == 0
    )
      throw new Error("Please fill out all fields");

    let userUpdateInfo = await updateUser({
      email: sanitizedEmail,
      username: sanitizedUsername,
      nickname: sanitizedNickname,
      familyName: familyName,
      givenName: givenName,
      birthDate: sanitizedBirthDate,
      phoneNumber: phoneNumber,
      personalReferralCode: sanitizedPersonalReferralCode,
    });
    return userUpdateInfo;
  }
);

export const getUserThunk = createAsyncThunk<
  User | undefined,
  boolean | undefined,
  { state: RootState }
>("user/get", async (force, thunkAPI) => {
  // const lastFetch = thunkAPI.getState().user.lastFetch;
  // if (!force && Date.now() - lastFetch < 5000) return;
  let data = await getUser();
  // console.log("getuserthunk_called", data, "me");

  return data;
});

export const refreshTokenThunk = createAsyncThunk(
  "user/refreshToken",
  async () => {
    await refreshToken();
  }
);

export const logoutThunk = createAsyncThunk("user/logout", async () => {
  return logout();
});

export const loadUserThunk = createAsyncThunk("user/information", async () => {
  return myInformation();
});

export const sendPasswordResetThunk = createAsyncThunk(
  "user/sendPasswordReset",
  async (email: string) => {
    const sanitizedEmail = email.trim();
    if (!sanitizedEmail.length) throw new Error("Enter your email address.");
    return sendPasswordReset(sanitizedEmail);
  }
);

export const getTimeUntilNextCheckinThunk = createAsyncThunk(
  "user/getLastTokenCheckinTime",
  async () => getTimeUntilNextCheckin()
);

export const tokenCheckinThunk = createAsyncThunk(
  "user/tokenCheckin",
  async () => tokenCheckin()
);

// export const deleteUserThunk = createAsyncThunk<
//   void,
//   string,
//   { state: RootState }
// >("user/deleteUser", async (email: string, thunkAPI) => {
//   if (
//     email.toLowerCase().trim() !==
//     thunkAPI.getState().user.user?.email.toLowerCase()
//   )
//     throw new Error("Email does not match.");
//   await deleteUser();
// });

export const checkNewEmailThunk = createAsyncThunk(
  "user/checkNewEmail",
  async (email: string) => {
    const trimmedEmail = email.trim();
    if (
      trimmedEmail.split("@").length !== 2 ||
      trimmedEmail.indexOf(".") === -1
    )
      throw new Error("Please enter a valid email.");
    return checkNewEmail(trimmedEmail);
  }
);

export const checkNewUsernameThunk = createAsyncThunk(
  "user/checkDuplicatedUsername",
  async (username: string) => {
    const trimmedUsername = username.trim();
    const newUsername = await checkNewUsername(trimmedUsername);
    if (!newUsername) throw new Error("Username is taken.");
    return;
  }
);

export const appleSignInThunk = createAsyncThunk(
  "user/appleSignIn",
  () => {}
  // async (credentials: AppleAuthenticationCredential) => {
  //   if (!credentials.identityToken || !credentials.email)
  //     throw new Error("Identity token was not sent");
  //   const auth = await appleSignIn(credentials.identityToken);
  //   return { ...auth, email: credentials.email };
  // }
);
export const verifyAdminThunk = createAsyncThunk(
  "user/verifyAdminThunk",
  () => {
    verifyAdmin();
  }
);

export const sendNotificationThunk = createAsyncThunk(
  "user/sendPushTokenThunk",
  ({ title, message }: { title: string; message: string }) => {
    return sendPushNotifications(title, message);
  }
);

export const changePasswordThunk = createAsyncThunk(
  "user/changePassword",
  async ({
    password,
    confirmPassword,
  }: {
    password: string;
    confirmPassword: string;
  }) => {
    const sanitizedPassword = password.trim();
    const sanitizedConfirmPassword = confirmPassword.trim();

    if (sanitizedPassword !== sanitizedConfirmPassword)
      throw new Error("Passwords do not match");

    const changePasswordInfo = changePassword(sanitizedPassword);

    return changePasswordInfo;
  }
);

// export const googleSignInThunk = createAsyncThunk(
//   "user/googleSignIn",
//   async (credentials: AuthSessionResult) => {
//     if (credentials.type !== "success" || !credentials.authentication)
//       throw new Error("Invalid credentials used for google sign in");
//     return googleSignIn(credentials.authentication.accessToken);
//   }
// );
