import axios, { AxiosResponse } from "axios";
import { getToken } from "./authApi";

export const getTickets = async (): Promise<AxiosResponse> => {
  return axios.post(
    "http://10.101.104.140:8090/dashboard",
    {},
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};
