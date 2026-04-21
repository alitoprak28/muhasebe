import { api, unwrap } from "./api";
import { mockClient, withMockFallback } from "./mockClient";

export const expenseService = {
  list: (params) =>
    withMockFallback(
      () => api.get("/expenses", { params }).then(unwrap),
      () => mockClient.expenses.list(params)
    ),
  getById: (id) =>
    withMockFallback(
      () => api.get(`/expenses/${id}`).then(unwrap),
      () => mockClient.expenses.getById(id)
    ),
  create: (payload) =>
    withMockFallback(
      () => api.post("/expenses", payload).then(unwrap),
      () => mockClient.expenses.create(payload)
    ),
  update: (id, payload) =>
    withMockFallback(
      () => api.put(`/expenses/${id}`, payload).then(unwrap),
      () => mockClient.expenses.update(id, payload)
    ),
  remove: (id) =>
    withMockFallback(
      () => api.delete(`/expenses/${id}`).then(unwrap),
      () => mockClient.expenses.remove(id)
    ),
};
