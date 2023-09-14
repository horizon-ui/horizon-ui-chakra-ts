import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";
import RTLLayout from "./layouts/rtl";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import { AppState, Auth0Provider, User, useAuth0 } from "@auth0/auth0-react";
import { persistor, store, useDispatch, useSelector } from "./store";
import { Provider } from "react-redux";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import axios, { AxiosResponse } from "axios";
import { verifyAdminThunk } from "store/actions/userActions";
import { domain, makeRequest } from "services";
import { verifyAdmin } from "services/userService";
import { Hash } from "crypto";
const clientId = "YVQ4TuZIMLBonuP9GECj36G79vzWvGd3";
let link = window.location.href;
let arr = "localhost:3001";
const clientSecret =
  "lNbdf07PBNUDSnxtOhIIrc7lVkn9F8H5WEE5HjfaGhl4n0-dZjk7LoCw-e8zD-77";
const redirectUri = `${extractHostFromUrl(
  window.location.href
)}/horizon-ui-chakra-ts#/middleware`;
const auth0Domain = "dev-udyutj0x.us.auth0.com";
const PrivateRoute = () => <div>Private</div>;
let server_domain = "https://bettorlook.com/api/v0";
function base64URLEncode(str: any) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
export interface TokenType {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export default withAuthenticationRequired(PrivateRoute, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});
export const AuthProvider = () => {
  useEffect(() => {
    const loadData = async () => {
      let auth0_tokens = JSON.parse(
        localStorage.getItem(
          "@@auth0spajs@@::YVQ4TuZIMLBonuP9GECj36G79vzWvGd3::https://dev-udyutj0x.us.auth0.com/api/v2/::openid profile email offline_access read:profile"
        )
      );
      let id_token = JSON.parse(
        localStorage.getItem(
          "@@auth0spajs@@::YVQ4TuZIMLBonuP9GECj36G79vzWvGd3::@@user@@"
        )
      );
      console.log("mamba access token", id_token.id_token);
      console.log("mamba refresh token", auth0_tokens.body.refresh_token);

      const dat = await axios.post(
        domain + "/auth0_login",
        {
          access_token: id_token.id_token,
          refresh_token: auth0_tokens.body.refresh_token,
        },
        {
          withCredentials: true,
        }
      );

      const cookieHeader = dat.headers["set-cookie"];
      if (cookieHeader) {
        cookieHeader.forEach((cookieStr) => {
          document.cookie = cookieStr;
        });
      }
      let isAdmin = await verifyAdmin();
      let datas: any = { isAdmin };
      console.log("datas", datas);
      if (isAdmin) {
        localStorage.setItem("admin_data", JSON.stringify(datas));
        window.location.href = "/admin";
      } else {
        alert("Authentication Failed");
        window.location.href = "/auth";
      }
      console.log("data_received", dat);
    };

    if (
      localStorage.getItem(
        "@@auth0spajs@@::YVQ4TuZIMLBonuP9GECj36G79vzWvGd3::https://dev-udyutj0x.us.auth0.com/api/v2/::openid profile email offline_access read:profile"
      )
    )
      loadData();
  }, []);

  return <></>;
};

export const MiddleWare = () => {
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  return <div>authenticating...</div>;
};

ReactDOM.render(
  <Auth0Provider
    domain={"dev-udyutj0x.us.auth0.com"}
    clientId={"YVQ4TuZIMLBonuP9GECj36G79vzWvGd3"}
    useRefreshTokens={true}
    authorizationParams={{
      // redirect_uri: "http://localhost:3001/horizon-ui-chakra-ts#/middleware",
      prompt: "login",
      screen_hint: "login",
      passwordlessMethod: "code",
      connection: "email",
      scope: "openid profile email offline_access read:profile",
      audience: "https://dev-udyutj0x.us.auth0.com/api/v2/",
    }}
    onRedirectCallback={(appState: AppState, user: User) => {
      console.log("user", user);
      console.log("appstate", appState);
    }}
    cacheLocation={"localstorage"}
  >
    <ChakraProvider theme={theme}>
      <AuthProvider />

      <Provider store={store}>
        <React.StrictMode>
          <HashRouter>
            <Switch>
              <Route path={`/auth`} component={AuthLayout} />
              <Route path={`/admin`} component={AdminLayout} />
              <Route path={`/middleware`} component={MiddleWare} />
              <Route path={`/rtl`} component={RTLLayout} />
              <Redirect from="/" to={"/admin"} />
            </Switch>
          </HashRouter>
        </React.StrictMode>
      </Provider>
    </ChakraProvider>
  </Auth0Provider>,

  document.getElementById("root")
);

export function extractHostFromUrl(urlString: string) {
  try {
    const url = new URL(urlString);
    const host = `${url.protocol}//${url.host}`;
    return host;
  } catch (error) {
    console.error("Invalid URL:", error);
    return urlString; // Return the original URL if it's invalid
  }
}
