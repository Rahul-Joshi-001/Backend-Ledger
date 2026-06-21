
// src/api/transaction.js

import API from "./axios";

export const createTransaction = (data) => {
  return API.post("/api/transactions", data);
};

export const createInitialFund = (data) => {
  return API.post("/api/transactions/system/initial-fund", data);
};