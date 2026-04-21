import { api, unwrap } from "./api";
import { mockClient, withMockFallback } from "./mockClient";

export const userService = {
  list: (params) =>
    withMockFallback(
      () => api.get("/users", { params }).then(unwrap),
      () => mockClient.users.list(params)
    ),
  create: (payload) =>
    withMockFallback(
      () => api.post("/users", payload).then(unwrap),
      () => mockClient.users.create(payload)
    ),
  updateStatus: (id, payload) =>
    withMockFallback(
      () => api.patch(`/users/${id}/status`, payload).then(unwrap),
      () => mockClient.users.updateStatus(id, payload)
    ),
};
