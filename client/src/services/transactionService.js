import { api, unwrap } from "./api";
import { mockClient, withMockFallback } from "./mockClient";

export const transactionService = {
  list: (params) =>
    withMockFallback(
      () => api.get("/transactions", { params }).then(unwrap),
      () => mockClient.transactions.list(params)
    ),
};
