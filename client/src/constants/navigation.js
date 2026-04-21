import {
  BellRing,
  Banknote,
  Boxes,
  BookUser,
  ChartColumn,
  ClipboardList,
  CircleDollarSign,
  CreditCard,
  CalendarDays,
  FileText,
  FolderOpen,
  HandCoins,
  LayoutDashboard,
  Landmark,
  Scale,
  ReceiptText,
  ScrollText,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Truck,
  WalletCards,
  Warehouse,
} from "lucide-react";
import { ROLES } from "./roles";

export const navigation = [
  {
    title: "Kontrol Merkezi",
    items: [
      {
        label: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Raporlar",
        path: "/reports",
        icon: ChartColumn,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Bildirimler",
        path: "/notifications",
        icon: BellRing,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Takvim",
        path: "/calendar",
        icon: CalendarDays,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
    ],
  },
  {
    title: "Finans Operasyonlari",
    items: [
      {
        label: "Gelirler",
        path: "/incomes",
        icon: CircleDollarSign,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Giderler",
        path: "/expenses",
        icon: CreditCard,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Cari Hesaplar",
        path: "/currents",
        icon: BookUser,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Tahsilatlar",
        path: "/collections",
        icon: HandCoins,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Odemeler",
        path: "/payments",
        icon: WalletCards,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Kasa",
        path: "/cash",
        icon: Banknote,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Banka",
        path: "/banks",
        icon: Landmark,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Faturalar",
        path: "/invoices",
        icon: ReceiptText,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Cek / Senet",
        path: "/checks",
        icon: ScrollText,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Genel Muhasebe",
        path: "/accounting",
        icon: Scale,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
      },
    ],
  },
  {
    title: "Ticari Akislar",
    items: [
      {
        label: "Urun / Hizmetler",
        path: "/catalog",
        icon: Boxes,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Depolar / Stok",
        path: "/inventory",
        icon: Warehouse,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Teklifler",
        path: "/offers",
        icon: FileText,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Siparisler",
        path: "/orders",
        icon: ShoppingCart,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Irsaliyeler",
        path: "/dispatch-notes",
        icon: Truck,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
      {
        label: "Dokumanlar",
        path: "/documents",
        icon: FolderOpen,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.VIEWER],
      },
    ],
  },
  {
    title: "Yonetim",
    items: [
      {
        label: "Kullanicilar",
        path: "/users",
        icon: ShieldCheck,
        roles: [ROLES.ADMIN],
      },
      {
        label: "Ayarlar",
        path: "/settings",
        icon: Settings,
        roles: [ROLES.ADMIN],
      },
      {
        label: "Islem Loglari",
        path: "/activity-logs",
        icon: ClipboardList,
        roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
      },
    ],
  },
];
