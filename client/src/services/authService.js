import { api, unwrap } from "./api";
import { isMockModeEnabled } from "../mock/demoDatabase";
import { mockClient, withMockFallback } from "./mockClient";

export const authService = {
  login: (payload) =>
    withMockFallback(
      () => api.post("/auth/login", payload).then(unwrap),
      () => mockClient.auth.login(payload)
    ),
  me: () =>
    withMockFallback(
      () => api.get("/auth/me").then(unwrap),
      () => mockClient.auth.me(),
      { enableOnNetworkError: isMockModeEnabled() }
    ),
  logout: () => mockClient.auth.logout(),
};
