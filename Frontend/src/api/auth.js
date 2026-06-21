
import API from "./axios";

export const registerUser = (data) => {
  return API.post("/api/auth/register", data);
};

export const loginUser = (data) => {
  return API.post("/api/auth/login", data);
};

export const logoutUser = () => {
  return API.post("/api/auth/logout");
};