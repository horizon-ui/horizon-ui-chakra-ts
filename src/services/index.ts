import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export let domain = "https://bettorlook.com/api/v0";

export const setDomain = () => {
  domain = "https://bettorlook.com/api/v0";
};

export const log = (...[loggString]: string[]): void => {
  return console.log("log", loggString);
};

// axios.defaults.headers.common = {
//   Cookie: `mamba_access_token=${localStorage.getItem(
//     "accessToken"
//   )}; mamba_refresh_token=${localStorage.getItem("refreshToken")}`,
// };
export const makeRequest = async <RequestData = any, ResponseData = any>(
  method: "get" | "post" | "delete" | "patch",
  route: string,
  data?: RequestData | AxiosRequestConfig,
  requestConfig?: AxiosRequestConfig
): Promise<AxiosResponse<ResponseData>> => {
  log(`${method} ${domain}/${route}`);
  const resolvedRequestConfig =
    method === "get" ? (data as AxiosRequestConfig) : requestConfig || {};
  try {
    let response: AxiosResponse<ResponseData>;
    const fullPath = route.indexOf("http") > -1 ? route : `${domain}/${route}`;
    if (method === "get")
      response = await axios.get<ResponseData>(fullPath, resolvedRequestConfig);
    else if (method === "post")
      response = await axios.post<ResponseData>(
        fullPath,
        data,
        resolvedRequestConfig
      );
    else if (method === "delete")
      response = await axios.delete<ResponseData>(fullPath, {
        ...resolvedRequestConfig,
        data: data,
      });
    else if (method === "patch")
      response = await axios.patch<ResponseData>(
        fullPath,
        data,
        resolvedRequestConfig
      );
    else throw new Error("method not implemented");
    return response;
  } catch (error: any) {
    if (error.response) {
      log(route + ",," + data);
      log(`Status: ${error.response.status}`);
    }
    // console.log("error", JSON.parse(JSON.stringify(error.response)));
    // captureError(error);
    throw error;
  }
};
