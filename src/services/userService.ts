import axios, { AxiosResponse } from "axios";
import cookie from "cookie";
import { chain, toLower } from "lodash";
import { domain, makeRequest } from "./index";
import {
  authOUserInformation,
  UserInformation,
  UserUpdateInformation,
} from "../store/slices/userSlice";
import { ApiUserAssets, ApiParlay } from "../types/api";
import { Parlay, OverUnder, Sport } from "../types/bet";
import { User, UserAuth } from "../types/user";
import { ServerResponse } from "views/admin/marketplace";

axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      config.headers.Cookie = `mamba_access_token=${accessToken}; mamba_refresh_token=${refreshToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Replace with your token retrieval logic
    if (token) {
      config.headers["Cookie"] = `mamba_access_token=${localStorage.getItem(
        "accessToken"
      )}; mamba_refresh_token=${localStorage.getItem("refreshToken")}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (
  email: string,
  password: string
): Promise<UserAuth & { email: string }> => {
  try {
    const data = new FormData();
    data.append("username", email);
    data.append("password", password);
    const loginResponse = await makeRequest("post", "login", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const { authToken, refreshToken } = responseToAuthToken(loginResponse);
    return {
      email,
      authToken,
      refreshToken,
    };
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403)
      throw new Error(
        "Incorrect email and/or password. Please try again or reset password."
      );
    throw error;
  }
};

export const changePassword = async (password: string): Promise<any> => {
  try {
    const data = new FormData();

    data.append("password", password);
    const changePasswordResponse = await makeRequest(
      "post",
      "change_password",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return changePasswordResponse;
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403)
      throw new Error(
        "Incorrect password. Please try again or reset password."
      );
    throw error;
  }
};

export const passwordLessLogin = async (
  access_token?: string,
  refresh_token?: string,
  code?: string,
  authorizationType?: string
): Promise<UserAuth> => {
  try {
    const data: any = {};
    // access_token ? (data["id_token"] = access_token) : null;
    // refresh_token ? (data["refresh_token"] = refresh_token) : null;
    // code ? (data["authorization_code"] = code) : null;
    // authorizationType ? (data["credential_type"] = authorizationType) : null;
    // console.log("data", data);
    const loginResponse = await makeRequest(
      "post",
      "auth/verify_credentials",
      data
    );
    // console.log("login_response", loginResponse.data);
    if (!loginResponse.data.is_registered) {
      return {
        authToken: loginResponse.data.registration_id_token,
        refreshToken: loginResponse.data.registration_refresh_token,
        isVerified: loginResponse.data,
      };
    } else {
      const { authToken, refreshToken } = responseToAuthToken(loginResponse);

      return {
        authToken: authToken,
        refreshToken: refreshToken,
        isVerified: loginResponse.data,
      };
    }
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403)
      throw new Error(
        "Incorrect email and/or password. Please try again or reset password."
      );
    throw error;
  }
};
export const UpdateAppVersion = async ({
  platform,
  version,
}: {
  platform: string;
  version: string;
}): Promise<boolean> => {
  try {
    const data: any = {
      platform: platform,
      version: version,
    };

    const updateAppResponse = await makeRequest(
      "patch",
      "admin/update_app_version",
      data
    );
    if (updateAppResponse.status === 200) return true;
    else return false;
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403)
      throw new Error(
        "Incorrect email and/or password. Please try again or reset password."
      );
    throw error;
  }
};

export const register = async ({
  email,
  username,
  password,
  phoneNumber,
  birthDate,
}: {
  email: string;
  username?: string;
  password: string;
  phoneNumber?: string;
  birthDate?: string;
}): Promise<void> => {
  try {
    let dateParts = birthDate?.split("/");
    let year = dateParts[2];
    let month = dateParts[1];
    let day = dateParts[0];
    const data: any = {
      email,
      plain_password: password,
      birth_date: year + "-" + month + "-" + day,
    };
    if (username) data.username = username;
    if (phoneNumber) data.phone_number = phoneNumber;
    await makeRequest("post", "register", data);
    return;
  } catch (error: any) {
    if (error.response?.status === 500)
      throw new Error("Oops! Something went wrong. Please try again.");
    if (error.response?.status === 400) {
      if (error.response?.data?.detail.indexOf("email already exists") > -1)
        throw new Error(
          "Email already registered. Please enter or reset your password."
        );
      else throw new Error("Oops! Something went wrong. Please try again.");
    }
    throw error;
  }
};
export const registerIdToken = async ({
  email,
  username,
  phoneNumber,
  birthDate,
  idToken,
  givenName,
  familyName,
}: {
  email?: string;
  username?: string;
  phoneNumber?: string;
  birthDate?: string;
  idToken?: string;
  givenName?: string;
  familyName?: string;
}): Promise<void> => {
  // console.log(
  //   "i was also here3",
  //   email,
  //   username,
  //   phoneNumber,
  //   birthDate,
  //   idToken,
  //   givenName,
  //   familyName
  // );

  try {
    const data: any = {};
    if (birthDate) {
      let dateParts = birthDate?.split("/") as any;
      let year = dateParts[2];
      let month = dateParts[1];
      let day = dateParts[0];
      data.birth_date = year + "-" + day + "-" + month;
    }
    if (email) data.email = email;
    if (idToken) data.id_token = idToken;
    if (username) data.username = username;
    if (phoneNumber) data.phone_number = phoneNumber;
    if (givenName) data.given_name = givenName;
    if (familyName) data.family_name = familyName;
    // console.log("i was also here", data);
    let resp = await makeRequest("post", "auth/id_token_register", data);
    return resp.data;
  } catch (error: any) {
    if (error.response?.status === 500)
      throw new Error("Oops! Something went wrong. Please try again.");
    if (error.response?.status === 400) {
      if (error.response?.data?.detail.indexOf("email already exists") > -1)
        throw new Error(
          "Email already registered. Please enter or reset your password."
        );
      else throw new Error("Oops! Something went wrong. Please try again.");
    }
    throw error;
  }
};

export const getUser = async (): Promise<User> => {
  const userResponse = await makeRequest<void, ApiUserAssets>(
    "get",
    "user_assets"
  );
  // console.log("user_assets_response", userResponse);
  return {
    email: userResponse.data.email,
    parlays: userResponse.data.parlays_list
      .map(mapParlay)
      .sort(
        (p1, p2) => new Date(p2.date).getTime() - new Date(p1.date).getTime()
      ),
    accountBalance: userResponse.data.account_balance,
  };
};
export const getInformation = async (): Promise<UserInformation> => {
  const userResponse = await makeRequest<void, UserInformation>(
    "get",
    "user_info"
  );
  return {
    email: userResponse.data.email,
    phone_number: userResponse.data.phone_number,
    birth_date: userResponse.data.birth_date,
    personal_referral_code: userResponse.data.personal_referral_code,
    username: userResponse.data.username,
    nickname: userResponse.data.nickname,
  };
};

export const updateUser = async ({
  email,
  phoneNumber,
  username,
  nickname,
  birthDate,
  personalReferralCode,
  givenName,
  familyName,
}: {
  email?: string;
  username?: string;
  nickname: string;
  phoneNumber?: string;
  personalReferralCode?: string;
  birthDate?: string;
  givenName?: string;
  familyName?: String;
}): Promise<void> => {
  // console.log("birthday", birthDate);

  const data: any = {
    email,
    phone_number: phoneNumber,
    username,
    nickname,
    birth_date: birthDate,
    personal_referral_code: personalReferralCode,
    familyName: familyName,
    givenName: givenName,
  };
  const response = await makeRequest("patch", "user_info", data);
  return response.data.message;
};

export const checkDeplicatedUsername = async (
  username: string
): Promise<void> => {
  await makeRequest("get", `check_duplicated_username/${username}`);
};

export const refreshToken = async (): Promise<void> => {
  await makeRequest("post", "refresh_token");
};

export const logout = async () => {
  await makeRequest("post", "logout");
};

export const sendPasswordReset = async (email: string) => {
  await makeRequest("post", "reset_password", { email });
};

export const getTimeUntilNextCheckin = async (): Promise<string> => {
  const response = await makeRequest("get", "user_last_checkin_time");
  return response.data.time_until_next_checkin;
};

export const tokenCheckin = async (): Promise<{
  credits: number;
  timeUntilNextCheckin: string;
}> => {
  const response = await makeRequest("post", "daily_token_checkin");
  return {
    credits: response.data.remaining_balance,
    timeUntilNextCheckin: response.data.time_until_next_checkin,
  };
};

export const deleteUser = async (): Promise<void> => {
  await makeRequest("delete", "delete_user");
};

export const checkNewEmail = async (email: string): Promise<boolean> => {
  const response = await makeRequest(
    "get",
    `check_duplicated_email/${encodeURIComponent(email.toLowerCase())}`
  );
  return response.data.ok;
};

export const checkNewUsername = async (username: string): Promise<boolean> => {
  const response = await makeRequest(
    "get",
    `check_duplicated_username/${username}`
  );
  return response.data.ok;
};
export const myInformation = async (): Promise<authOUserInformation> => {
  const infoResponse = await makeRequest("get", "me", {});
  return infoResponse.data;
};

export const appleSignIn = async (token: string): Promise<UserAuth> => {
  const loginResponse = await makeRequest("post", "social_login", {
    connection: "apple",
    social_login_token: token,
  });
  const { authToken, refreshToken } = responseToAuthToken(loginResponse);
  return {
    authToken,
    refreshToken,
  };
};

export const googleSignIn = async (
  token: string
): Promise<UserAuth & { email: string }> => {
  const userResponse = await makeRequest(
    "get",
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
  );
  const { email } = userResponse.data.email;
  const loginResponse = await makeRequest("post", "social_login", {
    connection: "google-oauth2",
    social_login_token: token,
  });
  const { authToken, refreshToken } = responseToAuthToken(loginResponse);
  return {
    authToken,
    refreshToken,
    email,
  };
};

export const sendPushNotifications = async (
  title: string,
  message: string
): Promise<ServerResponse> => {
  const userResponse = await makeRequest(
    "post",
    "admin/push_notifications",
    {
      title: title,
      message: message,
    },
    {
      withCredentials: true,
    }
  );
  console.log("userResponse", userResponse.data);
  return userResponse.data;
};
export const sendVersion = async (
  platform: string,
  version: string
): Promise<ServerResponse> => {
  const userResponse = await makeRequest(
    "patch",
    "admin/update_app_version",
    {
      platform: platform,
      version: version,
    },
    {
      withCredentials: true,
    }
  );
  console.log("userResponse", userResponse.data);
  return userResponse.data;
};

export const getAccessTokenAndIdToken = async (code: string): Promise<any> => {
  const userResponse = await makeRequest(
    "post",
    `https://dev-udyutj0x.us.auth0.com/oauth/token`,
    {
      code: code,
      redirect_uri: "http://localhost:3001/horizon-ui-chakra-ts#/admin",
      grant_type: "authorization_code",
      client_id: "YVQ4TuZIMLBonuP9GECj36G79vzWvGd3",
    }
  );

  return userResponse.data;
};

const responseToAuthToken = (
  response: AxiosResponse
): { authToken: string; refreshToken: string } => {
  const setCookie = cookie.parse(
    response.headers["set-cookie"] ? response.headers["set-cookie"][0] : ""
  );
  return {
    authToken: setCookie.mamba_access_token,
    refreshToken: setCookie.SameSite.split("mamba_refresh_token=")[1],
  };
};

const mapParlay = (parlay: ApiParlay): Parlay => {
  return {
    id: parlay.parlay_mid,
    active:
      parlay.is_settled !== undefined
        ? !parlay.is_settled
        : parlay.parlay_user_win === undefined,
    date: parlay.submit_time,
    currency: parlay.currency,
    totalBet: parlay.bet_amount,
    totalWinnings: calculateTotalWinnings(parlay),
    win: parlay.parlay_user_win || undefined,
    picks: chain(parlay.parlay_options)
      .keyBy((option) => option.parlay_option_mid)
      .mapValues((option) => ({
        game: `${option.home_team_name} vs ${option.away_team_name}`,
        name: `${option.cricket_player_first_name} ${option.cricket_player_last_name}`,
        displayFirstName: option.display_first_name,
        displayLastName: option.display_last_name,
        nickname: option.nickname,
        type: option.parlay_type_name,
        overUnder: option.is_over ? "over" : ("under" as OverUnder),
        predictedValue: option.predicted_value,
        actualValue: option.actual_value,
        date: option.match_start_datetime,
        win:
          option.parlay_pick_user_win === null
            ? undefined
            : option.parlay_pick_user_win,
        imageUrl: { uri: option.cricket_player_image_url },
        isValid: option.is_valid,
        playerTeam: option.player_team,
        homeTeam: option.home_team_name,
        awayTeam: option.away_team_name,
        sport: toLower(option.sport_name) as Sport,
        home_team_abbreviation: option.home_team_abbreviation,
        away_team_abbreviation: option.away_team_abbreviation,
        league_name: option.league_name,
        cricket_rule_type: option.cricket_rule_type,
      }))
      .value(),
  };
};

const calculateTotalWinnings = (parlay: ApiParlay): number => {
  const validPickCount = parlay.parlay_options.filter((p) => p.is_valid).length;
  if (validPickCount < 2) return 0;
  //   return lineMultiplierTable[validPickCount] * parlay.bet_amount;
};
type VerifyResponse = {
  ok: boolean;
  message: string;
};
export const verifyAdmin = async (): Promise<boolean> => {
  const verifyResponse = await axios.get(
    "https://bettorlook.com/api/v0/auth/verify_admin_user",
    {
      withCredentials: true,
    }
  );
  if (verifyResponse.status === 200) {
    let receivedData: VerifyResponse = verifyResponse.data;
    return receivedData.ok;
  } else {
    return false;
  }
};
