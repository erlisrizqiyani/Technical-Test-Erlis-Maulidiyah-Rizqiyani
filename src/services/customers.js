import { api } from "./api";

export const customersService = {
  list: async () => (await api.get("/customers?_sort=id&_order=desc")).data,
  get: async (id) => (await api.get(`/customers/${id}`)).data,
  create: async (payload) => (await api.post("/customers", payload)).data,
  update: async (id, payload) => (await api.put(`/customers/${id}`, payload)).data,
  patch: async (id, payload) => (await api.patch(`/customers/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`/customers/${id}`)).data
};
