import axios from "axios";
import { getToken } from "./authApi";

export const upload = async () => {
  return axios.post(
    "http://10.101.104.140:5090/file_upload",
    {},
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};
