import axios, { AxiosResponse } from "axios";
import { getToken } from "./authApi";

export const getTickets = async (): Promise<AxiosResponse> => {
  return axios.post(
    "http://10.101.104.140:5090/dashboard",
    {},
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};
