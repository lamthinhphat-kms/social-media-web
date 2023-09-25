import { AxiosStatic } from "axios";

export function setupAxios(axios: AxiosStatic) {
  axios.defaults.headers.Accept = "application/json";
  axios.defaults.baseURL = "http://localhost:8080";
}
