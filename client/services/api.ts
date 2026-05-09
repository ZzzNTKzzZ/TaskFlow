import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    console.info(`[request] [${JSON.stringify(config)}]`);
    return config;
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  console.info(`[response] [${JSON.stringify(response)}]`)
  return response
}

const onRequestError = async (error: AxiosError): Promise<AxiosError> => {
  console.info(`[request error] [${JSON.stringify(error)}]`);
  const originalRequest = error.config as InternalAxiosRequestConfig
  if(error.response?.status === 401) {
    try {
      const { data } = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh-token`, {
        
      })
    } catch (error) {
      
    }
  }
    return Promise.reject(error);
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[response error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
}

axios.interceptors.request.use(onRequest, onRequestError)
axios.interceptors.response.use(onResponse, onResponseError)