import axios, { AxiosResponse } from "axios";
import { getToken } from "./authApi";

export const getUsers = async (): Promise<AxiosResponse> => {
  return axios.get(
    "http://10.101.104.140:8090/user_group_list",
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};

