import axios, { AxiosResponse } from "axios";
import { getToken } from "./authApi";

export const getTicketDetails = async (id: string): Promise<AxiosResponse> => {
  return axios.post(
    `http://10.101.104.140:5090/ticket_details/${id}`,
    {},
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};
