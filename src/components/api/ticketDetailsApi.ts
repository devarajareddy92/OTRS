import axios, { AxiosResponse } from "axios";
import { getToken } from "./authApi";

export const getTicketDetails = async (id: any): Promise<AxiosResponse> => {
  return axios.post(
    `http://10.101.104.140:8090/ticket_details/${id}`,
    {},
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};
