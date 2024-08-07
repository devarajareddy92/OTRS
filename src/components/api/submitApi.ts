import axios from "axios";
import { getToken } from "./authApi";

export const SubmitUuid = async (Uuid: any, id: string, title: string, description: string) => {
  return axios.post(
    `http://10.101.104.140:8090/submit_resolution/ticket_details/${id}`,
    { Uuid, title, description },
    {
      headers: {
        Authorization: getToken(),
        Accept: 'application/json',
      },
    }
  );
};
