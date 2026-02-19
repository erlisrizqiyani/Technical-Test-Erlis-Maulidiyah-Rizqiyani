import { api } from "./api";

export const transactionsService = {
  list: async () => (await api.get("/transactions?_sort=createdAt&_order=desc")).data,
  create: async (payload) => (await api.post("/transactions", payload)).data
};
