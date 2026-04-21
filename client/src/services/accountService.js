import { api, unwrap } from "./api";
import { mockClient, withMockFallback } from "./mockClient";

export const accountService = {
  listCash: (params) =>
    withMockFallback(
      () => api.get("/cash/accounts", { params }).then(unwrap),
      () => mockClient.accounts.listCash(params)
    ),
  createCash: (payload) =>
    withMockFallback(
      () => api.post("/cash/accounts", payload).then(unwrap),
      () => mockClient.accounts.createCash(payload)
    ),
  updateCash: (id, payload) =>
    withMockFallback(
      () => api.put(`/cash/accounts/${id}`, payload).then(unwrap),
      () => mockClient.accounts.updateCash(id, payload)
    ),
  getCashMovements: (id, params) =>
    withMockFallback(
      () => api.get(`/cash/accounts/${id}/movements`, { params }).then(unwrap),
      () => mockClient.accounts.getCashMovements(id, params)
    ),
  listBanks: (params) =>
    withMockFallback(
      () => api.get("/banks/accounts", { params }).then(unwrap),
      () => mockClient.accounts.listBanks(params)
    ),
  createBank: (payload) =>
    withMockFallback(
      () => api.post("/banks/accounts", payload).then(unwrap),
      () => mockClient.accounts.createBank(payload)
    ),
  updateBank: (id, payload) =>
    withMockFallback(
      () => api.put(`/banks/accounts/${id}`, payload).then(unwrap),
      () => mockClient.accounts.updateBank(id, payload)
    ),
  getBankMovements: (id, params) =>
    withMockFallback(
      () => api.get(`/banks/accounts/${id}/movements`, { params }).then(unwrap),
      () => mockClient.accounts.getBankMovements(id, params)
    ),
};
