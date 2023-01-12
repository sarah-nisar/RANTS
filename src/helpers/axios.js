import axios from "axios";
import { baseUrl } from "../urlConfig";

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

export default axiosInstance;
