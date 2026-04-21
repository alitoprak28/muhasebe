import { demoApi, isMockModeEnabled, mockServices } from "../mock/demoDatabase";

const isNetworkError = (error) =>
  !error?.response &&
  (error?.code === "ERR_NETWORK" ||
    error?.message?.includes("Network Error") ||
    error?.message?.includes("Failed to fetch"));

export const withMockFallback = async (apiCall, mockCall, { enableOnNetworkError = true } = {}) => {
  if (isMockModeEnabled()) {
    return mockCall();
  }

  try {
    return await apiCall();
  } catch (error) {
    if (enableOnNetworkError && isNetworkError(error)) {
      return mockCall();
    }

    throw error;
  }
};

export const mockClient = {
  auth: demoApi.auth,
  dashboard: demoApi.dashboard,
  incomes: mockServices.incomes,
  expenses: mockServices.expenses,
  currents: mockServices.currents,
  accounts: mockServices.accounts,
  invoices: mockServices.invoices,
  reports: mockServices.reports,
  users: mockServices.users,
  transactions: mockServices.transactions,
};
