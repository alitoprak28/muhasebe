import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";
import { LoadingState } from "../components/common/LoadingState";
import { LoginPage } from "../pages/auth/LoginPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { IncomesPage } from "../pages/incomes/IncomesPage";
import { ExpensesPage } from "../pages/expenses/ExpensesPage";
import { CurrentsPage } from "../pages/currents/CurrentsPage";
import { AccountsPage } from "../pages/accounts/AccountsPage";
import { CashPage } from "../pages/cash/CashPage";
import { BanksPage } from "../pages/banks/BanksPage";
import { CatalogPage } from "../pages/catalog/CatalogPage";
import { InventoryPage } from "../pages/inventory/InventoryPage";
import { OffersPage } from "../pages/offers/OffersPage";
import { OrdersPage } from "../pages/orders/OrdersPage";
import { DispatchNotesPage } from "../pages/dispatch/DispatchNotesPage";
import { CollectionsPage } from "../pages/collections/CollectionsPage";
import { PaymentsPage } from "../pages/payments/PaymentsPage";
import { ChecksPage } from "../pages/checks/ChecksPage";
import { AccountingPage } from "../pages/accounting/AccountingPage";
import { InvoicesPage } from "../pages/invoices/InvoicesPage";
import { DocumentsPage } from "../pages/documents/DocumentsPage";
import { NotificationsPage } from "../pages/notifications/NotificationsPage";
import { CalendarPage } from "../pages/calendar/CalendarPage";
import { ReportsPage } from "../pages/reports/ReportsPage";
import { UsersPage } from "../pages/users/UsersPage";
import { SettingsPage } from "../pages/settings/SettingsPage";
import { ActivityLogsPage } from "../pages/logs/ActivityLogsPage";
import { NotFoundPage } from "../pages/NotFoundPage";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingState label="Oturum dogrulaniyor..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingState label="Oturum bilgileri hazirlaniyor..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/incomes" element={<IncomesPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/currents" element={<CurrentsPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/dispatch-notes" element={<DispatchNotesPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/cash" element={<CashPage />} />
          <Route path="/banks" element={<BanksPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/checks" element={<ChecksPage />} />
          <Route
            path="/accounting"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.ACCOUNTANT]}>
                <AccountingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity-logs"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.ACCOUNTANT]}>
                <ActivityLogsPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
