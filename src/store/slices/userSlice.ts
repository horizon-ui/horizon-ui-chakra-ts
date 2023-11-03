import storage from "redux-persist/lib/storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import createMigrate from "redux-persist/es/createMigrate";
import persistReducer from "redux-persist/es/persistReducer";
import {
  MigrationManifest,
  PersistedState,
  PersistState,
} from "redux-persist/es/types";
import {
  Notifications,
  NotificationType,
  PlayingFor,
  Sport,
  Theme,
} from "../../types/bet";
import { AccountBalance, Region, User, UserAuth } from "../../types/user";

import {
  checkNewUsernameThunk,
  checkNewEmailThunk,
  getTimeUntilNextCheckinThunk,
  getUserThunk,
  loginThunk,
  logoutThunk,
  tokenCheckinThunk,
  refreshTokenThunk,
  passwordLessLoginThunk,
  getUserInformationThunk,
  changePasswordThunk,
  updateUserThunk,
  sendPasswordResetThunk,
  loadUserThunk,
  sendNotificationThunk,
} from "../actions/userActions";

export interface UserState {
  user: User | undefined;
  auth: UserAuth | undefined;
  timeUntilNextCheckin: string | undefined;
  loading: boolean;
  error: string | undefined;
  pushNotificationLoading: boolean;
  lastFetch: number;
  successMessage: any;
  getUserError: string | undefined;
  refreshTokenError: string | undefined;
  userDeviceProperties: UserDeviceProperties;
  region: Region;
  userInformation?: UserInformation | any;
  secondaryLoading?: boolean;
  notifications?: Notifications;
  userRegistrationData: UserRegistrationProperty;
}

interface UserDeviceProperties {
  showLeaderboardModal: boolean;
  playingFor: PlayingFor;
  sport: Sport | undefined;
  theme: Theme;
  tutorialSeen?: boolean;
}
export interface UserRegistrationProperty {
  isRegistered: boolean;
  idToken?: string;
  refreshToken?: string;
  phoneNumber?: string;
  email?: string;
  isCompletedRegistration?: boolean;
}

export interface UserInformation {
  email: string;
  phone_number: string;
  username: string;
  nickname: string;
  birth_date: string;
  personal_referral_code?: string;
  email_verified?: boolean;
  family_name?: string;
  given_name?: string;
  name?: string;
  "primary.user.id"?: string;
  region?: string;
  updated_at?: string;
  user_host?: string;
}
export interface authOUserInformation {
  email: string;
  phone_number: string;
  "primary.user.id": string;
  nickname: string;
  name: string;
  family_name: string;
  given_name: string;
  updated_at: string;
  email_verified: string;
  user_host: string;
  region: string;
}
export interface UserUpdateInformation {
  email: string;
  phone_number: string;
  username: string;
  nickname: string;
  birth_date: string;
  personal_referral_code: string;
}

const initialState: UserState = {
  user: undefined,
  auth: undefined,
  timeUntilNextCheckin: undefined,
  loading: true,
  error: undefined,
  lastFetch: 0,
  secondaryLoading: false,
  getUserError: undefined,
  refreshTokenError: undefined,
  successMessage: undefined,
  region: "US",
  userDeviceProperties: {
    showLeaderboardModal: true,
    playingFor: "tokens",
    sport: "cricket",
    theme: "dark",
    tutorialSeen: false,
  },
  pushNotificationLoading: false,
  userRegistrationData: {
    isRegistered: false,
    isCompletedRegistration: false,
  },
  notifications: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clear: (state) => {
      state.user = undefined;
    },

    clearError: (state) => {
      state.error = undefined;
    },
    clearGetUserError: (state) => {
      state.getUserError = undefined;
    },
    handleRefreshTokenError: (state) => {
      state.user = undefined;
      state.auth = undefined;
      state.refreshTokenError = undefined;
    },
    initialUserDeviceProperties: (state) => {
      state.userDeviceProperties = initialState.userDeviceProperties;
    },
    setUserDeviceProperty: (
      state,
      action: PayloadAction<{ key: keyof UserDeviceProperties; value: any }>
    ) => {
      // TODO: fix typescript hack
      state.userDeviceProperties[action.payload.key] = action.payload
        .value as never;
    },

    updateBalance: (state, action: PayloadAction<AccountBalance>) => {
      if (!state.user?.accountBalance) return;
      state.user.accountBalance = action.payload;
    },

    setAuth: (state, action: PayloadAction<UserAuth>) => {
      state.auth = action.payload;
    },
    setNotificationProperty: (
      state,
      action: PayloadAction<{
        id: string | null;
        body: NotificationType;
        type: boolean;
      }>
    ) => {
      if (action.payload.type) {
        state.notifications[action.payload.id] = action.payload.body;
      } else {
        delete state.notifications[action.payload.id];
      }
    },
    setRegion: (state, action: PayloadAction<Region>) => {
      state.region = action.payload;
    },
    setRegistrationComplete: (state, action: PayloadAction<boolean>) => {
      state.userRegistrationData.isCompletedRegistration = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.pending, (state) => {
      state.secondaryLoading = true;
      state.error = undefined;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.user = {
        email: action.payload.email,
        accountBalance: { USD: 0, MBTK: 0, CRDT: 0 },
        parlays: [],
      };
      state.auth = {
        authToken: action.payload.authToken,
        refreshToken: action.payload.refreshToken,
      };
      state.lastFetch = Date.now();
      state.secondaryLoading = false;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.error = action.error.message;
      state.secondaryLoading = false;
    });
    builder.addCase(passwordLessLoginThunk.pending, (state) => {
      state.secondaryLoading = true;
      state.error = undefined;
    });
    builder.addCase(passwordLessLoginThunk.fulfilled, (state, action) => {
      // console.log("thisIsPaylead", action.payload.refreshToken);
      if (action.payload.isVerified?.is_registered) {
        state.user = {
          accountBalance: { USD: 0, MBTK: 0, CRDT: 0 },
          parlays: [],
          email: "",
        };
        // console.log("payload", action.payload);
        state.auth = {
          authToken: action.payload.authToken,
          refreshToken: action.payload.refreshToken,
        };
        state.lastFetch = Date.now();
        state.secondaryLoading = false;
      } else {
        state.userRegistrationData = {
          isRegistered: action.payload.isVerified.is_registered,
          idToken: action.payload.authToken,
          refreshToken: action.payload.refreshToken,
        };
      }
    });
    builder.addCase(passwordLessLoginThunk.rejected, (state, action) => {
      state.error = action.error.message;
      state.secondaryLoading = false;
    });
    // builder.addCase(registerThunk.pending, (state) => {
    //   state.loading = true;
    //   state.error = undefined;
    // });
    builder.addCase(sendPasswordResetThunk.rejected, (state, action) => {
      state.error = action.error.message;
      state.secondaryLoading = false;
    });
    builder.addCase(sendPasswordResetThunk.pending, (state) => {
      state.secondaryLoading = true;
      state.error = undefined;
    });
    builder.addCase(sendPasswordResetThunk.fulfilled, (state) => {
      state.secondaryLoading = false;
      state.error = undefined;
    });

    builder.addCase(sendNotificationThunk.rejected, (state, action) => {
      state.pushNotificationLoading = false;
    });
    builder.addCase(sendNotificationThunk.pending, (state) => {
      state.pushNotificationLoading = true;
    });
    builder.addCase(sendNotificationThunk.fulfilled, (state, action) => {
      state.pushNotificationLoading = false;
      console.log("action", action.payload);
    });

    builder.addCase(getUserThunk.pending, (state) => {
      state.loading = true;
      state.getUserError = undefined;
    });
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      // console.log("getuserthunk", action.payload);
      if (state.user && action.payload) {
        state.user.accountBalance = action.payload.accountBalance;
      }
      if (!action.payload) return;
      state.lastFetch = Date.now();
      state.user = {
        ...state.user,
        ...action.payload,
        email: action.payload.email || state.user?.email || "",
      };
    });

    builder.addCase(getUserThunk.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(refreshTokenThunk.fulfilled, (state) => {
      state.getUserError = undefined;
      state.refreshTokenError = undefined;
    });
    builder.addCase(refreshTokenThunk.rejected, (state, action) => {
      state.refreshTokenError = action.error.message;
    });
    builder.addCase(logoutThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.loading = false;
      state.user = undefined;
      state.auth = undefined;
      state.userInformation = undefined;
      state.userRegistrationData = undefined;
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {
      state.loading = false;
      state.user = undefined;
      state.auth = undefined;
    });
    builder.addCase(getTimeUntilNextCheckinThunk.fulfilled, (state, action) => {
      state.timeUntilNextCheckin = action.payload;
    });
    builder.addCase(tokenCheckinThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(tokenCheckinThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      if (state.user && state.user.accountBalance)
        state.user.accountBalance.MBTK = action.payload.credits;
      state.timeUntilNextCheckin = action.payload.timeUntilNextCheckin;
      state.lastFetch = Date.now();
    });
    builder.addCase(tokenCheckinThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(checkNewEmailThunk.pending, (state) => {
      state.secondaryLoading = true;
      state.error = undefined;
    });
    builder.addCase(checkNewEmailThunk.fulfilled, (state) => {
      state.secondaryLoading = false;
    });
    builder.addCase(checkNewEmailThunk.rejected, (state, action) => {
      state.secondaryLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(checkNewUsernameThunk.pending, (state) => {
      state.secondaryLoading = true;
      state.error = undefined;
    });
    builder.addCase(checkNewUsernameThunk.fulfilled, (state) => {
      state.secondaryLoading = false;
    });
    builder.addCase(checkNewUsernameThunk.rejected, (state, action) => {
      state.secondaryLoading = false;
      state.error = action.error.message;
    });
    // builder.addCase(appleSignInThunk.pending, (state) => {
    //   state.loading = true;
    //   state.error = undefined;
    // });
    // builder.addCase(appleSignInThunk.fulfilled, (state, action) => {
    //   state.user = {
    //     email: action.payload.email,
    //     accountBalance: { USD: 0, MBTK: 0, CRDT: 0 },
    //     parlays: [],
    //   };
    //   state.auth = {
    //     authToken: action.payload.authToken,
    //     refreshToken: action.payload.refreshToken,
    //   };
    //   state.lastFetch = Date.now();
    //   state.loading = false;
    // });
    // builder.addCase(appleSignInThunk.rejected, (state, action) => {
    //   state.error = action.error.message;
    //   state.loading = false;
    // });

    builder.addCase(getUserInformationThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getUserInformationThunk.pending, (state) => {
      state.error = undefined;
    });
    builder.addCase(getUserInformationThunk.fulfilled, (state, action) => {
      // console.log("i_was_called", action.payload);
      state.userInformation = {
        ...state.userInformation,
        ...(action.payload as UserInformation),
      };
    });

    builder.addCase(changePasswordThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(changePasswordThunk.pending, (state) => {
      state.error = undefined;
    });
    builder.addCase(changePasswordThunk.fulfilled, (state, action) => {
      // state.userInformation = action.payload;
    });

    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateUserThunk.pending, (state) => {
      state.error = undefined;
    });
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      state.successMessage = action.payload;
    });
    builder.addCase(loadUserThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(loadUserThunk.fulfilled, (state, action) => {
      // console.log("action", action.payload);
      state.userInformation = {
        ...state.userInformation,
        ...action.payload,
      };
      // console.log("after_setted", state.userInformation);
      state.region = "India";
      state.userDeviceProperties.playingFor = "tokens";
      state.loading = false;
    });
    builder.addCase(loadUserThunk.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
  },
});

export const {
  setUserDeviceProperty,
  handleRefreshTokenError,
  updateBalance,
  setNotificationProperty,
  setRegion,
  setRegistrationComplete,
  setAuth,
} = userSlice.actions;

const migrations: MigrationManifest = {
  0: (state) => {
    if ((state as PersistedState & UserState).region) return state;
    (state as PersistedState & UserState).region = "US";
    return state;
  },
};

export const userReducer = persistReducer(
  {
    key: "user",
    storage: storage,
    whitelist: ["user", "auth", "userDeviceProperties", "notifications"],
    migrate: createMigrate(migrations),
  },
  userSlice.reducer
);
