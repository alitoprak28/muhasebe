import { api, unwrap } from "./api";
import { mockClient, withMockFallback } from "./mockClient";

export const currentService = {
  list: (params) =>
    withMockFallback(
      () => api.get("/currents", { params }).then(unwrap),
      () => mockClient.currents.list(params)
    ),
  getById: (id) =>
    withMockFallback(
      () => api.get(`/currents/${id}`).then(unwrap),
      () => mockClient.currents.getById(id)
    ),
  create: (payload) =>
    withMockFallback(
      () => api.post("/currents", payload).then(unwrap),
      () => mockClient.currents.create(payload)
    ),
  update: (id, payload) =>
    withMockFallback(
      () => api.put(`/currents/${id}`, payload).then(unwrap),
      () => mockClient.currents.update(id, payload)
    ),
  getStatement: (id, params) =>
    withMockFallback(
      () => api.get(`/currents/${id}/statement`, { params }).then(unwrap),
      () => mockClient.currents.getStatement(id, params)
    ),
};
