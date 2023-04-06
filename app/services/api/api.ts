import axios, {AxiosError} from 'axios';

export const API_URL = 'https://map.makrab.net';
export const instance = axios.create({
  baseURL: API_URL,
});

export const catchingAxiosErrors = (error: Error | AxiosError): string => {
  if (!axios.isAxiosError(error)) {
    return error.message;
  }

  let axiosResponse = {
    status: error.response?.status,
    statusText: error.response?.statusText,
    headers: error.response?.headers,
    data: error.response?.data,
  };

  let axiosRequest = error.request;

  let axiosErrorInfo = {
    response: axiosResponse,
    request: axiosRequest,
  };

  return JSON.stringify(axiosErrorInfo);
};
