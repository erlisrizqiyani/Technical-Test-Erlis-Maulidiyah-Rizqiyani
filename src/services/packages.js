import { api } from "./api";

export const packagesService = {
  list: async () => (await api.get("/packages?_sort=id&_order=desc")).data,
  get: async (id) => (await api.get(`/packages/${id}`)).data
};
