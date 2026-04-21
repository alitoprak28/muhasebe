# NovaLedger | Muhasebe Yonetim Sistemi

Kurumsal his veren, moduler, gercek dunyaya yakin is mantigi uzerine kurulmus bir muhasebe yonetim sistemi. Proje; gelir, gider, cari hesap, kasa, banka, stok, teklif, siparis, irsaliye, tahsilat, odeme, genel muhasebe, belge, bildirim ve raporlama akislarini tek panelde toplar.

## A. Proje Analizi

### Hedef
Kucuk ve orta olcekli isletmelerin temel finans operasyonlarini tek panelden, profesyonel SaaS kalitesinde yonetebilmesi.

### Problem Alanlari
- Daginik gelir ve gider takibi
- Cari hesap ve tahsilat akislarinin kopuk ilerlemesi
- Kasa ve banka hesaplarinin merkezi gorunurlukten yoksun olmasi
- Fatura durumlarinin ve raporlarin operasyonel karar icin yetersiz kalmasi

### Cozum Yaklasimi
- Rol bazli erisim modeli
- Is mantigini transaction omurgasi ile normalize eden backend
- Dashboard ve raporlar odakli premium arayuz
- Ticari akis modulleri: katalog, stok, teklif, siparis, irsaliye
- Finans ve denetim modulleri: tahsilat, odeme, cek/senet, genel muhasebe, belge, log, bildirim, takvim
- Moduler domain ayirimi: `auth`, `users`, `incomes`, `expenses`, `currents`, `accounts`, `invoices`, `transactions`, `reports`, `enterprise`

## B. Teknik Mimari Ozeti

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form + Zod
- Recharts

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT tabanli auth
- Merkezi error handling
- Validation middleware
- Service/Controller/Route ayrimi

### Mimari Kararlar
- Finansal hesap hareketleri `transactions` koleksiyonunda toplanir.
- Gelir ve odenmis giderler hesap bakiyelerini transaction uzerinden etkiler.
- Cari bakiye; fatura kalan tutarlari ve odenmemis giderler uzerinden senkronize edilir.
- Fatura tahsilatlari ayrik transaction kaydi olarak tutulur.
- Response formati standarttir: `success`, `message`, `data`, `meta`.

## C. Klasor Yapisi

```text
client/
  src/
    components/
    constants/
    context/
    hooks/
    layouts/
    pages/
    router/
    services/
    utils/
server/
  src/
    config/
    constants/
    controllers/
    middlewares/
    models/
    routes/
    scripts/
    services/
    utils/
    validations/
```

## D. Backend Kurulumu

### Server Katmanlari
- `config`: environment ve Mongo baglantisi
- `models`: Mongoose koleksiyonlari
- `validations`: Zod request semalari
- `middlewares`: auth, validate, not-found, error handler
- `services`: is kurallari, aggregation ve senkronizasyon mantigi
- `controllers`: request/response baglantisi
- `routes`: REST endpoint tanimlari
- `scripts`: demo veri seed islemleri

### Guvenlik
- `bcrypt` ile parola hashleme
- `jsonwebtoken` ile token dogrulama
- `protect` ve `authorize` middleware katmani
- validation ile istenmeyen alanlari engelleme
- password alanini response disinda tutma

## E. Veri Modelleri

### `users`
- `name`, `email`, `password`, `role`, `status`, `lastLoginAt`
- `email` unique index
- roller: `admin`, `accountant`, `viewer`

### `currentAccounts`
- `type`, `name`, `phone`, `email`, `address`, `taxNumber`, `identityNumber`, `balance`, `notes`, `status`
- `type + name` index

### `incomes`
- `title`, `description`, `category`, `amount`, `date`, `paymentMethod`, `currentAccount`, `documentNumber`, `accountModel`, `account`, `createdBy`
- kategori ve tarih indexleri

### `expenses`
- `title`, `description`, `category`, `amount`, `date`, `dueDate`, `paymentMethod`, `currentAccount`, `receiptNumber`, `status`, `isRecurring`, `recurrenceRule`, `accountModel`, `account`, `createdBy`
- kategori, durum ve tarih indexleri

### `invoices`
- `invoiceNumber`, `currentAccount`, `issueDate`, `dueDate`, `status`, `items`, `subtotal`, `vatTotal`, `grandTotal`, `paidAmount`, `remainingAmount`, `notes`, `createdBy`
- `invoiceNumber` unique

### `cashAccounts`
- `name`, `code`, `currency`, `balance`, `isDefault`, `description`, `status`

### `bankAccounts`
- `bankName`, `accountName`, `iban`, `accountNumber`, `branchCode`, `balance`, `currency`, `status`
- `iban` unique

### `transactions`
- `transactionNumber`, `type`, `direction`, `amount`, `date`, `paymentMethod`, `accountModel`, `account`, `currentAccount`, `referenceModel`, `referenceId`, `note`, `createdBy`
- hesap, referans ve tarih bazli indexler

## F. Route ve Controller Yapisi

### Auth
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Users
- `GET /api/v1/users`
- `POST /api/v1/users`
- `PATCH /api/v1/users/:id/status`

### Incomes
- `GET /api/v1/incomes`
- `GET /api/v1/incomes/:id`
- `POST /api/v1/incomes`
- `PUT /api/v1/incomes/:id`
- `DELETE /api/v1/incomes/:id`

### Expenses
- `GET /api/v1/expenses`
- `GET /api/v1/expenses/:id`
- `POST /api/v1/expenses`
- `PUT /api/v1/expenses/:id`
- `DELETE /api/v1/expenses/:id`

### Currents
- `GET /api/v1/currents`
- `GET /api/v1/currents/:id`
- `GET /api/v1/currents/:id/statement`
- `POST /api/v1/currents`
- `PUT /api/v1/currents/:id`

### Cash / Banks
- `GET /api/v1/cash/accounts`
- `GET /api/v1/cash/accounts/:id/movements`
- `POST /api/v1/cash/accounts`
- `PUT /api/v1/cash/accounts/:id`
- `GET /api/v1/banks/accounts`
- `GET /api/v1/banks/accounts/:id/movements`
- `POST /api/v1/banks/accounts`
- `PUT /api/v1/banks/accounts/:id`

### Invoices
- `GET /api/v1/invoices`
- `GET /api/v1/invoices/:id`
- `POST /api/v1/invoices`
- `PUT /api/v1/invoices/:id`
- `PATCH /api/v1/invoices/:id/payment`
- `DELETE /api/v1/invoices/:id`

### Reports
- `GET /api/v1/reports/overview`
- `GET /api/v1/reports/income-daily`
- `GET /api/v1/reports/monthly-financials`
- `GET /api/v1/reports/expense-categories`
- `GET /api/v1/reports/currents/:id/statement`
- `GET /api/v1/reports/cash/:id/movements`
- `GET /api/v1/reports/banks/:id/movements`

## G. Frontend Kurulumu

### Frontend Yapisi
- `context/AuthContext`: oturum yonetimi
- `layouts/AppShell`: sidebar + topbar + content grid
- `services/*`: API baglantilari
- `components/common`: reusable UI katmani
- `components/forms`: feature form bilesenleri
- `pages/*`: moduler ekranlar

### Tasarim Yaklasimi
- Koyu vurgu renkli, acik zeminli kurumsal SaaS dil
- `Manrope` baslik tipi + `IBM Plex Sans` govde tipi
- buyuk radius, yumusak goge, kontrollu bosluk ve kart odakli grid

## H. Layout ve Sayfalar

- `LoginPage`: premium acilis, demo kullanici bloklari
- `DashboardPage`: KPI kartlari, trend chart, dagilim chart, son islemler, likidite, uyarilar
- `IncomesPage`: filtre, tablo, modal form
- `ExpensesPage`: filtre, tablo, durum bazli gider yonetimi
- `CurrentsPage`: cari liste + ekstre modal akisi
- `AccountsPage`: kasa ve banka bolumleri + hareket modal akisi
- `InvoicesPage`: fatura tablosu + tahsilat modal akisi
- `ReportsPage`: ozet raporlar + secilebilir detay raporlari
- `UsersPage`: rol bazli kullanici yonetimi
- `CatalogPage`: urun ve hizmet kartlari, fiyatlandirma ve hesap eslestirmesi
- `InventoryPage`: depo kartlari, stok pozisyonlari ve kritik stok takibi
- `OffersPage`: teklif pipeline ve ticari donusum takibi
- `OrdersPage`: satis ve alis siparisleri
- `DispatchNotesPage`: sevk, kabul ve faturalama oncesi lojistik akis
- `CollectionsPage`: cari ve fatura bazli tahsilat takibi
- `PaymentsPage`: tedarikci, personel ve vergi odemeleri
- `ChecksPage`: cek / senet portfoy ve vade izleme
- `AccountingPage`: hesap plani ve yevmiye fisleri
- `DocumentsPage`: arsiv ve belge onay durumu
- `NotificationsPage`: kritik operasyon uyari merkezi
- `CalendarPage`: vade ve vergi takvimi
- `SettingsPage`: firma, belge ve finans varsayimlari
- `ActivityLogsPage`: denetim izleri ve islem gecmisi

## I. Dashboard ve Moduller

### Dashboard Metrikleri
- toplam gelir
- toplam gider
- net bakiye
- tahsil edilen odemeler
- bekleyen alacaklar
- aktif cari sayisi

### Moduller Arasi Iliski
- gelir -> transaction -> hesap bakiyesi
- paid gider -> transaction -> hesap bakiyesi
- invoice -> current balance
- invoice payment -> transaction + current balance
- current statement -> income + expense + invoice + payment akisi
- offer -> order -> dispatch note -> invoice -> collection
- product -> stock -> warehouse -> dispatch / purchase flow
- document + notification + activity log -> dashboard executive widgets

## J. Servis Baglantilari

Frontend servisleri:
- `authService`
- `dashboardService`
- `incomeService`
- `expenseService`
- `currentService`
- `accountService`
- `invoiceService`
- `reportService`
- `userService`
- `transactionService`
- `enterpriseService`

Tum servisler ortak `axios` instance uzerinden `Authorization: Bearer <token>` ile calisir.
Sunucuya henuz tasinmayan genisletilmis ERP modulleri icin `enterpriseService`, tarayici ici demo veri katmani ile calisir.

## K. Ornek Demo Veriler

Seed script su tur veriler olusturur:
- 3 kullanici: admin, muhasebeci, goruntuleyici
- 5 cari hesap: musteri ve tedarikci karmasi
- 2 kasa hesabi
- 2 banka hesabi
- 8 gelir kaydi
- 8 gider kaydi
- 3 fatura
- parcali ve tam tahsilat ornekleri
- urun ve hizmet katalogu
- depo ve kritik stok verileri
- teklif, siparis ve irsaliye akislari
- odeme, cek/senet, muhasebe fisti, dokuman, bildirim ve takvim kayitlari

### Demo Kullanici Bilgileri
- Admin: `selin.arslan@novafin.com / Demo123!`
- Muhasebeci: `emre.demir@novafin.com / Demo123!`
- Goruntuleyici: `ayse.kaya@novafin.com / Demo123!`

## L. Calistirma Adimlari

### 1. Environment dosyalari
`server/.env.example` dosyasini `server/.env` olarak kopyalayin ve duzenleyin:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/muhasebe_db
JWT_SECRET=super-secure-jwt-secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

`client/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 2. Bagimliliklar
```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 3. Demo veri
MongoDB calisir durumdayken:

```bash
npm run seed
```

### 4. Gelistirme ortami
```bash
npm run dev
```

Alternatif:
```bash
npm run dev --prefix server
npm run dev --prefix client
```

### 5. Uretim build
```bash
npm run build --prefix client
```

## M. Gelistirme Onerileri

- Refresh token ve httpOnly cookie tabanli auth
- Soft delete ve audit log mekanizmasi
- PDF fatura export ve e-posta gonderimi
- recurring expense scheduler
- para birimi desteği
- detayli RBAC yetki matrisi
- test katmani: unit + integration + component tests
- dashboard widget personalization
- export: CSV / Excel / PDF
- manual journal / mahsup fisleri
- `enterpriseService` altindaki modulleri kalici backend API'lerine tasima
- teklif, siparis, irsaliye ve tahsilat modulleri icin write operasyonlarini aktif etme

## Kalite Kontrol Notlari

Tamamlanan kontroller:
- client production build basarili
- server dosyalari `node --check` ile dogrulandi
- import/export zinciri kuruldu
- role-based route guard eklendi
- form validasyonu Zod ile kuruldu
- response yapisi standartlastirildi

Ortam siniri nedeniyle calistirilmayan kisim:
- Yerel MongoDB bu ortamda kurulu olmadigi icin backend + seed script canli veritabani uzerinde calistirilmadi
