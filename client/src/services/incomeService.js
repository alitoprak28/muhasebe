import { api, unwrap } from "./api";
import { mockClient, withMockFallback } from "./mockClient";

export const incomeService = {
  list: (params) =>
    withMockFallback(
      () => api.get("/incomes", { params }).then(unwrap),
      () => mockClient.incomes.list(params)
    ),
  getById: (id) =>
    withMockFallback(
      () => api.get(`/incomes/${id}`).then(unwrap),
      () => mockClient.incomes.getById(id)
    ),
  create: (payload) =>
    withMockFallback(
      () => api.post("/incomes", payload).then(unwrap),
      () => mockClient.incomes.create(payload)
    ),
  update: (id, payload) =>
    withMockFallback(
      () => api.put(`/incomes/${id}`, payload).then(unwrap),
      () => mockClient.incomes.update(id, payload)
    ),
  remove: (id) =>
    withMockFallback(
      () => api.delete(`/incomes/${id}`).then(unwrap),
      () => mockClient.incomes.remove(id)
    ),
};
