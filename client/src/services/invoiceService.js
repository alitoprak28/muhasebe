import { api, unwrap } from "./api";
import { mockClient, withMockFallback } from "./mockClient";

export const invoiceService = {
  list: (params) =>
    withMockFallback(
      () => api.get("/invoices", { params }).then(unwrap),
      () => mockClient.invoices.list(params)
    ),
  getById: (id) =>
    withMockFallback(
      () => api.get(`/invoices/${id}`).then(unwrap),
      () => mockClient.invoices.getById(id)
    ),
  create: (payload) =>
    withMockFallback(
      () => api.post("/invoices", payload).then(unwrap),
      () => mockClient.invoices.create(payload)
    ),
  update: (id, payload) =>
    withMockFallback(
      () => api.put(`/invoices/${id}`, payload).then(unwrap),
      () => mockClient.invoices.update(id, payload)
    ),
  recordPayment: (id, payload) =>
    withMockFallback(
      () => api.patch(`/invoices/${id}/payment`, payload).then(unwrap),
      () => mockClient.invoices.recordPayment(id, payload)
    ),
  remove: (id) =>
    withMockFallback(
      () => api.delete(`/invoices/${id}`).then(unwrap),
      () => mockClient.invoices.remove(id)
    ),
};
