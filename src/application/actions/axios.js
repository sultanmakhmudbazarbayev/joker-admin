import AXIOS from "axios";
import { setupCache } from "axios-cache-interceptor";
import { getSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const axios = AXIOS.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// setupCache(axios, {
//   methods: ["get"],
//   ttl: 1000 * 5,
//   debug: console.log,
// });

axios.interceptors.request.use(async (request) => {
  const session = await getSession();

  if (session) {
    const token = session?.token;
    if (token) {
      request.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return request;
});

axios.interceptors.response.use(
  (response) => response,
  (e) => {
    if (e?.response?.status === 401) {
      return signOut();
    }

    return Promise.reject(e?.response?.data);
  }
);

export default axios;
