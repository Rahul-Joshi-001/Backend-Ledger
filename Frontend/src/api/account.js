// src/api/account.js

import API from "./axios";

export const createAccount = (data) => {
  return API.post("/api/accounts", data);
};

export const getUserAccounts = () => {
  return API.get("/api/accounts");
};

export const getAccountBalance = (accountId) => {
  return API.get(`/api/accounts/balance/${accountId}`);
};