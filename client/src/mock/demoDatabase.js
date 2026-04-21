const STORAGE_KEY = "novaledger_demo_db";
const USER_KEY = "novaledger_demo_user";
const MOCK_MODE_KEY = "novaledger_mock_mode";

const asDate = (value) => new Date(value).toISOString();

const initialDatabase = {
  users: [
    {
      _id: "usr_admin",
      name: "Selin Arslan",
      email: "selin.arslan@novafin.com",
      password: "Demo123!",
      role: "admin",
      status: "active",
      lastLoginAt: null,
      createdAt: asDate("2026-01-02"),
      updatedAt: asDate("2026-01-02"),
    },
    {
      _id: "usr_accountant",
      name: "Emre Demir",
      email: "emre.demir@novafin.com",
      password: "Demo123!",
      role: "accountant",
      status: "active",
      lastLoginAt: null,
      createdAt: asDate("2026-01-02"),
      updatedAt: asDate("2026-01-02"),
    },
    {
      _id: "usr_viewer",
      name: "Ayse Kaya",
      email: "ayse.kaya@novafin.com",
      password: "Demo123!",
      role: "viewer",
      status: "active",
      lastLoginAt: null,
      createdAt: asDate("2026-01-02"),
      updatedAt: asDate("2026-01-02"),
    },
  ],
  currents: [
    {
      _id: "cur_1",
      type: "customer",
      name: "Marmara Teknoloji A.S.",
      phone: "+90 212 450 11 22",
      email: "finans@marmarateknoloji.com",
      address: "Maslak, Istanbul",
      taxNumber: "3456789012",
      identityNumber: "",
      notes: "Kurumsal bakim ve entegrasyon hizmeti aliyor.",
      status: "active",
      balance: 0,
      createdAt: asDate("2026-01-03"),
      updatedAt: asDate("2026-01-03"),
    },
    {
      _id: "cur_2",
      type: "customer",
      name: "Verde Perakende Ltd.",
      phone: "+90 216 550 33 44",
      email: "muhasebe@verde.com.tr",
      address: "Kozyatagi, Istanbul",
      taxNumber: "4567890123",
      identityNumber: "",
      notes: "Aylik raporlama ve dashboard aboneligi.",
      status: "active",
      balance: 0,
      createdAt: asDate("2026-01-03"),
      updatedAt: asDate("2026-01-03"),
    },
    {
      _id: "cur_3",
      type: "customer",
      name: "Anka Danismanlik",
      phone: "+90 312 289 77 66",
      email: "info@ankadanismanlik.com",
      address: "Cankaya, Ankara",
      taxNumber: "5678901234",
      identityNumber: "",
      notes: "Proje bazli finansal danismanlik musteri hesabi.",
      status: "active",
      balance: 0,
      createdAt: asDate("2026-01-03"),
      updatedAt: asDate("2026-01-03"),
    },
    {
      _id: "cur_4",
      type: "supplier",
      name: "Bulut Yazilim Hizmetleri",
      phone: "+90 850 333 22 11",
      email: "billing@bulutyazilim.com",
      address: "Levent, Istanbul",
      taxNumber: "6789012345",
      identityNumber: "",
      notes: "Sunucu, lisans ve SaaS altyapisi tedarikcisi.",
      status: "active",
      balance: 0,
      createdAt: asDate("2026-01-03"),
      updatedAt: asDate("2026-01-03"),
    },
    {
      _id: "cur_5",
      type: "supplier",
      name: "Eksen Ofis ve Tedarik",
      phone: "+90 232 445 21 90",
      email: "destek@eksenofis.com",
      address: "Konak, Izmir",
      taxNumber: "7890123456",
      identityNumber: "",
      notes: "Ofis sarf ve operasyonel tedarik.",
      status: "active",
      balance: 0,
      createdAt: asDate("2026-01-03"),
      updatedAt: asDate("2026-01-03"),
    },
  ],
  cashAccounts: [
    {
      _id: "cash_1",
      name: "Merkez Kasa",
      code: "KASA-001",
      currency: "TRY",
      balance: 0,
      isDefault: true,
      description: "Gunluk operasyonel nakit hareketleri",
      status: "active",
      createdAt: asDate("2026-01-03"),
      updatedAt: asDate("2026-01-03"),
    },
    {
      _id: "cash_2",
      name: "Saha Operasyon Kasasi",
      code: "KASA-002",
      currency: "TRY",
      balance: 0,
      isDefault: false,
      description: "Saha ekipleri ve seyahat odemeleri",
      status: "active",
      createdAt: asDate("2026-01-03"),
      updatedAt: asDate("2026-01-03"),
    },
  ],
  bankAccounts: [
    {
      _id: "bank_1",
      bankName: "Akbank",
      accountName: "NovaFin Ana Hesap",
      iban: "TR410006200119000006672315",
      accountNumber: "6672315",
      branchCode: "1190",
      balance: 0,
      currency: "TRY",
      status: "active",
      createdAt: asDate("2026-01-03"),
      updatedAt: asDate("2026-01-03"),
    },
    {
      _id: "bank_2",
      bankName: "Turkiye Is Bankasi",
      accountName: "NovaFin Operasyon Hesabi",
      iban: "TR440006400000000887766554",
      accountNumber: "887766554",
      branchCode: "1024",
      balance: 0,
      currency: "TRY",
      status: "active",
      createdAt: asDate("2026-01-03"),
      updatedAt: asDate("2026-01-03"),
    },
  ],
  incomes: [
    {
      _id: "inc_1",
      title: "Ocak bakim hizmet bedeli",
      description: "Marmara Teknoloji aylik ERP ve finans panel bakim hizmeti",
      category: "service_sale",
      amount: 28500,
      date: asDate("2026-01-06"),
      paymentMethod: "bank_transfer",
      currentAccount: "cur_1",
      documentNumber: "GLR-2026-001",
      accountModel: "BankAccount",
      account: "bank_1",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-01-06"),
      updatedAt: asDate("2026-01-06"),
    },
    {
      _id: "inc_2",
      title: "Dashboard lisans yenileme",
      description: "Verde Perakende SaaS abonelik yenilemesi",
      category: "subscription",
      amount: 19800,
      date: asDate("2026-01-28"),
      paymentMethod: "credit_card",
      currentAccount: "cur_2",
      documentNumber: "GLR-2026-002",
      accountModel: "BankAccount",
      account: "bank_2",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-01-28"),
      updatedAt: asDate("2026-01-28"),
    },
    {
      _id: "inc_3",
      title: "Sube raporlama kurulumu",
      description: "Anka Danismanlik finansal raporlama kurulum fazi",
      category: "consulting",
      amount: 36500,
      date: asDate("2026-02-11"),
      paymentMethod: "bank_transfer",
      currentAccount: "cur_3",
      documentNumber: "GLR-2026-003",
      accountModel: "BankAccount",
      account: "bank_1",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-02-11"),
      updatedAt: asDate("2026-02-11"),
    },
    {
      _id: "inc_4",
      title: "Subat teknik destek paketi",
      description: "Marmara Teknoloji yerinde destek hizmeti",
      category: "service_sale",
      amount: 22400,
      date: asDate("2026-02-24"),
      paymentMethod: "eft",
      currentAccount: "cur_1",
      documentNumber: "GLR-2026-004",
      accountModel: "CashAccount",
      account: "cash_1",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-02-24"),
      updatedAt: asDate("2026-02-24"),
    },
    {
      _id: "inc_5",
      title: "Kampanya veri modeli optimizasyonu",
      description: "Verde Perakende kampanya donemi analiz modeli",
      category: "consulting",
      amount: 31250,
      date: asDate("2026-03-05"),
      paymentMethod: "bank_transfer",
      currentAccount: "cur_2",
      documentNumber: "GLR-2026-005",
      accountModel: "BankAccount",
      account: "bank_1",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-03-05"),
      updatedAt: asDate("2026-03-05"),
    },
    {
      _id: "inc_6",
      title: "Musteri finans paneli ek modulu",
      description: "Anka Danismanlik ek dashboard modulu",
      category: "product_sale",
      amount: 41400,
      date: asDate("2026-03-18"),
      paymentMethod: "bank_transfer",
      currentAccount: "cur_3",
      documentNumber: "GLR-2026-006",
      accountModel: "BankAccount",
      account: "bank_2",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-03-18"),
      updatedAt: asDate("2026-03-18"),
    },
    {
      _id: "inc_7",
      title: "Mart operasyon destek odemesi",
      description: "Marmara Teknoloji saha operasyon destek paketi",
      category: "service_sale",
      amount: 25900,
      date: asDate("2026-04-03"),
      paymentMethod: "cash",
      currentAccount: "cur_1",
      documentNumber: "GLR-2026-007",
      accountModel: "CashAccount",
      account: "cash_2",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-04-03"),
      updatedAt: asDate("2026-04-03"),
    },
    {
      _id: "inc_8",
      title: "Nisan abonelik tahsilati",
      description: "Verde Perakende aylik kullanici lisanslari",
      category: "subscription",
      amount: 22800,
      date: asDate("2026-04-14"),
      paymentMethod: "credit_card",
      currentAccount: "cur_2",
      documentNumber: "GLR-2026-008",
      accountModel: "BankAccount",
      account: "bank_1",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-04-14"),
      updatedAt: asDate("2026-04-14"),
    },
  ],
  expenses: [
    {
      _id: "exp_1",
      title: "Maslak ofis kira gideri",
      description: "Ocak-Nisan donemi kira odemesi",
      category: "rent",
      amount: 18500,
      date: asDate("2026-01-03"),
      dueDate: null,
      paymentMethod: "bank_transfer",
      currentAccount: "cur_5",
      receiptNumber: "GDR-2026-001",
      status: "paid",
      isRecurring: false,
      recurrenceRule: "",
      accountModel: "BankAccount",
      account: "bank_1",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-01-03"),
      updatedAt: asDate("2026-01-03"),
    },
    {
      _id: "exp_2",
      title: "Bulut altyapi lisans paketi",
      description: "Sunucu, veri yedekleme ve lisans yenilemeleri",
      category: "software",
      amount: 12400,
      date: asDate("2026-01-19"),
      dueDate: null,
      paymentMethod: "credit_card",
      currentAccount: "cur_4",
      receiptNumber: "GDR-2026-002",
      status: "paid",
      isRecurring: false,
      recurrenceRule: "",
      accountModel: "BankAccount",
      account: "bank_2",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-01-19"),
      updatedAt: asDate("2026-01-19"),
    },
    {
      _id: "exp_3",
      title: "Sube ziyaret seyahat gideri",
      description: "Ankara musteri saha ziyareti",
      category: "logistics",
      amount: 4800,
      date: asDate("2026-02-07"),
      dueDate: null,
      paymentMethod: "cash",
      currentAccount: "cur_5",
      receiptNumber: "GDR-2026-003",
      status: "paid",
      isRecurring: false,
      recurrenceRule: "",
      accountModel: "CashAccount",
      account: "cash_2",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-02-07"),
      updatedAt: asDate("2026-02-07"),
    },
    {
      _id: "exp_4",
      title: "Pazarlama performans kampanyasi",
      description: "LinkedIn ve Google kampanya butcesi",
      category: "marketing",
      amount: 9600,
      date: asDate("2026-02-26"),
      dueDate: null,
      paymentMethod: "credit_card",
      currentAccount: "",
      receiptNumber: "GDR-2026-004",
      status: "paid",
      isRecurring: false,
      recurrenceRule: "",
      accountModel: "BankAccount",
      account: "bank_2",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-02-26"),
      updatedAt: asDate("2026-02-26"),
    },
    {
      _id: "exp_5",
      title: "Mart yazilim lisans yenilemesi",
      description: "Tasarim ve muhasebe lisans paketi",
      category: "software",
      amount: 7400,
      date: asDate("2026-03-08"),
      dueDate: null,
      paymentMethod: "eft",
      currentAccount: "cur_4",
      receiptNumber: "GDR-2026-005",
      status: "paid",
      isRecurring: false,
      recurrenceRule: "",
      accountModel: "BankAccount",
      account: "bank_1",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-03-08"),
      updatedAt: asDate("2026-03-08"),
    },
    {
      _id: "exp_6",
      title: "Personel maas odemesi - Mart",
      description: "Operasyon ve destek ekip maas dagilimi",
      category: "salary",
      amount: 54000,
      date: asDate("2026-03-29"),
      dueDate: null,
      paymentMethod: "bank_transfer",
      currentAccount: "",
      receiptNumber: "GDR-2026-006",
      status: "paid",
      isRecurring: false,
      recurrenceRule: "",
      accountModel: "BankAccount",
      account: "bank_1",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-03-29"),
      updatedAt: asDate("2026-03-29"),
    },
    {
      _id: "exp_7",
      title: "Nisan elektrik ve internet gideri",
      description: "Merkez ofis altyapi giderleri",
      category: "utilities",
      amount: 6900,
      date: asDate("2026-04-10"),
      dueDate: null,
      paymentMethod: "bank_transfer",
      currentAccount: "",
      receiptNumber: "GDR-2026-007",
      status: "paid",
      isRecurring: false,
      recurrenceRule: "",
      accountModel: "BankAccount",
      account: "bank_2",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-04-10"),
      updatedAt: asDate("2026-04-10"),
    },
    {
      _id: "exp_8",
      title: "Yeni donem yedekleme servisi",
      description: "Bulut yazilim tedarikcisine odeme bekliyor",
      category: "software",
      amount: 13800,
      date: asDate("2026-04-18"),
      dueDate: asDate("2026-04-25"),
      paymentMethod: "bank_transfer",
      currentAccount: "cur_4",
      receiptNumber: "GDR-2026-008",
      status: "pending",
      isRecurring: false,
      recurrenceRule: "",
      accountModel: null,
      account: null,
      createdBy: "usr_accountant",
      createdAt: asDate("2026-04-18"),
      updatedAt: asDate("2026-04-18"),
    },
  ],
  invoices: [
    {
      _id: "inv_1",
      invoiceNumber: "FTR-2026-001",
      currentAccount: "cur_1",
      issueDate: asDate("2026-02-01"),
      dueDate: asDate("2026-02-21"),
      status: "partial",
      items: [
        {
          description: "Aylik finans paneli hizmet bedeli",
          quantity: 1,
          unitPrice: 72000,
          vatRate: 20,
          subtotal: 72000,
          vatAmount: 14400,
          total: 86400,
        },
      ],
      subtotal: 72000,
      vatTotal: 14400,
      grandTotal: 86400,
      paidAmount: 60000,
      remainingAmount: 26400,
      notes: "20 kullanicili kurumsal lisans paketi",
      createdBy: "usr_admin",
      createdAt: asDate("2026-02-01"),
      updatedAt: asDate("2026-02-15"),
    },
    {
      _id: "inv_2",
      invoiceNumber: "FTR-2026-002",
      currentAccount: "cur_2",
      issueDate: asDate("2026-03-10"),
      dueDate: asDate("2026-03-25"),
      status: "pending",
      items: [
        {
          description: "Magaza bazli satis analiz modul paketi",
          quantity: 3,
          unitPrice: 12000,
          vatRate: 20,
          subtotal: 36000,
          vatAmount: 7200,
          total: 43200,
        },
      ],
      subtotal: 36000,
      vatTotal: 7200,
      grandTotal: 43200,
      paidAmount: 0,
      remainingAmount: 43200,
      notes: "Kampanya donemi raporlama genisletmesi",
      createdBy: "usr_admin",
      createdAt: asDate("2026-03-10"),
      updatedAt: asDate("2026-03-10"),
    },
    {
      _id: "inv_3",
      invoiceNumber: "FTR-2026-003",
      currentAccount: "cur_3",
      issueDate: asDate("2026-04-04"),
      dueDate: asDate("2026-04-19"),
      status: "paid",
      items: [
        {
          description: "Surec otomasyon ve butce modelleme paketi",
          quantity: 2,
          unitPrice: 18000,
          vatRate: 20,
          subtotal: 36000,
          vatAmount: 7200,
          total: 43200,
        },
      ],
      subtotal: 36000,
      vatTotal: 7200,
      grandTotal: 43200,
      paidAmount: 43200,
      remainingAmount: 0,
      notes: "Danismanlik surecinin ikinci fazi",
      createdBy: "usr_admin",
      createdAt: asDate("2026-04-04"),
      updatedAt: asDate("2026-04-17"),
    },
  ],
  transactions: [
    {
      _id: "trx_1",
      transactionNumber: "TRX-2026001",
      type: "income",
      direction: "in",
      amount: 28500,
      date: asDate("2026-01-06"),
      paymentMethod: "bank_transfer",
      accountModel: "BankAccount",
      account: "bank_1",
      currentAccount: "cur_1",
      referenceModel: "Income",
      referenceId: "inc_1",
      note: "Ocak bakim hizmet bedeli",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-01-06"),
      updatedAt: asDate("2026-01-06"),
    },
    {
      _id: "trx_2",
      transactionNumber: "TRX-2026002",
      type: "income",
      direction: "in",
      amount: 19800,
      date: asDate("2026-01-28"),
      paymentMethod: "credit_card",
      accountModel: "BankAccount",
      account: "bank_2",
      currentAccount: "cur_2",
      referenceModel: "Income",
      referenceId: "inc_2",
      note: "Dashboard lisans yenileme",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-01-28"),
      updatedAt: asDate("2026-01-28"),
    },
    {
      _id: "trx_3",
      transactionNumber: "TRX-2026003",
      type: "income",
      direction: "in",
      amount: 36500,
      date: asDate("2026-02-11"),
      paymentMethod: "bank_transfer",
      accountModel: "BankAccount",
      account: "bank_1",
      currentAccount: "cur_3",
      referenceModel: "Income",
      referenceId: "inc_3",
      note: "Sube raporlama kurulumu",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-02-11"),
      updatedAt: asDate("2026-02-11"),
    },
    {
      _id: "trx_4",
      transactionNumber: "TRX-2026004",
      type: "income",
      direction: "in",
      amount: 22400,
      date: asDate("2026-02-24"),
      paymentMethod: "eft",
      accountModel: "CashAccount",
      account: "cash_1",
      currentAccount: "cur_1",
      referenceModel: "Income",
      referenceId: "inc_4",
      note: "Subat teknik destek paketi",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-02-24"),
      updatedAt: asDate("2026-02-24"),
    },
    {
      _id: "trx_5",
      transactionNumber: "TRX-2026005",
      type: "income",
      direction: "in",
      amount: 31250,
      date: asDate("2026-03-05"),
      paymentMethod: "bank_transfer",
      accountModel: "BankAccount",
      account: "bank_1",
      currentAccount: "cur_2",
      referenceModel: "Income",
      referenceId: "inc_5",
      note: "Kampanya veri modeli optimizasyonu",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-03-05"),
      updatedAt: asDate("2026-03-05"),
    },
    {
      _id: "trx_6",
      transactionNumber: "TRX-2026006",
      type: "income",
      direction: "in",
      amount: 41400,
      date: asDate("2026-03-18"),
      paymentMethod: "bank_transfer",
      accountModel: "BankAccount",
      account: "bank_2",
      currentAccount: "cur_3",
      referenceModel: "Income",
      referenceId: "inc_6",
      note: "Musteri finans paneli ek modulu",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-03-18"),
      updatedAt: asDate("2026-03-18"),
    },
    {
      _id: "trx_7",
      transactionNumber: "TRX-2026007",
      type: "income",
      direction: "in",
      amount: 25900,
      date: asDate("2026-04-03"),
      paymentMethod: "cash",
      accountModel: "CashAccount",
      account: "cash_2",
      currentAccount: "cur_1",
      referenceModel: "Income",
      referenceId: "inc_7",
      note: "Mart operasyon destek odemesi",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-04-03"),
      updatedAt: asDate("2026-04-03"),
    },
    {
      _id: "trx_8",
      transactionNumber: "TRX-2026008",
      type: "income",
      direction: "in",
      amount: 22800,
      date: asDate("2026-04-14"),
      paymentMethod: "credit_card",
      accountModel: "BankAccount",
      account: "bank_1",
      currentAccount: "cur_2",
      referenceModel: "Income",
      referenceId: "inc_8",
      note: "Nisan abonelik tahsilati",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-04-14"),
      updatedAt: asDate("2026-04-14"),
    },
    {
      _id: "trx_9",
      transactionNumber: "TRX-2026009",
      type: "expense",
      direction: "out",
      amount: 18500,
      date: asDate("2026-01-03"),
      paymentMethod: "bank_transfer",
      accountModel: "BankAccount",
      account: "bank_1",
      currentAccount: "cur_5",
      referenceModel: "Expense",
      referenceId: "exp_1",
      note: "Maslak ofis kira gideri",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-01-03"),
      updatedAt: asDate("2026-01-03"),
    },
    {
      _id: "trx_10",
      transactionNumber: "TRX-2026010",
      type: "expense",
      direction: "out",
      amount: 12400,
      date: asDate("2026-01-19"),
      paymentMethod: "credit_card",
      accountModel: "BankAccount",
      account: "bank_2",
      currentAccount: "cur_4",
      referenceModel: "Expense",
      referenceId: "exp_2",
      note: "Bulut altyapi lisans paketi",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-01-19"),
      updatedAt: asDate("2026-01-19"),
    },
    {
      _id: "trx_11",
      transactionNumber: "TRX-2026011",
      type: "expense",
      direction: "out",
      amount: 4800,
      date: asDate("2026-02-07"),
      paymentMethod: "cash",
      accountModel: "CashAccount",
      account: "cash_2",
      currentAccount: "cur_5",
      referenceModel: "Expense",
      referenceId: "exp_3",
      note: "Sube ziyaret seyahat gideri",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-02-07"),
      updatedAt: asDate("2026-02-07"),
    },
    {
      _id: "trx_12",
      transactionNumber: "TRX-2026012",
      type: "expense",
      direction: "out",
      amount: 9600,
      date: asDate("2026-02-26"),
      paymentMethod: "credit_card",
      accountModel: "BankAccount",
      account: "bank_2",
      currentAccount: "",
      referenceModel: "Expense",
      referenceId: "exp_4",
      note: "Pazarlama performans kampanyasi",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-02-26"),
      updatedAt: asDate("2026-02-26"),
    },
    {
      _id: "trx_13",
      transactionNumber: "TRX-2026013",
      type: "expense",
      direction: "out",
      amount: 7400,
      date: asDate("2026-03-08"),
      paymentMethod: "eft",
      accountModel: "BankAccount",
      account: "bank_1",
      currentAccount: "cur_4",
      referenceModel: "Expense",
      referenceId: "exp_5",
      note: "Mart yazilim lisans yenilemesi",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-03-08"),
      updatedAt: asDate("2026-03-08"),
    },
    {
      _id: "trx_14",
      transactionNumber: "TRX-2026014",
      type: "expense",
      direction: "out",
      amount: 54000,
      date: asDate("2026-03-29"),
      paymentMethod: "bank_transfer",
      accountModel: "BankAccount",
      account: "bank_1",
      currentAccount: "",
      referenceModel: "Expense",
      referenceId: "exp_6",
      note: "Personel maas odemesi - Mart",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-03-29"),
      updatedAt: asDate("2026-03-29"),
    },
    {
      _id: "trx_15",
      transactionNumber: "TRX-2026015",
      type: "expense",
      direction: "out",
      amount: 6900,
      date: asDate("2026-04-10"),
      paymentMethod: "bank_transfer",
      accountModel: "BankAccount",
      account: "bank_2",
      currentAccount: "",
      referenceModel: "Expense",
      referenceId: "exp_7",
      note: "Nisan elektrik ve internet gideri",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-04-10"),
      updatedAt: asDate("2026-04-10"),
    },
    {
      _id: "trx_16",
      transactionNumber: "TRX-2026016",
      type: "invoice_payment",
      direction: "in",
      amount: 60000,
      date: asDate("2026-02-15"),
      paymentMethod: "bank_transfer",
      accountModel: "BankAccount",
      account: "bank_1",
      currentAccount: "cur_1",
      referenceModel: "Invoice",
      referenceId: "inv_1",
      note: "Ilk fatura parcali tahsilat",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-02-15"),
      updatedAt: asDate("2026-02-15"),
    },
    {
      _id: "trx_17",
      transactionNumber: "TRX-2026017",
      type: "invoice_payment",
      direction: "in",
      amount: 43200,
      date: asDate("2026-04-17"),
      paymentMethod: "bank_transfer",
      accountModel: "BankAccount",
      account: "bank_2",
      currentAccount: "cur_3",
      referenceModel: "Invoice",
      referenceId: "inv_3",
      note: "Tam tahsilat",
      createdBy: "usr_accountant",
      createdAt: asDate("2026-04-17"),
      updatedAt: asDate("2026-04-17"),
    },
  ],
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const createId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const findById = (list, id) => list.find((item) => item._id === id);

const attachRelations = (db, item) => {
  if (!item) {
    return item;
  }

  const cloneItem = clone(item);

  if (cloneItem.currentAccount) {
    cloneItem.currentAccount = findById(db.currents, cloneItem.currentAccount) || null;
  }

  if (cloneItem.createdBy) {
    const user = findById(db.users, cloneItem.createdBy);
    cloneItem.createdBy = user ? { _id: user._id, name: user.name, role: user.role } : null;
  }

  if (cloneItem.account) {
    const accountList = cloneItem.accountModel === "CashAccount" ? db.cashAccounts : db.bankAccounts;
    cloneItem.account = findById(accountList, cloneItem.account) || null;
  }

  return cloneItem;
};

const withTimestamp = (payload, current) => ({
  ...payload,
  createdAt: current?.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const inDateRange = (value, startDate, endDate) => {
  const current = new Date(value).getTime();

  if (startDate && current < new Date(startDate).getTime()) {
    return false;
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    if (current > end.getTime()) {
      return false;
    }
  }

  return true;
};

const sortDescByDate = (list, field = "date") =>
  [...list].sort((left, right) => new Date(right[field]) - new Date(left[field]));

const lastMonths = (count) => {
  const today = new Date();
  return Array.from({ length: count }).map((_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (count - index - 1), 1);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const start = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

    return { month, start, end };
  });
};

const calculateInvoiceTotals = (items) => {
  const normalizedItems = items.map((item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    const vatRate = Number(item.vatRate || 0);
    const subtotal = quantity * unitPrice;
    const vatAmount = subtotal * (vatRate / 100);
    const total = subtotal + vatAmount;

    return {
      description: item.description,
      quantity,
      unitPrice,
      vatRate,
      subtotal,
      vatAmount,
      total,
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const vatTotal = normalizedItems.reduce((sum, item) => sum + item.vatAmount, 0);
  const grandTotal = normalizedItems.reduce((sum, item) => sum + item.total, 0);

  return { items: normalizedItems, subtotal, vatTotal, grandTotal };
};

const recalculateDerivedFields = (db) => {
  db.cashAccounts.forEach((account) => {
    account.balance = db.transactions
      .filter((item) => item.accountModel === "CashAccount" && item.account === account._id)
      .reduce((sum, item) => sum + (item.direction === "in" ? item.amount : -item.amount), 0);
    account.updatedAt = new Date().toISOString();
  });

  db.bankAccounts.forEach((account) => {
    account.balance = db.transactions
      .filter((item) => item.accountModel === "BankAccount" && item.account === account._id)
      .reduce((sum, item) => sum + (item.direction === "in" ? item.amount : -item.amount), 0);
    account.updatedAt = new Date().toISOString();
  });

  db.currents.forEach((current) => {
    const receivables = db.invoices
      .filter((item) => item.currentAccount === current._id)
      .reduce((sum, item) => sum + item.remainingAmount, 0);
    const payables = db.expenses
      .filter((item) => item.currentAccount === current._id && item.status !== "paid")
      .reduce((sum, item) => sum + item.amount, 0);

    current.balance = receivables - payables;
    current.updatedAt = new Date().toISOString();
  });
};

export const initializeDemoDatabase = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const db = clone(initialDatabase);
    recalculateDerivedFields(db);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  return loadDemoDatabase();
};

export const loadDemoDatabase = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const db = saved ? JSON.parse(saved) : clone(initialDatabase);
  recalculateDerivedFields(db);
  return db;
};

export const saveDemoDatabase = (db) => {
  recalculateDerivedFields(db);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  return db;
};

export const enableMockMode = () => localStorage.setItem(MOCK_MODE_KEY, "true");
export const disableMockMode = () => localStorage.removeItem(MOCK_MODE_KEY);
export const isMockModeEnabled = () => localStorage.getItem(MOCK_MODE_KEY) === "true";

export const setCurrentDemoUser = (userId) => localStorage.setItem(USER_KEY, userId);
export const clearCurrentDemoUser = () => localStorage.removeItem(USER_KEY);
export const getCurrentDemoUser = () => {
  const db = loadDemoDatabase();
  const userId = localStorage.getItem(USER_KEY);
  const user = findById(db.users, userId);
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
};

const networkMessage = "Demo mode aktif. Veriler tarayicida ornek olarak calisiyor.";

const toResponse = (data, message = networkMessage, meta = null) => ({
  success: true,
  message,
  data,
  meta,
});

const paginate = (items, page = 1, limit = 50, extraMeta = {}) => ({
  data: items.slice((page - 1) * limit, page * limit),
  meta: {
    page,
    limit,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / limit)),
    ...extraMeta,
  },
});

export const demoApi = {
  auth: {
    login: ({ email, password }) => {
      const db = initializeDemoDatabase();
      const user = db.users.find((item) => item.email === email && item.password === password);

      if (!user) {
        throw new Error("E-posta veya parola hatali.");
      }

      if (user.status !== "active") {
        throw new Error("Kullanici pasif durumda.");
      }

      user.lastLoginAt = new Date().toISOString();
      saveDemoDatabase(db);
      enableMockMode();
      setCurrentDemoUser(user._id);
      const { password: hidden, ...safeUser } = user;

      return toResponse({
        user: safeUser,
        token: "mock-demo-token",
      }, "Demo oturumu baslatildi.");
    },
    me: () => {
      const user = getCurrentDemoUser();
      if (!user) {
        throw new Error("Oturum bulunamadi.");
      }
      return toResponse(user, "Demo profil bilgileri getirildi.");
    },
    logout: () => {
      clearCurrentDemoUser();
      disableMockMode();
    },
  },
  dashboard: {
    getOverview: () => {
      const db = loadDemoDatabase();
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      const months = lastMonths(6);

      const totalIncome = db.incomes.reduce((sum, item) => sum + item.amount, 0);
      const totalExpense = db.expenses.reduce((sum, item) => sum + item.amount, 0);
      const pendingReceivables = db.invoices.reduce((sum, item) => sum + item.remainingAmount, 0);
      const collectedPayments = db.incomes
        .filter((item) => new Date(item.date).getTime() >= currentMonthStart)
        .reduce((sum, item) => sum + item.amount, 0);
      const monthlyTrend = months.map(({ month, start, end }) => ({
        month,
        income: db.incomes
          .filter((item) => {
            const date = new Date(item.date).getTime();
            return date >= start && date <= end;
          })
          .reduce((sum, item) => sum + item.amount, 0),
        expense: db.expenses
          .filter((item) => {
            const date = new Date(item.date).getTime();
            return date >= start && date <= end;
          })
          .reduce((sum, item) => sum + item.amount, 0),
      }));
      const expenseCategoryBreakdown = Object.entries(
        db.expenses.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + item.amount;
          return acc;
        }, {})
      )
        .map(([category, value]) => ({ category, value }))
        .sort((a, b) => b.value - a.value);

      const overdueInvoicesCount = db.invoices.filter(
        (item) => item.status !== "paid" && new Date(item.dueDate).getTime() < now.getTime()
      ).length;
      const pendingExpensesCount = db.expenses.filter((item) => item.status !== "paid").length;

      const alerts = [
        overdueInvoicesCount
          ? {
              type: "critical",
              title: "Vadesi gecmis faturalar mevcut",
              description: `${overdueInvoicesCount} fatura icin tahsilat takibi gerekiyor.`,
            }
          : null,
        pendingExpensesCount
          ? {
              type: "warning",
              title: "Bekleyen giderler var",
              description: `${pendingExpensesCount} gider kaydi odeme planinda bekliyor.`,
            }
          : null,
        db.cashAccounts.some((item) => item.balance < 5000)
          ? {
              type: "info",
              title: "Dusuk kasa bakiyesi",
              description: "En az bir kasa hesabinda bakiye kritik esige yaklasti.",
            }
          : null,
      ].filter(Boolean);

      return toResponse({
        summary: {
          totalIncome,
          totalExpense,
          netBalance: totalIncome - totalExpense,
          collectedPayments,
          pendingReceivables,
          activeCurrents: db.currents.filter((item) => item.status === "active").length,
        },
        charts: {
          monthlyTrend,
          expenseCategoryBreakdown,
        },
        latestTransactions: sortDescByDate(db.transactions).slice(0, 8).map((item) => attachRelations(db, item)),
        alerts,
        liquidity: {
          cashBalance: db.cashAccounts.reduce((sum, item) => sum + item.balance, 0),
          bankBalance: db.bankAccounts.reduce((sum, item) => sum + item.balance, 0),
          cashAccounts: db.cashAccounts,
          bankAccounts: db.bankAccounts,
        },
      }, "Dashboard verileri demo modunda getirildi.");
    },
  },
};

const filterList = (list, { search, startDate, endDate, category, status, type, currentAccount }) =>
  list.filter((item) => {
    if (category && item.category !== category) {
      return false;
    }
    if (status && item.status !== status) {
      return false;
    }
    if (type && item.type !== type) {
      return false;
    }
    if (currentAccount && item.currentAccount !== currentAccount) {
      return false;
    }
    if ((startDate || endDate) && !inDateRange(item.date || item.issueDate || item.createdAt, startDate, endDate)) {
      return false;
    }
    if (search) {
      const haystack = JSON.stringify(item).toLowerCase();
      if (!haystack.includes(search.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

const getCurrentStatement = (db, currentId, query = {}) => {
  const current = db.currents.find((item) => item._id === currentId);
  const invoices = filterList(db.invoices.filter((item) => item.currentAccount === currentId), query);
  const incomes = filterList(db.incomes.filter((item) => item.currentAccount === currentId), query);
  const expenses = filterList(db.expenses.filter((item) => item.currentAccount === currentId), query);
  const payments = filterList(
    db.transactions.filter((item) => item.currentAccount === currentId && item.type === "invoice_payment"),
    query
  );

  const movements = [
    ...invoices.map((invoice) => ({
      id: invoice._id,
      module: "invoice",
      title: `Fatura ${invoice.invoiceNumber}`,
      direction: "debit",
      amount: invoice.grandTotal,
      date: invoice.issueDate,
      status: invoice.status,
    })),
    ...payments.map((payment) => ({
      id: payment._id,
      module: "invoice_payment",
      title: payment.note,
      direction: "credit",
      amount: payment.amount,
      date: payment.date,
      status: "completed",
    })),
    ...incomes.map((income) => ({
      id: income._id,
      module: "income",
      title: income.title,
      direction: "credit",
      amount: income.amount,
      date: income.date,
      status: "completed",
    })),
    ...expenses.map((expense) => ({
      id: expense._id,
      module: "expense",
      title: expense.title,
      direction: "debit",
      amount: expense.amount,
      date: expense.date,
      status: expense.status,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    current,
    summary: {
      balance: current.balance,
      invoiceTotal: invoices.reduce((sum, item) => sum + item.grandTotal, 0),
      outstandingTotal: invoices.reduce((sum, item) => sum + item.remainingAmount, 0),
      incomeCollections: incomes.reduce((sum, item) => sum + item.amount, 0),
      expenseTotal: expenses.reduce((sum, item) => sum + item.amount, 0),
    },
    movements,
  };
};

const getAccountMovements = (db, accountModel, accountId, query = {}) => {
  const list = accountModel === "CashAccount" ? db.cashAccounts : db.bankAccounts;
  const account = list.find((item) => item._id === accountId);
  const movements = sortDescByDate(
    filterList(
      db.transactions.filter((item) => item.accountModel === accountModel && item.account === accountId),
      query
    )
  ).map((item) => attachRelations(db, item));

  return {
    account,
    movements,
    meta: {
      summary: {
        totalIn: movements.filter((item) => item.direction === "in").reduce((sum, item) => sum + item.amount, 0),
        totalOut: movements.filter((item) => item.direction === "out").reduce((sum, item) => sum + item.amount, 0),
        closingBalance: account.balance,
      },
    },
  };
};

export const mockServices = {
  incomes: {
    list: (params = {}) => {
      const db = loadDemoDatabase();
      const rows = sortDescByDate(filterList(db.incomes, params)).map((item) => attachRelations(db, item));
      const paged = paginate(rows, Number(params.page || 1), Number(params.limit || 50), {
        summary: {
          totalAmount: rows.reduce((sum, item) => sum + item.amount, 0),
        },
      });
      return toResponse(paged.data, networkMessage, paged.meta);
    },
    getById: (id) => {
      const db = loadDemoDatabase();
      return toResponse(attachRelations(db, db.incomes.find((item) => item._id === id)));
    },
    create: (payload) => {
      const db = loadDemoDatabase();
      const user = getCurrentDemoUser();
      const item = withTimestamp(
        {
          _id: createId("inc"),
          ...payload,
          amount: Number(payload.amount),
          currentAccount: payload.currentAccount || "",
          createdBy: user?._id || "usr_accountant",
        },
        null
      );
      db.incomes.push(item);
      db.transactions.push(
        withTimestamp({
          _id: createId("trx"),
          transactionNumber: `TRX-${Date.now()}`,
          type: "income",
          direction: "in",
          amount: item.amount,
          date: item.date,
          paymentMethod: item.paymentMethod,
          accountModel: item.accountModel,
          account: item.account,
          currentAccount: item.currentAccount || "",
          referenceModel: "Income",
          referenceId: item._id,
          note: item.title,
          createdBy: user?._id || "usr_accountant",
        })
      );
      saveDemoDatabase(db);
      return toResponse(attachRelations(db, item), "Gelir kaydi demo modunda olusturuldu.");
    },
    update: (id, payload) => {
      const db = loadDemoDatabase();
      const item = db.incomes.find((entry) => entry._id === id);
      Object.assign(item, withTimestamp({ ...payload, amount: Number(payload.amount) }, item));
      const transaction = db.transactions.find((entry) => entry.referenceModel === "Income" && entry.referenceId === id);
      if (transaction) {
        Object.assign(
          transaction,
          withTimestamp(
            {
              amount: item.amount,
              date: item.date,
              paymentMethod: item.paymentMethod,
              accountModel: item.accountModel,
              account: item.account,
              currentAccount: item.currentAccount || "",
              note: item.title,
            },
            transaction
          )
        );
      }
      saveDemoDatabase(db);
      return toResponse(attachRelations(db, item), "Gelir kaydi demo modunda guncellendi.");
    },
    remove: (id) => {
      const db = loadDemoDatabase();
      db.incomes = db.incomes.filter((item) => item._id !== id);
      db.transactions = db.transactions.filter(
        (item) => !(item.referenceModel === "Income" && item.referenceId === id)
      );
      saveDemoDatabase(db);
      return toResponse(null, "Gelir kaydi demo modunda silindi.");
    },
  },
  expenses: {
    list: (params = {}) => {
      const db = loadDemoDatabase();
      const rows = sortDescByDate(filterList(db.expenses, params)).map((item) => attachRelations(db, item));
      const paged = paginate(rows, Number(params.page || 1), Number(params.limit || 50), {
        summary: {
          totalAmount: rows.reduce((sum, item) => sum + item.amount, 0),
          paidAmount: rows.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.amount, 0),
          pendingAmount: rows.filter((item) => item.status !== "paid").reduce((sum, item) => sum + item.amount, 0),
        },
      });
      return toResponse(paged.data, networkMessage, paged.meta);
    },
    getById: (id) => {
      const db = loadDemoDatabase();
      return toResponse(attachRelations(db, db.expenses.find((item) => item._id === id)));
    },
    create: (payload) => {
      const db = loadDemoDatabase();
      const user = getCurrentDemoUser();
      const item = withTimestamp(
        {
          _id: createId("exp"),
          ...payload,
          amount: Number(payload.amount),
          currentAccount: payload.currentAccount || "",
          dueDate: payload.dueDate || null,
          status: payload.status || "paid",
          accountModel: payload.status === "paid" ? payload.accountModel || null : null,
          account: payload.status === "paid" ? payload.account || null : null,
          createdBy: user?._id || "usr_accountant",
        },
        null
      );
      db.expenses.push(item);
      if (item.status === "paid" && item.accountModel && item.account) {
        db.transactions.push(
          withTimestamp({
            _id: createId("trx"),
            transactionNumber: `TRX-${Date.now()}`,
            type: "expense",
            direction: "out",
            amount: item.amount,
            date: item.date,
            paymentMethod: item.paymentMethod,
            accountModel: item.accountModel,
            account: item.account,
            currentAccount: item.currentAccount || "",
            referenceModel: "Expense",
            referenceId: item._id,
            note: item.title,
            createdBy: user?._id || "usr_accountant",
          })
        );
      }
      saveDemoDatabase(db);
      return toResponse(attachRelations(db, item), "Gider kaydi demo modunda olusturuldu.");
    },
    update: (id, payload) => {
      const db = loadDemoDatabase();
      const item = db.expenses.find((entry) => entry._id === id);
      Object.assign(
        item,
        withTimestamp(
          {
            ...payload,
            amount: payload.amount !== undefined ? Number(payload.amount) : item.amount,
            dueDate: payload.dueDate || null,
            currentAccount: payload.currentAccount || "",
            accountModel: payload.status === "paid" ? payload.accountModel || null : null,
            account: payload.status === "paid" ? payload.account || null : null,
          },
          item
        )
      );
      db.transactions = db.transactions.filter(
        (entry) => !(entry.referenceModel === "Expense" && entry.referenceId === id)
      );
      if (item.status === "paid" && item.accountModel && item.account) {
        db.transactions.push(
          withTimestamp({
            _id: createId("trx"),
            transactionNumber: `TRX-${Date.now()}`,
            type: "expense",
            direction: "out",
            amount: item.amount,
            date: item.date,
            paymentMethod: item.paymentMethod,
            accountModel: item.accountModel,
            account: item.account,
            currentAccount: item.currentAccount || "",
            referenceModel: "Expense",
            referenceId: item._id,
            note: item.title,
            createdBy: item.createdBy,
          })
        );
      }
      saveDemoDatabase(db);
      return toResponse(attachRelations(db, item), "Gider kaydi demo modunda guncellendi.");
    },
    remove: (id) => {
      const db = loadDemoDatabase();
      db.expenses = db.expenses.filter((item) => item._id !== id);
      db.transactions = db.transactions.filter(
        (item) => !(item.referenceModel === "Expense" && item.referenceId === id)
      );
      saveDemoDatabase(db);
      return toResponse(null, "Gider kaydi demo modunda silindi.");
    },
  },
  currents: {
    list: (params = {}) => {
      const db = loadDemoDatabase();
      const rows = sortDescByDate(filterList(db.currents, params), "createdAt");
      const paged = paginate(rows, Number(params.page || 1), Number(params.limit || 50), {
        summary: {
          totalBalance: rows.reduce((sum, item) => sum + item.balance, 0),
          positiveBalanceCount: rows.filter((item) => item.balance > 0).length,
          negativeBalanceCount: rows.filter((item) => item.balance < 0).length,
        },
      });
      return toResponse(paged.data, networkMessage, paged.meta);
    },
    getById: (id) => {
      const db = loadDemoDatabase();
      return toResponse(db.currents.find((item) => item._id === id));
    },
    create: (payload) => {
      const db = loadDemoDatabase();
      const item = withTimestamp({
        _id: createId("cur"),
        ...payload,
        balance: 0,
      });
      db.currents.push(item);
      saveDemoDatabase(db);
      return toResponse(item, "Cari kart demo modunda olusturuldu.");
    },
    update: (id, payload) => {
      const db = loadDemoDatabase();
      const item = db.currents.find((entry) => entry._id === id);
      Object.assign(item, withTimestamp(payload, item));
      saveDemoDatabase(db);
      return toResponse(item, "Cari kart demo modunda guncellendi.");
    },
    getStatement: (id, params = {}) => {
      const db = loadDemoDatabase();
      return toResponse(getCurrentStatement(db, id, params), "Cari ekstre demo modunda getirildi.");
    },
  },
  accounts: {
    listCash: (params = {}) => {
      const db = loadDemoDatabase();
      const rows = sortDescByDate(filterList(db.cashAccounts, params), "createdAt");
      const paged = paginate(rows, Number(params.page || 1), Number(params.limit || 50));
      return toResponse(paged.data, networkMessage, paged.meta);
    },
    createCash: (payload) => {
      const db = loadDemoDatabase();
      if (payload.isDefault) {
        db.cashAccounts.forEach((item) => {
          item.isDefault = false;
        });
      }
      const item = withTimestamp({
        _id: createId("cash"),
        ...payload,
        balance: 0,
        currency: payload.currency || "TRY",
      });
      db.cashAccounts.push(item);
      saveDemoDatabase(db);
      return toResponse(item, "Kasa hesabi demo modunda olusturuldu.");
    },
    updateCash: (id, payload) => {
      const db = loadDemoDatabase();
      if (payload.isDefault) {
        db.cashAccounts.forEach((item) => {
          if (item._id !== id) {
            item.isDefault = false;
          }
        });
      }
      const item = db.cashAccounts.find((entry) => entry._id === id);
      Object.assign(item, withTimestamp(payload, item));
      saveDemoDatabase(db);
      return toResponse(item, "Kasa hesabi demo modunda guncellendi.");
    },
    getCashMovements: (id, params = {}) => {
      const db = loadDemoDatabase();
      const result = getAccountMovements(db, "CashAccount", id, params);
      return toResponse(result.movements, "Kasa hareketleri demo modunda getirildi.", {
        ...result.meta,
        account: result.account,
      });
    },
    listBanks: (params = {}) => {
      const db = loadDemoDatabase();
      const rows = sortDescByDate(filterList(db.bankAccounts, params), "createdAt");
      const paged = paginate(rows, Number(params.page || 1), Number(params.limit || 50));
      return toResponse(paged.data, networkMessage, paged.meta);
    },
    createBank: (payload) => {
      const db = loadDemoDatabase();
      const item = withTimestamp({
        _id: createId("bank"),
        ...payload,
        balance: 0,
        currency: payload.currency || "TRY",
      });
      db.bankAccounts.push(item);
      saveDemoDatabase(db);
      return toResponse(item, "Banka hesabi demo modunda olusturuldu.");
    },
    updateBank: (id, payload) => {
      const db = loadDemoDatabase();
      const item = db.bankAccounts.find((entry) => entry._id === id);
      Object.assign(item, withTimestamp(payload, item));
      saveDemoDatabase(db);
      return toResponse(item, "Banka hesabi demo modunda guncellendi.");
    },
    getBankMovements: (id, params = {}) => {
      const db = loadDemoDatabase();
      const result = getAccountMovements(db, "BankAccount", id, params);
      return toResponse(result.movements, "Banka hareketleri demo modunda getirildi.", {
        ...result.meta,
        account: result.account,
      });
    },
  },
  invoices: {
    list: (params = {}) => {
      const db = loadDemoDatabase();
      const rows = sortDescByDate(filterList(db.invoices, params), "issueDate").map((item) =>
        attachRelations(db, item)
      );
      const paged = paginate(rows, Number(params.page || 1), Number(params.limit || 50), {
        summary: {
          grandTotal: rows.reduce((sum, item) => sum + item.grandTotal, 0),
          remainingAmount: rows.reduce((sum, item) => sum + item.remainingAmount, 0),
          paidAmount: rows.reduce((sum, item) => sum + item.paidAmount, 0),
        },
      });
      return toResponse(paged.data, networkMessage, paged.meta);
    },
    getById: (id) => {
      const db = loadDemoDatabase();
      return toResponse(attachRelations(db, db.invoices.find((item) => item._id === id)));
    },
    create: (payload) => {
      const db = loadDemoDatabase();
      const user = getCurrentDemoUser();
      const totals = calculateInvoiceTotals(payload.items);
      const item = withTimestamp({
        _id: createId("inv"),
        invoiceNumber: payload.invoiceNumber,
        currentAccount: payload.currentAccount,
        issueDate: payload.issueDate,
        dueDate: payload.dueDate,
        status: "pending",
        paidAmount: 0,
        remainingAmount: totals.grandTotal,
        notes: payload.notes || "",
        createdBy: user?._id || "usr_admin",
        ...totals,
      });
      db.invoices.push(item);
      saveDemoDatabase(db);
      return toResponse(attachRelations(db, item), "Fatura demo modunda olusturuldu.");
    },
    update: (id, payload) => {
      const db = loadDemoDatabase();
      const item = db.invoices.find((entry) => entry._id === id);
      const totals = payload.items ? calculateInvoiceTotals(payload.items) : null;
      Object.assign(
        item,
        withTimestamp(
          {
            ...payload,
            ...(totals || {}),
          },
          item
        )
      );
      if (totals) {
        item.remainingAmount = Math.max(item.grandTotal - item.paidAmount, 0);
        item.status = item.remainingAmount === 0 ? "paid" : item.paidAmount > 0 ? "partial" : "pending";
      }
      saveDemoDatabase(db);
      return toResponse(attachRelations(db, item), "Fatura demo modunda guncellendi.");
    },
    recordPayment: (id, payload) => {
      const db = loadDemoDatabase();
      const user = getCurrentDemoUser();
      const invoice = db.invoices.find((item) => item._id === id);
      const amount = Number(payload.amount);
      invoice.paidAmount += amount;
      invoice.remainingAmount = Math.max(invoice.grandTotal - invoice.paidAmount, 0);
      invoice.status =
        invoice.remainingAmount === 0 ? "paid" : invoice.paidAmount > 0 ? "partial" : "pending";
      invoice.updatedAt = new Date().toISOString();
      db.transactions.push(
        withTimestamp({
          _id: createId("trx"),
          transactionNumber: `TRX-${Date.now()}`,
          type: "invoice_payment",
          direction: "in",
          amount,
          date: payload.paymentDate,
          paymentMethod: payload.paymentMethod,
          accountModel: payload.accountModel,
          account: payload.account,
          currentAccount: invoice.currentAccount,
          referenceModel: "Invoice",
          referenceId: id,
          note: payload.note || `Fatura tahsilati ${invoice.invoiceNumber}`,
          createdBy: user?._id || "usr_accountant",
        })
      );
      saveDemoDatabase(db);
      return toResponse(attachRelations(db, invoice), "Tahsilat demo modunda kaydedildi.");
    },
    remove: (id) => {
      const db = loadDemoDatabase();
      db.invoices = db.invoices.filter((item) => item._id !== id);
      db.transactions = db.transactions.filter(
        (item) => !(item.referenceModel === "Invoice" && item.referenceId === id)
      );
      saveDemoDatabase(db);
      return toResponse(null, "Fatura demo modunda silindi.");
    },
  },
  reports: {
    overview: (params = {}) => {
      const db = loadDemoDatabase();
      const incomes = filterList(db.incomes, params);
      const expenses = filterList(db.expenses, params);
      const invoices = filterList(db.invoices, params);
      return toResponse({
        cards: {
          totalIncome: incomes.reduce((sum, item) => sum + item.amount, 0),
          totalExpense: expenses.reduce((sum, item) => sum + item.amount, 0),
          netResult:
            incomes.reduce((sum, item) => sum + item.amount, 0) -
            expenses.reduce((sum, item) => sum + item.amount, 0),
          outstandingReceivables: invoices.reduce((sum, item) => sum + item.remainingAmount, 0),
          totalInvoiced: invoices.reduce((sum, item) => sum + item.grandTotal, 0),
        },
      });
    },
    dailyIncome: (params = {}) => {
      const db = loadDemoDatabase();
      const grouped = filterList(db.incomes, params).reduce((acc, item) => {
        const date = item.date.slice(0, 10);
        acc[date] = acc[date] || { date, total: 0, count: 0 };
        acc[date].total += item.amount;
        acc[date].count += 1;
        return acc;
      }, {});
      return toResponse(Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date)));
    },
    monthlyFinancials: (params = {}) => {
      const db = loadDemoDatabase();
      const rows = {};

      filterList(db.incomes, params).forEach((item) => {
        const month = item.date.slice(0, 7);
        rows[month] = rows[month] || { month, income: 0, expense: 0, net: 0 };
        rows[month].income += item.amount;
      });
      filterList(db.expenses, params).forEach((item) => {
        const month = item.date.slice(0, 7);
        rows[month] = rows[month] || { month, income: 0, expense: 0, net: 0 };
        rows[month].expense += item.amount;
      });

      return toResponse(
        Object.values(rows)
          .sort((a, b) => a.month.localeCompare(b.month))
          .map((row) => ({ ...row, net: row.income - row.expense }))
      );
    },
    expenseCategories: (params = {}) => {
      const db = loadDemoDatabase();
      const grouped = filterList(db.expenses, params).reduce((acc, item) => {
        acc[item.category] = acc[item.category] || { category: item.category, total: 0, count: 0 };
        acc[item.category].total += item.amount;
        acc[item.category].count += 1;
        return acc;
      }, {});
      const total = Object.values(grouped).reduce((sum, item) => sum + item.total, 0);
      return toResponse(
        Object.values(grouped)
          .sort((a, b) => b.total - a.total)
          .map((item) => ({
            ...item,
            percentage: total ? (item.total / total) * 100 : 0,
          }))
      );
    },
    currentStatement: (id, params = {}) => {
      const db = loadDemoDatabase();
      return toResponse(getCurrentStatement(db, id, params));
    },
    cashMovements: (id, params = {}) => {
      const db = loadDemoDatabase();
      return toResponse(getAccountMovements(db, "CashAccount", id, params));
    },
    bankMovements: (id, params = {}) => {
      const db = loadDemoDatabase();
      return toResponse(getAccountMovements(db, "BankAccount", id, params));
    },
  },
  users: {
    list: (params = {}) => {
      const db = loadDemoDatabase();
      const rows = sortDescByDate(filterList(db.users, params), "createdAt").map((item) => {
        const { password, ...safeUser } = item;
        return safeUser;
      });
      const paged = paginate(rows, Number(params.page || 1), Number(params.limit || 50));
      return toResponse(paged.data, networkMessage, paged.meta);
    },
    create: (payload) => {
      const db = loadDemoDatabase();
      const item = withTimestamp({
        _id: createId("usr"),
        ...payload,
        lastLoginAt: null,
      });
      db.users.push(item);
      saveDemoDatabase(db);
      const { password, ...safeUser } = item;
      return toResponse(safeUser, "Kullanici demo modunda olusturuldu.");
    },
    updateStatus: (id, payload) => {
      const db = loadDemoDatabase();
      const item = db.users.find((entry) => entry._id === id);
      item.status = payload.status;
      item.updatedAt = new Date().toISOString();
      saveDemoDatabase(db);
      const { password, ...safeUser } = item;
      return toResponse(safeUser, "Kullanici durumu demo modunda guncellendi.");
    },
  },
  transactions: {
    list: (params = {}) => {
      const db = loadDemoDatabase();
      const rows = sortDescByDate(filterList(db.transactions, params)).map((item) => attachRelations(db, item));
      const paged = paginate(rows, Number(params.page || 1), Number(params.limit || 50), {
        summary: {
          totalIn: rows.filter((item) => item.direction === "in").reduce((sum, item) => sum + item.amount, 0),
          totalOut: rows.filter((item) => item.direction === "out").reduce((sum, item) => sum + item.amount, 0),
        },
      });
      return toResponse(paged.data, networkMessage, paged.meta);
    },
  },
};

