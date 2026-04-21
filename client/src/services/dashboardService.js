import { api, unwrap } from "./api";
import { mockClient, withMockFallback } from "./mockClient";

export const dashboardService = {
  getOverview: () =>
    withMockFallback(
      () => api.get("/dashboard").then(unwrap),
      () => mockClient.dashboard.getOverview()
    ),
};
