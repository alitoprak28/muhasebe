const STORAGE_KEY = "novaledger_enterprise_db";

const dateOf = (value) => new Date(value).toISOString();

const clone = (value) => JSON.parse(JSON.stringify(value));

const initialEnterpriseDb = {
  products: [
    {
      _id: "prd_1",
      stockCode: "STK-1001",
      barcode: "8690000001001",
      name: "Nova POS Terminali",
      productGroup: "Donanim",
      brand: "Nova",
      unit: "adet",
      vatRate: 20,
      purchasePrice: 5400,
      salePrice: 7900,
      minimumStock: 8,
      maximumStock: 60,
      warehouse: "wh_1",
      isActive: true,
      createdAt: dateOf("2026-01-05"),
      updatedAt: dateOf("2026-04-08"),
    },
    {
      _id: "prd_2",
      stockCode: "STK-1002",
      barcode: "8690000001002",
      name: "E-Fatura Yazici Modulu",
      productGroup: "Cevre Birimi",
      brand: "Nova",
      unit: "adet",
      vatRate: 20,
      purchasePrice: 1900,
      salePrice: 2850,
      minimumStock: 10,
      maximumStock: 80,
      warehouse: "wh_1",
      isActive: true,
      createdAt: dateOf("2026-01-07"),
      updatedAt: dateOf("2026-04-09"),
    },
    {
      _id: "prd_3",
      stockCode: "STK-1003",
      barcode: "8690000001003",
      name: "Depo El Terminali",
      productGroup: "Donanim",
      brand: "HandTech",
      unit: "adet",
      vatRate: 20,
      purchasePrice: 7600,
      salePrice: 10200,
      minimumStock: 5,
      maximumStock: 24,
      warehouse: "wh_2",
      isActive: true,
      createdAt: dateOf("2026-01-15"),
      updatedAt: dateOf("2026-04-10"),
    },
    {
      _id: "prd_4",
      stockCode: "STK-1004",
      barcode: "8690000001004",
      name: "Kurumsal Router Paketi",
      productGroup: "Ag",
      brand: "LinkCore",
      unit: "adet",
      vatRate: 20,
      purchasePrice: 3200,
      salePrice: 4650,
      minimumStock: 6,
      maximumStock: 30,
      warehouse: "wh_2",
      isActive: true,
      createdAt: dateOf("2026-02-02"),
      updatedAt: dateOf("2026-04-06"),
    },
    {
      _id: "prd_5",
      stockCode: "STK-1005",
      barcode: "8690000001005",
      name: "Server Yedekleme Disk Seti",
      productGroup: "Sunucu",
      brand: "StorX",
      unit: "set",
      vatRate: 20,
      purchasePrice: 12800,
      salePrice: 16900,
      minimumStock: 3,
      maximumStock: 12,
      warehouse: "wh_3",
      isActive: true,
      createdAt: dateOf("2026-02-11"),
      updatedAt: dateOf("2026-04-15"),
    },
  ],
  serviceCards: [
    {
      _id: "srv_1",
      serviceCode: "HSV-201",
      name: "Aylik Sistem Bakim Hizmeti",
      description: "Sunucu, ag ve uygulama bakim paketi",
      vatRate: 20,
      incomeAccount: "600.01.001",
      expenseAccount: "770.04.002",
      isActive: true,
      createdAt: dateOf("2026-01-09"),
      updatedAt: dateOf("2026-04-11"),
    },
    {
      _id: "srv_2",
      serviceCode: "HSV-202",
      name: "Kurulum ve Entegrasyon",
      description: "Saha kurulum ve veri migrasyon hizmeti",
      vatRate: 20,
      incomeAccount: "600.01.002",
      expenseAccount: "770.04.005",
      isActive: true,
      createdAt: dateOf("2026-01-12"),
      updatedAt: dateOf("2026-04-11"),
    },
    {
      _id: "srv_3",
      serviceCode: "HSV-203",
      name: "Kullanim Egitimi",
      description: "Kullanici ve operasyon ekibi egitim hizmeti",
      vatRate: 20,
      incomeAccount: "600.01.003",
      expenseAccount: "770.04.006",
      isActive: true,
      createdAt: dateOf("2026-02-04"),
      updatedAt: dateOf("2026-04-11"),
    },
  ],
  warehouses: [
    {
      _id: "wh_1",
      code: "DPO-01",
      name: "Merkez Depo",
      city: "Istanbul",
      manager: "Ahmet Yalcin",
      status: "active",
      capacity: 1200,
      createdAt: dateOf("2026-01-02"),
      updatedAt: dateOf("2026-04-10"),
    },
    {
      _id: "wh_2",
      code: "DPO-02",
      name: "Anadolu Sevkiyat Deposu",
      city: "Kocaeli",
      manager: "Deniz Turan",
      status: "active",
      capacity: 860,
      createdAt: dateOf("2026-01-02"),
      updatedAt: dateOf("2026-04-10"),
    },
    {
      _id: "wh_3",
      code: "DPO-03",
      name: "Yedek Parca Arsivi",
      city: "Istanbul",
      manager: "Berk Aksoy",
      status: "active",
      capacity: 300,
      createdAt: dateOf("2026-01-02"),
      updatedAt: dateOf("2026-04-10"),
    },
  ],
  stocks: [
    {
      _id: "stk_1",
      productId: "prd_1",
      warehouseId: "wh_1",
      quantity: 12,
      reserved: 4,
      minimumStock: 8,
      maximumStock: 60,
      lastMovementDate: dateOf("2026-04-18"),
    },
    {
      _id: "stk_2",
      productId: "prd_2",
      warehouseId: "wh_1",
      quantity: 9,
      reserved: 3,
      minimumStock: 10,
      maximumStock: 80,
      lastMovementDate: dateOf("2026-04-17"),
    },
    {
      _id: "stk_3",
      productId: "prd_3",
      warehouseId: "wh_2",
      quantity: 6,
      reserved: 1,
      minimumStock: 5,
      maximumStock: 24,
      lastMovementDate: dateOf("2026-04-16"),
    },
    {
      _id: "stk_4",
      productId: "prd_4",
      warehouseId: "wh_2",
      quantity: 4,
      reserved: 2,
      minimumStock: 6,
      maximumStock: 30,
      lastMovementDate: dateOf("2026-04-15"),
    },
    {
      _id: "stk_5",
      productId: "prd_5",
      warehouseId: "wh_3",
      quantity: 2,
      reserved: 1,
      minimumStock: 3,
      maximumStock: 12,
      lastMovementDate: dateOf("2026-04-12"),
    },
  ],
  offers: [
    {
      _id: "off_1",
      offerNumber: "TKL-2026-001",
      currentName: "Marmara Teknoloji A.S.",
      type: "sales",
      issueDate: dateOf("2026-04-02"),
      validUntil: dateOf("2026-04-22"),
      items: 3,
      subtotal: 84500,
      discount: 4500,
      vatTotal: 16000,
      grandTotal: 96000,
      status: "sent",
    },
    {
      _id: "off_2",
      offerNumber: "TKL-2026-002",
      currentName: "Verde Perakende Ltd.",
      type: "sales",
      issueDate: dateOf("2026-04-07"),
      validUntil: dateOf("2026-04-25"),
      items: 5,
      subtotal: 112000,
      discount: 7000,
      vatTotal: 21000,
      grandTotal: 126000,
      status: "negotiation",
    },
    {
      _id: "off_3",
      offerNumber: "TKL-2026-003",
      currentName: "Bulut Yazilim Hizmetleri",
      type: "purchase",
      issueDate: dateOf("2026-04-10"),
      validUntil: dateOf("2026-04-28"),
      items: 2,
      subtotal: 38600,
      discount: 1200,
      vatTotal: 7480,
      grandTotal: 44880,
      status: "approved",
    },
  ],
  orders: [
    {
      _id: "ord_1",
      orderNumber: "SPS-2026-001",
      type: "sales",
      currentName: "Marmara Teknoloji A.S.",
      issueDate: dateOf("2026-04-05"),
      deliveryDate: dateOf("2026-04-24"),
      total: 96000,
      status: "partial_dispatch",
      sourceOffer: "TKL-2026-001",
    },
    {
      _id: "ord_2",
      orderNumber: "SPS-2026-002",
      type: "sales",
      currentName: "Verde Perakende Ltd.",
      issueDate: dateOf("2026-04-09"),
      deliveryDate: dateOf("2026-04-27"),
      total: 126000,
      status: "approved",
      sourceOffer: "TKL-2026-002",
    },
    {
      _id: "ord_3",
      orderNumber: "ALS-2026-001",
      type: "purchase",
      currentName: "Bulut Yazilim Hizmetleri",
      issueDate: dateOf("2026-04-11"),
      deliveryDate: dateOf("2026-04-29"),
      total: 44880,
      status: "waiting_dispatch",
      sourceOffer: "TKL-2026-003",
    },
  ],
  dispatchNotes: [
    {
      _id: "dsp_1",
      noteNumber: "IRS-2026-001",
      type: "sales_dispatch",
      currentName: "Marmara Teknoloji A.S.",
      dispatchDate: dateOf("2026-04-12"),
      deliveredTo: "Onur Eren",
      vehiclePlate: "34 NLD 41",
      warehouseName: "Merkez Depo",
      sourceOrder: "SPS-2026-001",
      status: "partial",
    },
    {
      _id: "dsp_2",
      noteNumber: "IRS-2026-002",
      type: "purchase_dispatch",
      currentName: "Bulut Yazilim Hizmetleri",
      dispatchDate: dateOf("2026-04-16"),
      deliveredTo: "Depo Kabul",
      vehiclePlate: "41 KCL 08",
      warehouseName: "Anadolu Sevkiyat Deposu",
      sourceOrder: "ALS-2026-001",
      status: "received",
    },
    {
      _id: "dsp_3",
      noteNumber: "IRS-2026-003",
      type: "shipment",
      currentName: "Verde Perakende Ltd.",
      dispatchDate: dateOf("2026-04-20"),
      deliveredTo: "Magaza Operasyon",
      vehiclePlate: "34 TCC 22",
      warehouseName: "Merkez Depo",
      sourceOrder: "SPS-2026-002",
      status: "waiting_invoice",
    },
  ],
  collections: [
    {
      _id: "col_1",
      collectionNumber: "TSL-2026-001",
      currentName: "Marmara Teknoloji A.S.",
      collectionDate: dateOf("2026-04-08"),
      amount: 42000,
      type: "invoice_based",
      paymentMethod: "bank_transfer",
      invoiceNumber: "FTR-2026-001",
      status: "partial",
    },
    {
      _id: "col_2",
      collectionNumber: "TSL-2026-002",
      currentName: "Verde Perakende Ltd.",
      collectionDate: dateOf("2026-04-15"),
      amount: 22800,
      type: "current_account",
      paymentMethod: "credit_card",
      invoiceNumber: "",
      status: "completed",
    },
    {
      _id: "col_3",
      collectionNumber: "TSL-2026-003",
      currentName: "Anka Danismanlik",
      collectionDate: dateOf("2026-04-19"),
      amount: 43200,
      type: "invoice_based",
      paymentMethod: "bank_transfer",
      invoiceNumber: "FTR-2026-003",
      status: "completed",
    },
  ],
  payments: [
    {
      _id: "pay_1",
      paymentNumber: "ODM-2026-001",
      payeeName: "Bulut Yazilim Hizmetleri",
      paymentDate: dateOf("2026-04-05"),
      amount: 12400,
      category: "supplier",
      paymentMethod: "bank_transfer",
      status: "completed",
    },
    {
      _id: "pay_2",
      paymentNumber: "ODM-2026-002",
      payeeName: "Personel Maas Dagitimi",
      paymentDate: dateOf("2026-04-10"),
      amount: 54000,
      category: "personnel",
      paymentMethod: "bank_transfer",
      status: "completed",
    },
    {
      _id: "pay_3",
      paymentNumber: "ODM-2026-003",
      payeeName: "Gelir Idaresi Baskanligi",
      paymentDate: dateOf("2026-04-23"),
      amount: 18600,
      category: "tax",
      paymentMethod: "eft",
      status: "scheduled",
    },
  ],
  checks: [
    {
      _id: "chk_1",
      documentNumber: "CHK-2026-001",
      type: "received_check",
      counterparty: "Marmara Teknoloji A.S.",
      issueDate: dateOf("2026-04-03"),
      dueDate: dateOf("2026-04-24"),
      amount: 36000,
      bankName: "Akbank",
      status: "portfolio",
    },
    {
      _id: "chk_2",
      documentNumber: "SNT-2026-001",
      type: "received_note",
      counterparty: "Verde Perakende Ltd.",
      issueDate: dateOf("2026-04-06"),
      dueDate: dateOf("2026-05-06"),
      amount: 48000,
      bankName: "Is Bankasi",
      status: "waiting",
    },
    {
      _id: "chk_3",
      documentNumber: "CHK-2026-002",
      type: "issued_check",
      counterparty: "Bulut Yazilim Hizmetleri",
      issueDate: dateOf("2026-04-09"),
      dueDate: dateOf("2026-04-26"),
      amount: 13800,
      bankName: "Akbank",
      status: "approaching_due",
    },
  ],
  accountingAccounts: [
    { _id: "acc_1", code: "100", name: "Kasa", type: "asset", level: 1, balance: 43500 },
    { _id: "acc_2", code: "102", name: "Bankalar", type: "asset", level: 1, balance: 128900 },
    { _id: "acc_3", code: "120", name: "Alicilar", type: "asset", level: 1, balance: 69600 },
    { _id: "acc_4", code: "320", name: "Saticilar", type: "liability", level: 1, balance: 13800 },
    { _id: "acc_5", code: "600", name: "Yurtici Satislar", type: "income", level: 1, balance: 228550 },
    { _id: "acc_6", code: "770", name: "Genel Yonetim Giderleri", type: "expense", level: 1, balance: 126200 },
    { _id: "acc_7", code: "391", name: "Hesaplanan KDV", type: "liability", level: 1, balance: 44280 },
    { _id: "acc_8", code: "191", name: "Indirilecek KDV", type: "asset", level: 1, balance: 21740 },
  ],
  journalEntries: [
    {
      _id: "jrn_1",
      voucherNo: "MHS-2026-001",
      voucherType: "mahsup",
      entryDate: dateOf("2026-04-08"),
      description: "Nisan hizmet satis faturasi muhasebe kaydi",
      debit: 86400,
      credit: 86400,
      sourceDocument: "FTR-2026-001",
      status: "posted",
    },
    {
      _id: "jrn_2",
      voucherNo: "THS-2026-001",
      voucherType: "tahsil",
      entryDate: dateOf("2026-04-15"),
      description: "Verde Perakende tahsilat kaydi",
      debit: 22800,
      credit: 22800,
      sourceDocument: "TSL-2026-002",
      status: "posted",
    },
    {
      _id: "jrn_3",
      voucherNo: "TED-2026-001",
      voucherType: "tediye",
      entryDate: dateOf("2026-04-10"),
      description: "Personel maas odeme kaydi",
      debit: 54000,
      credit: 54000,
      sourceDocument: "ODM-2026-002",
      status: "posted",
    },
  ],
  documents: [
    {
      _id: "doc_1",
      name: "FTR-2026-001.pdf",
      type: "invoice_pdf",
      relatedModule: "invoices",
      owner: "Selin Arslan",
      uploadedAt: dateOf("2026-04-08"),
      status: "archived",
    },
    {
      _id: "doc_2",
      name: "IRS-2026-001.pdf",
      type: "dispatch_pdf",
      relatedModule: "dispatch",
      owner: "Emre Demir",
      uploadedAt: dateOf("2026-04-12"),
      status: "approved",
    },
    {
      _id: "doc_3",
      name: "bulut-odeme-dekontu.pdf",
      type: "payment_receipt",
      relatedModule: "payments",
      owner: "Ayse Kaya",
      uploadedAt: dateOf("2026-04-17"),
      status: "review",
    },
  ],
  notifications: [
    {
      _id: "ntf_1",
      title: "Vadesi gelen musteri ceki",
      description: "Marmara Teknoloji cekinin vadesine 3 gun kaldi.",
      severity: "warning",
      createdAt: dateOf("2026-04-21"),
      read: false,
    },
    {
      _id: "ntf_2",
      title: "Kritik stok seviyesi",
      description: "Kurumsal Router Paketi minimum stok seviyesinin altina indi.",
      severity: "critical",
      createdAt: dateOf("2026-04-21"),
      read: false,
    },
    {
      _id: "ntf_3",
      title: "Belge onayi bekliyor",
      description: "Odeme dekontu icin belge dogrulamasi gerekiyor.",
      severity: "info",
      createdAt: dateOf("2026-04-20"),
      read: true,
    },
  ],
  activityLogs: [
    {
      _id: "log_1",
      actor: "Selin Arslan",
      module: "invoices",
      action: "create",
      entityLabel: "FTR-2026-003",
      createdAt: dateOf("2026-04-17T10:42:00"),
      summary: "Satis faturasi olusturuldu",
    },
    {
      _id: "log_2",
      actor: "Emre Demir",
      module: "collections",
      action: "update",
      entityLabel: "TSL-2026-002",
      createdAt: dateOf("2026-04-19T11:10:00"),
      summary: "Tahsilat tamamlandi olarak guncellendi",
    },
    {
      _id: "log_3",
      actor: "Ayse Kaya",
      module: "documents",
      action: "upload",
      entityLabel: "bulut-odeme-dekontu.pdf",
      createdAt: dateOf("2026-04-20T14:05:00"),
      summary: "Odeme dekontu yuklendi",
    },
  ],
  calendarEvents: [
    {
      _id: "cal_1",
      title: "Marmara Teknoloji cek vadesi",
      date: dateOf("2026-04-24"),
      type: "collection_due",
      owner: "Tahsilat Ekibi",
      status: "upcoming",
    },
    {
      _id: "cal_2",
      title: "KDV odeme son gunu",
      date: dateOf("2026-04-26"),
      type: "tax",
      owner: "Muhasebe",
      status: "upcoming",
    },
    {
      _id: "cal_3",
      title: "Bulut Yazilim odeme vadesi",
      date: dateOf("2026-04-25"),
      type: "payment_due",
      owner: "Finans",
      status: "upcoming",
    },
  ],
  settings: {
    company: {
      title: "NovaLedger Teknoloji ve Danismanlik A.S.",
      taxOffice: "Maslak",
      taxNumber: "1234567890",
      email: "info@novaledger.com",
      phone: "+90 212 000 00 00",
      address: "Maslak Mah. Ahi Evran Cad. No:12 Sariyer / Istanbul",
      iban: "TR880006200119000006123456",
    },
    documents: {
      defaultCurrency: "TRY",
      defaultVatRate: 20,
      invoiceSeries: "FTR",
      dispatchSeries: "IRS",
      offerSeries: "TKL",
    },
    finance: {
      defaultCashAccount: "Merkez Kasa",
      defaultBankAccount: "Akbank / NovaFin Ana Hesap",
      exchangeSource: "TCMB",
      chartOfAccountProfile: "Ticari Isletme Standart Set",
    },
  },
};

const ensureDb = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEnterpriseDb));
  }

  return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

const saveDb = (db) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  return db;
};

const recordConfigs = {
  products: { prefix: "prd", module: "catalog", labelKey: "stockCode", summary: "Urun karti olusturuldu" },
  serviceCards: { prefix: "srv", module: "catalog", labelKey: "serviceCode", summary: "Hizmet karti olusturuldu" },
  warehouses: { prefix: "wh", module: "inventory", labelKey: "code", summary: "Depo karti olusturuldu" },
  stocks: { prefix: "stk", module: "inventory", labelKey: "productId", summary: "Stok pozisyonu olusturuldu" },
  offers: { prefix: "off", module: "offers", labelKey: "offerNumber", summary: "Teklif olusturuldu" },
  orders: { prefix: "ord", module: "orders", labelKey: "orderNumber", summary: "Siparis olusturuldu" },
  dispatchNotes: { prefix: "dsp", module: "dispatch", labelKey: "noteNumber", summary: "Irsaliye olusturuldu" },
  collections: { prefix: "col", module: "collections", labelKey: "collectionNumber", summary: "Tahsilat kaydi olusturuldu" },
  payments: { prefix: "pay", module: "payments", labelKey: "paymentNumber", summary: "Odeme kaydi olusturuldu" },
  checks: { prefix: "chk", module: "checks", labelKey: "documentNumber", summary: "Cek / senet kaydi olusturuldu" },
  accountingAccounts: { prefix: "acc", module: "accounting", labelKey: "code", summary: "Muhasebe hesabi olusturuldu" },
  journalEntries: { prefix: "jrn", module: "accounting", labelKey: "voucherNo", summary: "Muhasebe fisi olusturuldu" },
  documents: { prefix: "doc", module: "documents", labelKey: "name", summary: "Dokuman kaydi olusturuldu" },
  notifications: { prefix: "ntf", module: "notifications", labelKey: "title", summary: "Bildirim olusturuldu" },
  calendarEvents: { prefix: "cal", module: "calendar", labelKey: "title", summary: "Takvim kaydi olusturuldu" },
};

const nextId = (rows, prefix) => {
  const max = rows.reduce((highest, item) => {
    const raw = String(item._id || "").split("_")[1];
    const value = Number(raw);
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0);

  return `${prefix}_${max + 1}`;
};

const normalizeDate = (value) => (value ? dateOf(value) : dateOf(new Date()));

const appendActivityLog = (db, { module, entityLabel, summary, actor = "Demo Operator" }) => {
  db.activityLogs.unshift({
    _id: nextId(db.activityLogs, "log"),
    actor,
    module,
    action: "create",
    entityLabel,
    createdAt: dateOf(new Date()),
    summary,
  });
};

const createRecord = (collectionName, payload) => {
  const db = ensureDb();
  const config = recordConfigs[collectionName];
  const now = dateOf(new Date());
  const record = {
    _id: nextId(db[collectionName], config.prefix),
    ...payload,
    createdAt: payload.createdAt || now,
    updatedAt: payload.updatedAt || now,
  };

  db[collectionName].unshift(record);
  appendActivityLog(db, {
    module: config.module,
    entityLabel: record[config.labelKey] || record._id,
    summary: config.summary,
  });
  saveDb(db);

  return clone(record);
};

const filterRows = (rows, params = {}, dateField = "createdAt") =>
  rows.filter((row) => {
    if (params.search) {
      const haystack = JSON.stringify(row).toLowerCase();
      if (!haystack.includes(params.search.toLowerCase())) {
        return false;
      }
    }

    if (params.status && row.status !== params.status) {
      return false;
    }

    if (params.type && row.type !== params.type) {
      return false;
    }

    if (params.startDate || params.endDate) {
      const value = row[dateField] || row.createdAt;
      const time = new Date(value).getTime();
      if (params.startDate && time < new Date(params.startDate).getTime()) {
        return false;
      }
      if (params.endDate) {
        const end = new Date(params.endDate);
        end.setHours(23, 59, 59, 999);
        if (time > end.getTime()) {
          return false;
        }
      }
    }

    return true;
  });

const paginate = (rows, limit = 50) => ({
  data: rows.slice(0, limit),
  meta: {
    page: 1,
    limit,
    total: rows.length,
    totalPages: 1,
  },
});

const byDesc = (field) => (left, right) => new Date(right[field]) - new Date(left[field]);

const enrichStockRows = (db) =>
  db.stocks.map((stock) => {
    const product = db.products.find((item) => item._id === stock.productId);
    const warehouse = db.warehouses.find((item) => item._id === stock.warehouseId);

    return {
      ...stock,
      productName: product?.name,
      stockCode: product?.stockCode,
      warehouseName: warehouse?.name,
      available: stock.quantity - stock.reserved,
      status: stock.quantity <= stock.minimumStock ? "critical" : "healthy",
    };
  });

export const enterpriseService = {
  getCatalogOverview: () => {
    const db = ensureDb();
    return {
      products: clone(db.products).sort(byDesc("updatedAt")),
      services: clone(db.serviceCards).sort(byDesc("updatedAt")),
      warehouses: clone(db.warehouses).sort(byDesc("updatedAt")),
      metrics: {
        activeProducts: db.products.filter((item) => item.isActive).length,
        activeServices: db.serviceCards.filter((item) => item.isActive).length,
        averageProductMargin:
          Math.round(
            (db.products.reduce(
              (sum, item) => sum + ((item.salePrice - item.purchasePrice) / item.salePrice) * 100,
              0
            ) /
              db.products.length) *
              10
          ) / 10,
      },
    };
  },
  getInventoryOverview: () => {
    const db = ensureDb();
    const rows = enrichStockRows(db);

    return {
      products: clone(db.products).sort(byDesc("updatedAt")),
      warehouses: clone(db.warehouses).sort(byDesc("updatedAt")),
      stocks: rows.sort(byDesc("lastMovementDate")),
      metrics: {
        warehouseCount: db.warehouses.length,
        totalQuantity: rows.reduce((sum, item) => sum + item.quantity, 0),
        reservedQuantity: rows.reduce((sum, item) => sum + item.reserved, 0),
        criticalItems: rows.filter((item) => item.status === "critical").length,
      },
    };
  },
  listOffers: (params = {}) => {
    const db = ensureDb();
    const rows = filterRows(db.offers, params, "issueDate").sort(byDesc("issueDate"));
    return { ...paginate(rows), summary: {
      totalAmount: rows.reduce((sum, item) => sum + item.grandTotal, 0),
      sent: rows.filter((item) => item.status === "sent").length,
      approved: rows.filter((item) => item.status === "approved").length,
    } };
  },
  listOrders: (params = {}) => {
    const db = ensureDb();
    const rows = filterRows(db.orders, params, "issueDate").sort(byDesc("issueDate"));
    return { ...paginate(rows), summary: {
      totalAmount: rows.reduce((sum, item) => sum + item.total, 0),
      salesCount: rows.filter((item) => item.type === "sales").length,
      purchaseCount: rows.filter((item) => item.type === "purchase").length,
    } };
  },
  listDispatchNotes: (params = {}) => {
    const db = ensureDb();
    const rows = filterRows(db.dispatchNotes, params, "dispatchDate").sort(byDesc("dispatchDate"));
    return { ...paginate(rows), summary: {
      total: rows.length,
      partialCount: rows.filter((item) => item.status === "partial").length,
      waitingInvoice: rows.filter((item) => item.status === "waiting_invoice").length,
    } };
  },
  listCollections: (params = {}) => {
    const db = ensureDb();
    const rows = filterRows(db.collections, params, "collectionDate").sort(byDesc("collectionDate"));
    return { ...paginate(rows), summary: {
      totalAmount: rows.reduce((sum, item) => sum + item.amount, 0),
      completedAmount: rows.filter((item) => item.status === "completed").reduce((sum, item) => sum + item.amount, 0),
      partialCount: rows.filter((item) => item.status === "partial").length,
    } };
  },
  listPayments: (params = {}) => {
    const db = ensureDb();
    const rows = filterRows(db.payments, params, "paymentDate").sort(byDesc("paymentDate"));
    return { ...paginate(rows), summary: {
      totalAmount: rows.reduce((sum, item) => sum + item.amount, 0),
      scheduledAmount: rows.filter((item) => item.status === "scheduled").reduce((sum, item) => sum + item.amount, 0),
      completedAmount: rows.filter((item) => item.status === "completed").reduce((sum, item) => sum + item.amount, 0),
    } };
  },
  listChecks: (params = {}) => {
    const db = ensureDb();
    const rows = filterRows(db.checks, params, "dueDate").sort(byDesc("dueDate"));
    return { ...paginate(rows), summary: {
      portfolioAmount: rows.reduce((sum, item) => sum + item.amount, 0),
      approachingDue: rows.filter((item) => item.status === "approaching_due").length,
      receivedCount: rows.filter((item) => item.type.startsWith("received")).length,
    } };
  },
  getAccountingOverview: () => {
    const db = ensureDb();
    return {
      accounts: clone(db.accountingAccounts),
      journalEntries: clone(db.journalEntries).sort(byDesc("entryDate")),
      metrics: {
        totalDebit: db.journalEntries.reduce((sum, item) => sum + item.debit, 0),
        totalCredit: db.journalEntries.reduce((sum, item) => sum + item.credit, 0),
        accountCount: db.accountingAccounts.length,
      },
    };
  },
  listDocuments: () => {
    const db = ensureDb();
    const rows = clone(db.documents).sort(byDesc("uploadedAt"));
    return {
      ...paginate(rows),
      summary: {
        total: rows.length,
        reviewCount: rows.filter((item) => item.status === "review").length,
        archivedCount: rows.filter((item) => item.status === "archived").length,
      },
    };
  },
  listNotifications: () => {
    const db = ensureDb();
    const rows = clone(db.notifications).sort(byDesc("createdAt"));
    return {
      ...paginate(rows),
      summary: {
        unreadCount: rows.filter((item) => !item.read).length,
        criticalCount: rows.filter((item) => item.severity === "critical").length,
        warningCount: rows.filter((item) => item.severity === "warning").length,
      },
    };
  },
  listActivityLogs: () => {
    const db = ensureDb();
    const rows = clone(db.activityLogs).sort(byDesc("createdAt"));
    return {
      ...paginate(rows),
      summary: {
        total: rows.length,
        createCount: rows.filter((item) => item.action === "create").length,
        updateCount: rows.filter((item) => item.action === "update").length,
      },
    };
  },
  listCalendarEvents: () => {
    const db = ensureDb();
    const rows = clone(db.calendarEvents).sort((a, b) => new Date(a.date) - new Date(b.date));
    return {
      ...paginate(rows),
      summary: {
        total: rows.length,
        upcoming: rows.filter((item) => item.status === "upcoming").length,
        taxEvents: rows.filter((item) => item.type === "tax").length,
      },
    };
  },
  createProduct: (payload) =>
    createRecord("products", {
      ...payload,
      vatRate: Number(payload.vatRate || 0),
      purchasePrice: Number(payload.purchasePrice || 0),
      salePrice: Number(payload.salePrice || 0),
      minimumStock: Number(payload.minimumStock || 0),
      maximumStock: Number(payload.maximumStock || 0),
      isActive: payload.isActive ?? true,
    }),
  createServiceCard: (payload) =>
    createRecord("serviceCards", {
      ...payload,
      vatRate: Number(payload.vatRate || 0),
      isActive: payload.isActive ?? true,
    }),
  createWarehouse: (payload) =>
    createRecord("warehouses", {
      ...payload,
      capacity: Number(payload.capacity || 0),
      status: payload.status || "active",
    }),
  createStock: (payload) =>
    createRecord("stocks", {
      ...payload,
      quantity: Number(payload.quantity || 0),
      reserved: Number(payload.reserved || 0),
      minimumStock: Number(payload.minimumStock || 0),
      maximumStock: Number(payload.maximumStock || 0),
      lastMovementDate: normalizeDate(payload.lastMovementDate),
    }),
  createOffer: (payload) =>
    createRecord("offers", {
      ...payload,
      issueDate: normalizeDate(payload.issueDate),
      validUntil: normalizeDate(payload.validUntil),
      items: Number(payload.items || 0),
      subtotal: Number(payload.subtotal || 0),
      discount: Number(payload.discount || 0),
      vatTotal: Number(payload.vatTotal || 0),
      grandTotal: Number(payload.grandTotal || 0),
    }),
  createOrder: (payload) =>
    createRecord("orders", {
      ...payload,
      issueDate: normalizeDate(payload.issueDate),
      deliveryDate: normalizeDate(payload.deliveryDate),
      total: Number(payload.total || 0),
    }),
  createDispatchNote: (payload) =>
    createRecord("dispatchNotes", {
      ...payload,
      dispatchDate: normalizeDate(payload.dispatchDate),
    }),
  createCollection: (payload) =>
    createRecord("collections", {
      ...payload,
      collectionDate: normalizeDate(payload.collectionDate),
      amount: Number(payload.amount || 0),
    }),
  createPayment: (payload) =>
    createRecord("payments", {
      ...payload,
      paymentDate: normalizeDate(payload.paymentDate),
      amount: Number(payload.amount || 0),
    }),
  createCheck: (payload) =>
    createRecord("checks", {
      ...payload,
      issueDate: normalizeDate(payload.issueDate),
      dueDate: normalizeDate(payload.dueDate),
      amount: Number(payload.amount || 0),
    }),
  createAccountingAccount: (payload) =>
    createRecord("accountingAccounts", {
      ...payload,
      level: Number(payload.level || 1),
      balance: Number(payload.balance || 0),
    }),
  createJournalEntry: (payload) =>
    createRecord("journalEntries", {
      ...payload,
      entryDate: normalizeDate(payload.entryDate),
      debit: Number(payload.debit || 0),
      credit: Number(payload.credit || 0),
    }),
  createDocument: (payload) =>
    createRecord("documents", {
      ...payload,
      uploadedAt: normalizeDate(payload.uploadedAt),
    }),
  createNotification: (payload) =>
    createRecord("notifications", {
      ...payload,
      createdAt: normalizeDate(payload.createdAt),
      read: payload.read ?? false,
    }),
  createCalendarEvent: (payload) =>
    createRecord("calendarEvents", {
      ...payload,
      date: normalizeDate(payload.date),
    }),
  getSettings: () => clone(ensureDb().settings),
  updateSettings: (payload) => {
    const db = ensureDb();
    db.settings = {
      ...db.settings,
      ...payload,
    };
    saveDb(db);
    return clone(db.settings);
  },
  getExecutiveWidgets: () => {
    const db = ensureDb();
    const stockRows = enrichStockRows(db);
    return {
      criticalStocks: stockRows.filter((item) => item.status === "critical"),
      openOffers: db.offers.filter((item) => ["sent", "negotiation"].includes(item.status)).length,
      openOrders: db.orders.filter((item) => !["completed", "cancelled"].includes(item.status)).length,
      waitingDocuments: db.documents.filter((item) => item.status === "review").length,
    };
  },
};
