import { connectDatabase } from "../config/db.js";
import { BankAccount } from "../models/BankAccount.js";
import { CashAccount } from "../models/CashAccount.js";
import { CurrentAccount } from "../models/CurrentAccount.js";
import { Expense } from "../models/Expense.js";
import { Income } from "../models/Income.js";
import { Invoice } from "../models/Invoice.js";
import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";
import { createExpense } from "../services/expenseService.js";
import { createIncome } from "../services/incomeService.js";
import { createInvoice, recordInvoicePayment } from "../services/invoiceService.js";

const seed = async () => {
  await connectDatabase();

  await Promise.all([
    Transaction.deleteMany({}),
    Income.deleteMany({}),
    Expense.deleteMany({}),
    Invoice.deleteMany({}),
    CurrentAccount.deleteMany({}),
    CashAccount.deleteMany({}),
    BankAccount.deleteMany({}),
    User.deleteMany({}),
  ]);

  const [admin, accountant, viewer] = await User.create([
    {
      name: "Selin Arslan",
      email: "selin.arslan@novafin.com",
      password: "Demo123!",
      role: "admin",
      status: "active",
    },
    {
      name: "Emre Demir",
      email: "emre.demir@novafin.com",
      password: "Demo123!",
      role: "accountant",
      status: "active",
    },
    {
      name: "Ayse Kaya",
      email: "ayse.kaya@novafin.com",
      password: "Demo123!",
      role: "viewer",
      status: "active",
    },
  ]);

  const currents = await CurrentAccount.create([
    {
      type: "customer",
      name: "Marmara Teknoloji A.S.",
      phone: "+90 212 450 11 22",
      email: "finans@marmarateknoloji.com",
      address: "Maslak, Istanbul",
      taxNumber: "3456789012",
      notes: "Kurumsal bakim ve entegrasyon hizmeti aliyor.",
    },
    {
      type: "customer",
      name: "Verde Perakende Ltd.",
      phone: "+90 216 550 33 44",
      email: "muhasebe@verde.com.tr",
      address: "Kozyatagi, Istanbul",
      taxNumber: "4567890123",
      notes: "Aylik raporlama ve dashboard aboneligi.",
    },
    {
      type: "customer",
      name: "Anka Danismanlik",
      phone: "+90 312 289 77 66",
      email: "info@ankadanismanlik.com",
      address: "Cankaya, Ankara",
      taxNumber: "5678901234",
      notes: "Proje bazli finansal danismanlik musteri hesabi.",
    },
    {
      type: "supplier",
      name: "Bulut Yazilim Hizmetleri",
      phone: "+90 850 333 22 11",
      email: "billing@bulutyazilim.com",
      address: "Levent, Istanbul",
      taxNumber: "6789012345",
      notes: "Sunucu, lisans ve SaaS altyapisi tedarikcisi.",
    },
    {
      type: "supplier",
      name: "Eksen Ofis ve Tedarik",
      phone: "+90 232 445 21 90",
      email: "destek@eksenofis.com",
      address: "Konak, Izmir",
      taxNumber: "7890123456",
      notes: "Ofis sarf ve operasyonel tedarik.",
    },
  ]);

  const cashAccounts = await CashAccount.create([
    {
      name: "Merkez Kasa",
      code: "KASA-001",
      isDefault: true,
      description: "Gunluk operasyonel nakit hareketleri",
    },
    {
      name: "Saha Operasyon Kasasi",
      code: "KASA-002",
      description: "Saha ekipleri ve seyahat odemeleri",
    },
  ]);

  const bankAccounts = await BankAccount.create([
    {
      bankName: "Akbank",
      accountName: "NovaFin Ana Hesap",
      iban: "TR410006200119000006672315",
      accountNumber: "6672315",
      branchCode: "1190",
    },
    {
      bankName: "Turkiye Is Bankasi",
      accountName: "NovaFin Operasyon Hesabi",
      iban: "TR440006400000000887766554",
      accountNumber: "887766554",
      branchCode: "1024",
    },
  ]);

  const currentMap = {
    marmara: currents[0],
    verde: currents[1],
    anka: currents[2],
    bulut: currents[3],
    eksen: currents[4],
  };

  const accountMap = {
    mainCash: cashAccounts[0],
    fieldCash: cashAccounts[1],
    akbank: bankAccounts[0],
    isbank: bankAccounts[1],
  };

  const incomes = [
    {
      title: "Ocak bakim hizmet bedeli",
      description: "Marmara Teknoloji aylik ERP ve finans panel bakim hizmeti",
      category: "service_sale",
      amount: 28500,
      date: new Date("2026-01-06"),
      paymentMethod: "bank_transfer",
      currentAccount: currentMap.marmara._id.toString(),
      documentNumber: "GLR-2026-001",
      accountModel: "BankAccount",
      account: accountMap.akbank._id.toString(),
    },
    {
      title: "Dashboard lisans yenileme",
      description: "Verde Perakende SaaS abonelik yenilemesi",
      category: "subscription",
      amount: 19800,
      date: new Date("2026-01-28"),
      paymentMethod: "credit_card",
      currentAccount: currentMap.verde._id.toString(),
      documentNumber: "GLR-2026-002",
      accountModel: "BankAccount",
      account: accountMap.isbank._id.toString(),
    },
    {
      title: "Sube raporlama kurulumu",
      description: "Anka Danismanlik finansal raporlama kurulum fazi",
      category: "consulting",
      amount: 36500,
      date: new Date("2026-02-11"),
      paymentMethod: "bank_transfer",
      currentAccount: currentMap.anka._id.toString(),
      documentNumber: "GLR-2026-003",
      accountModel: "BankAccount",
      account: accountMap.akbank._id.toString(),
    },
    {
      title: "Subat teknik destek paketi",
      description: "Marmara Teknoloji yerinde destek hizmeti",
      category: "service_sale",
      amount: 22400,
      date: new Date("2026-02-24"),
      paymentMethod: "eft",
      currentAccount: currentMap.marmara._id.toString(),
      documentNumber: "GLR-2026-004",
      accountModel: "CashAccount",
      account: accountMap.mainCash._id.toString(),
    },
    {
      title: "Kampanya veri modeli optimizasyonu",
      description: "Verde Perakende kampanya donemi analiz modeli",
      category: "consulting",
      amount: 31250,
      date: new Date("2026-03-05"),
      paymentMethod: "bank_transfer",
      currentAccount: currentMap.verde._id.toString(),
      documentNumber: "GLR-2026-005",
      accountModel: "BankAccount",
      account: accountMap.akbank._id.toString(),
    },
    {
      title: "Musteri finans paneli ek modulu",
      description: "Anka Danismanlik ek dashboard modulu",
      category: "product_sale",
      amount: 41400,
      date: new Date("2026-03-18"),
      paymentMethod: "bank_transfer",
      currentAccount: currentMap.anka._id.toString(),
      documentNumber: "GLR-2026-006",
      accountModel: "BankAccount",
      account: accountMap.isbank._id.toString(),
    },
    {
      title: "Mart operasyon destek odemesi",
      description: "Marmara Teknoloji saha operasyon destek paketi",
      category: "service_sale",
      amount: 25900,
      date: new Date("2026-04-03"),
      paymentMethod: "cash",
      currentAccount: currentMap.marmara._id.toString(),
      documentNumber: "GLR-2026-007",
      accountModel: "CashAccount",
      account: accountMap.fieldCash._id.toString(),
    },
    {
      title: "Nisan abonelik tahsilati",
      description: "Verde Perakende aylik kullanici lisanslari",
      category: "subscription",
      amount: 22800,
      date: new Date("2026-04-14"),
      paymentMethod: "credit_card",
      currentAccount: currentMap.verde._id.toString(),
      documentNumber: "GLR-2026-008",
      accountModel: "BankAccount",
      account: accountMap.akbank._id.toString(),
    },
  ];

  for (const item of incomes) {
    await createIncome(item, accountant);
  }

  const expenses = [
    {
      title: "Maslak ofis kira gideri",
      description: "Ocak-Nisan donemi kira odemesi",
      category: "rent",
      amount: 18500,
      date: new Date("2026-01-03"),
      paymentMethod: "bank_transfer",
      receiptNumber: "GDR-2026-001",
      status: "paid",
      accountModel: "BankAccount",
      account: accountMap.akbank._id.toString(),
      currentAccount: currentMap.eksen._id.toString(),
    },
    {
      title: "Bulut altyapi lisans paketi",
      description: "Sunucu, veri yedekleme ve lisans yenilemeleri",
      category: "software",
      amount: 12400,
      date: new Date("2026-01-19"),
      paymentMethod: "credit_card",
      receiptNumber: "GDR-2026-002",
      status: "paid",
      accountModel: "BankAccount",
      account: accountMap.isbank._id.toString(),
      currentAccount: currentMap.bulut._id.toString(),
    },
    {
      title: "Sube ziyaret seyahat gideri",
      description: "Ankara musteri saha ziyareti",
      category: "logistics",
      amount: 4800,
      date: new Date("2026-02-07"),
      paymentMethod: "cash",
      receiptNumber: "GDR-2026-003",
      status: "paid",
      accountModel: "CashAccount",
      account: accountMap.fieldCash._id.toString(),
      currentAccount: currentMap.eksen._id.toString(),
    },
    {
      title: "Pazarlama performans kampanyasi",
      description: "LinkedIn ve Google kampanya butcesi",
      category: "marketing",
      amount: 9600,
      date: new Date("2026-02-26"),
      paymentMethod: "credit_card",
      receiptNumber: "GDR-2026-004",
      status: "paid",
      accountModel: "BankAccount",
      account: accountMap.isbank._id.toString(),
    },
    {
      title: "Mart yazilim lisans yenilemesi",
      description: "Tasarim ve muhasebe lisans paketi",
      category: "software",
      amount: 7400,
      date: new Date("2026-03-08"),
      paymentMethod: "eft",
      receiptNumber: "GDR-2026-005",
      status: "paid",
      accountModel: "BankAccount",
      account: accountMap.akbank._id.toString(),
      currentAccount: currentMap.bulut._id.toString(),
    },
    {
      title: "Personel maas odemesi - Mart",
      description: "Operasyon ve destek ekip maas dagilimi",
      category: "salary",
      amount: 54000,
      date: new Date("2026-03-29"),
      paymentMethod: "bank_transfer",
      receiptNumber: "GDR-2026-006",
      status: "paid",
      accountModel: "BankAccount",
      account: accountMap.akbank._id.toString(),
    },
    {
      title: "Nisan elektrik ve internet gideri",
      description: "Merkez ofis altyapi giderleri",
      category: "utilities",
      amount: 6900,
      date: new Date("2026-04-10"),
      paymentMethod: "bank_transfer",
      receiptNumber: "GDR-2026-007",
      status: "paid",
      accountModel: "BankAccount",
      account: accountMap.isbank._id.toString(),
    },
    {
      title: "Yeni donem yedekleme servisi",
      description: "Bulut yazilim tedarikcisine odeme bekliyor",
      category: "software",
      amount: 13800,
      date: new Date("2026-04-18"),
      dueDate: new Date("2026-04-25"),
      paymentMethod: "bank_transfer",
      receiptNumber: "GDR-2026-008",
      status: "pending",
      currentAccount: currentMap.bulut._id.toString(),
    },
  ];

  for (const item of expenses) {
    await createExpense(item, accountant);
  }

  const createdInvoices = [];

  createdInvoices.push(
    await createInvoice(
      {
        invoiceNumber: "FTR-2026-001",
        currentAccount: currentMap.marmara._id.toString(),
        issueDate: new Date("2026-02-01"),
        dueDate: new Date("2026-02-21"),
        items: [
          {
            description: "Aylik finans paneli hizmet bedeli",
            quantity: 1,
            unitPrice: 72000,
            vatRate: 20,
          },
        ],
        notes: "20 kullanicili kurumsal lisans paketi",
      },
      admin
    )
  );

  createdInvoices.push(
    await createInvoice(
      {
        invoiceNumber: "FTR-2026-002",
        currentAccount: currentMap.verde._id.toString(),
        issueDate: new Date("2026-03-10"),
        dueDate: new Date("2026-03-25"),
        items: [
          {
            description: "Magaza bazli satis analiz modul paketi",
            quantity: 3,
            unitPrice: 12000,
            vatRate: 20,
          },
        ],
        notes: "Kampanya donemi raporlama genisletmesi",
      },
      admin
    )
  );

  createdInvoices.push(
    await createInvoice(
      {
        invoiceNumber: "FTR-2026-003",
        currentAccount: currentMap.anka._id.toString(),
        issueDate: new Date("2026-04-04"),
        dueDate: new Date("2026-04-19"),
        items: [
          {
            description: "Surec otomasyon ve butce modelleme paketi",
            quantity: 2,
            unitPrice: 18000,
            vatRate: 20,
          },
        ],
        notes: "Danismanlik surecinin ikinci fazi",
      },
      admin
    )
  );

  await recordInvoicePayment(
    createdInvoices[0]._id,
    {
      amount: 60000,
      paymentDate: new Date("2026-02-15"),
      paymentMethod: "bank_transfer",
      accountModel: "BankAccount",
      account: accountMap.akbank._id.toString(),
      note: "Ilk fatura parcali tahsilat",
    },
    accountant
  );

  await recordInvoicePayment(
    createdInvoices[2]._id,
    {
      amount: 43200,
      paymentDate: new Date("2026-04-17"),
      paymentMethod: "bank_transfer",
      accountModel: "BankAccount",
      account: accountMap.isbank._id.toString(),
      note: "Tam tahsilat",
    },
    accountant
  );

  console.log("Demo veri basariyla olusturuldu.");
  console.log("Admin girisi: selin.arslan@novafin.com / Demo123!");
  console.log("Muhasebeci girisi: emre.demir@novafin.com / Demo123!");
  console.log("Goruntuleyici girisi: ayse.kaya@novafin.com / Demo123!");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed sirasinda hata:", error);
  process.exit(1);
});
