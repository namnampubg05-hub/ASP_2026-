# NamCMS Solution — DrinkStore 🥤

**NamCMS** là hệ thống quản lý nội dung & bán hàng trực tuyến (CMS + E-commerce) chuyên bán nước giải khát.  
Gồm **Backend API** (ASP.NET Core) + **Frontend SPA** (React) + **Admin Panel** (Razor Pages).

---

## 🧱 Công nghệ sử dụng

| Layer | Công nghệ | Version |
|-------|-----------|---------|
| Backend | ASP.NET Core Web API + MVC | .NET 10 |
| Frontend | React + React Router | 19.x |
| ORM | Entity Framework Core | 10.x |
| Database | SQL Server (LocalDB / Express) | — |
| Auth (Admin) | Cookie Authentication | — |
| Auth (Customer) | JWT (manual) | — |
| Password Hashing | BCrypt.Net-Next | 4.2.0 |
| Email | SendGrid API | 9.29.3 |
| API Docs | Swagger / Swashbuckle | 10.x |
| CSS | Bootstrap 5 (Admin) + custom CSS (Frontend) | — |

---

## 📁 Cấu trúc thư mục

```
NamCMS_Solution/
├── CMS.Backend/                    # ASP.NET Core (API + Admin MVC)
│   ├── Controllers/                # 19 controllers (API + MVC)
│   ├── Models/                     # ViewModels (ErrorViewModel.cs)
│   ├── Services/                   # IEmailService, EmailService (SendGrid)
│   ├── Views/                      # Razor Views cho Admin Panel
│   │   ├── Account/               # Đăng nhập Admin
│   │   ├── Order/                 # Quản lý đơn hàng
│   │   ├── Product/               # Quản lý sản phẩm
│   │   ├── Category/              # Quản lý danh mục bài viết
│   │   ├── CategoryProduct/       # Quản lý danh mục sản phẩm
│   │   ├── Customer/              # Quản lý khách hàng
│   │   ├── Post/                  # Quản lý bài viết
│   │   ├── Advertisement/         # Quản lý quảng cáo
│   │   ├── OrderDetail/           # Chi tiết đơn hàng
│   │   ├── User/                  # Quản lý người dùng admin
│   │   ├── Home/                  # Dashboard
│   │   └── Shared/                # _LayoutAdmin.cshtml + _Layout.cshtml
│   ├── wwwroot/                    # Static files (css, js, images)
│   ├── Program.cs                  # Entry point, DI, Middleware, CORS
│   └── appsettings.json            # Connection string, SendGrid, Frontend URL
│
├── CMS.Data/                       # Entity Framework — Data Layer
│   ├── Entities/                   # 9 entity classes
│   ├── Migrations/                 # EF Core migrations (4 migrations)
│   └── ApplicationDbContext.cs     # DbContext với 9 DbSet
│
├── cms.frontend/                   # React SPA (Create React App)
│   ├── src/
│   │   ├── api/                    # axiosClient.js (HTTP client)
│   │   ├── assets/                 # CSS, images
│   │   ├── components/             # Header, Navbar, Footer, LoginPrompt
│   │   ├── context/                # AuthContext, CartContext
│   │   ├── pages/                  # 11 page folders
│   │   │   ├── auth/              # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── cart/              # Giỏ hàng
│   │   │   ├── checkout/          # Thanh toán
│   │   │   ├── home/              # Trang chủ
│   │   │   ├── shop/              # Danh mục sản phẩm
│   │   │   ├── products/          # Tất cả sản phẩm
│   │   │   ├── product-detail/    # Chi tiết sản phẩm
│   │   │   ├── blog/              # Tin tức + chi tiết bài viết
│   │   │   ├── profile/           # Thông tin khách hàng
│   │   │   ├── contact/           # Liên hệ
│   │   │   └── order-success/     # Đặt hàng thành công
│   │   ├── services/              # 7 service files (gọi API)
│   │   ├── config.js              # API_BASE_URL
│   │   └── App.js                 # Router config
│   └── package.json
│
├── NamCMS_Solution.slnx           # Solution file (Visual Studio)
├── README.md                       # Bạn đang đọc đây
└── .github/workflows/              # CI/CD (đang trống)
```

---

## 🗄️ Cơ sở dữ liệu — Entity Relationship

### 9 Entities

| Entity | Mô tả | Liên kết |
|--------|-------|----------|
| **Category** | Danh mục bài viết (vd: Tin công nghệ, Tin thể thao) | 1–N → Post |
| **Post** | Bài viết tin tức | N–1 → Category |
| **CategoryProduct** | Danh mục sản phẩm (vd: Nước ngọt, Nước tăng lực) | 1–N → Product |
| **Product** | Sản phẩm (nước giải khát) | N–1 → CategoryProduct; 1–N → OrderDetail |
| **Customer** | Khách hàng (đăng ký, đặt hàng) | 1–N → Order |
| **Order** | Đơn hàng | N–1 → Customer; 1–N → OrderDetail |
| **OrderDetail** | Chi tiết đơn hàng (sản phẩm + số lượng) | N–1 → Order, N–1 → Product |
| **User** | Người dùng admin (quản trị hệ thống) | độc lập |
| **Advertisement** | Banner quảng cáo (trang chủ) | độc lập |

### Trạng thái đơn hàng (Order.Status)

| Giá trị | Ý nghĩa |
|---------|---------|
| 0 | Chờ duyệt (Pending) |
| 1 | Đang giao (Shipping) |
| 2 | Đã giao (Completed) |
| 3 | Đã hủy (Cancelled) |

### Trạng thái thanh toán (Order.PaymentStatus)

| Giá trị | Ý nghĩa |
|---------|---------|
| 0 | Chưa thanh toán |
| 1 | Đã thanh toán |

---

## 🚀 Hướng dẫn chạy

### Yêu cầu

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js 18+](https://nodejs.org/)
- SQL Server (LocalDB, Express, hoặc bản đầy đủ)
- Visual Studio 2022+ (khuyên dùng) hoặc VS Code

### 1. Cấu hình Database

Connection string mặc định trong `CMS.Backend/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=LAPTOP-V7Q78C0I;Database=NamCMS_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
```

**Thay đổi** `Server` cho phù hợp với máy bạn, hoặc dùng `(localdb)\MSSQLLocalDB`.

### 2. Tạo Database

```bash
cd CMS.Backend
dotnet ef database update
```

Hoặc trong Visual Studio: **Tools → NuGet Package Manager → Package Manager Console**  
Chọn project mặc định là `CMS.Data`, chạy:

```
Update-Database
```

Migration hiện có: **4 migrations** (InitialCreate → AddOrderFields → AddAdvertisementTable → AddCustomerResetToken)

### 3. Chạy Backend

```bash
cd CMS.Backend
dotnet run
```

Hoặc **F5** trong Visual Studio (chọn `CMS.Backend` làm Startup Project).

- API: `https://localhost:7047` (HTTPS) / `http://localhost:5235` (HTTP)
- Swagger: `https://localhost:7047/swagger`
- Admin Panel: `https://localhost:7047/Account/Login`

### 4. Chạy Frontend

```bash
cd cms.frontend
npm install
npm start
```

- Frontend: `http://localhost:3000`
- Tự động gọi API backend tại `https://localhost:7047` (cấu hình trong `src/config.js`)

---

## 🧪 Admin Panel

Đăng nhập tại `https://localhost:7047/Account/Login` bằng tài khoản **User** trong database.

| Route | Chức năng |
|-------|-----------|
| `/` | Dashboard (Home) |
| `/Product` | Quản lý sản phẩm (CRUD, upload ảnh) |
| `/CategoryProduct` | Quản lý danh mục sản phẩm |
| `/Category` | Quản lý danh mục bài viết |
| `/Post` | Quản lý bài viết / tin tức |
| `/Order` | Quản lý đơn hàng (duyệt / từ chối / edit, phân trang) |
| `/OrderDetail` | Chi tiết đơn hàng |
| `/Customer` | Danh sách khách hàng |
| `/User` | Quản lý người dùng admin (CRUD) |
| `/Advertisement` | Quản lý banner quảng cáo |

### Luồng duyệt đơn hàng

1. Khách đặt hàng qua frontend → Order.Status = **0** (Chờ duyệt)
2. Admin vào **Order** → nhấn **Duyệt** → Status = **1** (Đang giao)
3. Auto trừ tồn kho (StockQuantity)
4. Gửi email thông báo cho khách qua SendGrid
5. Admin có thể nhấn **Từ chối** → Status = **3** (Đã hủy) → hoàn lại tồn kho

---

## 📡 API Endpoints (RESTful)

API gốc: `https://localhost:7047/api/`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/Products` | Lấy danh sách sản phẩm |
| GET | `/api/Products/{id}` | Chi tiết sản phẩm |
| GET | `/api/Orders` | Lấy đơn hàng (theo customerId query) |
| POST | `/api/Orders/CreateOrder` | Tạo đơn hàng mới + gửi email xác nhận |
| GET | `/api/Customers/{id}` | Thông tin khách hàng |
| POST | `/api/Customers/ChangePassword` | Đổi mật khẩu |
| POST | `/api/Auth/CustomerRegister` | Đăng ký tài khoản |
| POST | `/api/Auth/CustomerLogin` | Đăng nhập (trả JWT) |
| POST | `/api/Auth/ForgotPassword` | Quên mật khẩu (gửi email reset link) |
| POST | `/api/Auth/ResetPassword` | Đặt lại mật khẩu (dùng token) |
| POST | `/api/Auth/MigratePasswords` | Hash toàn bộ password cũ lên BCrypt |
| GET | `/api/Categories` | Danh mục bài viết |
| GET | `/api/CategoryProducts` | Danh mục sản phẩm |
| GET | `/api/Posts` | Bài viết tin tức |
| GET | `/api/Advertisements` | Banner quảng cáo |

Xem đầy đủ tại **Swagger UI**: `https://localhost:7047/swagger`

---

## 🔐 Bảo mật

### Password Hashing (BCrypt)

- Dùng **BCrypt.Net-Next** (thư viện bcrypt mới nhất cho .NET)
- Password được hash với salt tự sinh, lưu dưới dạng `$2a$11$...`
- **Backward-compatible**: khi đăng nhập, nếu password cũ chưa hash (plain text), hệ thống tự động migrate lên BCrypt
- Endpoint `POST /api/Auth/MigratePasswords` để hash toàn bộ password cũ trong DB

### Authentication

| Loại | Cơ chế | Áp dụng cho |
|------|--------|-------------|
| Admin Cookie | `CookieAuthenticationDefaults` | Admin Panel (Razor Views) |
| Customer JWT | JWT thủ công (login trả token) | Frontend React (API calls) |

### CORS

Backend cho phép origin `http://localhost:3000` (React dev server) — cấu hình trong `Program.cs`.

---

## 📧 Email Service (SendGrid)

Hệ thống gửi 3 loại email qua **SendGrid API**:

| Loại | Trigger | Template |
|------|---------|----------|
| **Order Confirmation** | Khách đặt hàng thành công | Chi tiết đơn hàng, danh sách sản phẩm, tổng tiền |
| **Order Status Update** | Admin duyệt / từ chối / sửa đơn | Thông báo trạng thái mới + ghi chú |
| **Password Reset** | Khách yêu cầu quên mật khẩu | Link reset (trỏ về frontend) |

Cấu hình trong `appsettings.json`:

```json
"EmailSettings": {
  "SendGridApiKey": "SG.xxxxx",
  "SenderName": "NAMCMS",
  "SenderEmail": "your-email@gmail.com"
}
```

**⚠️ Lưu ý bảo mật:** Không commit API key thật lên Git. Dùng **User Secrets** khi dev:

```bash
dotnet user-secrets set "EmailSettings:SendGridApiKey" "SG.xxxxx"
```

---

## ⚙️ Cấu hình

### `appsettings.json`

| Key | Mô tả | Mặc định |
|-----|-------|----------|
| `ConnectionStrings:DefaultConnection` | SQL Server connection string | — |
| `Frontend:Url` | URL frontend (cho reset password link) | `http://localhost:3000` |
| `EmailSettings:SendGridApiKey` | API Key SendGrid | — |
| `EmailSettings:SenderName` | Tên người gửi email | `NAMCMS` |
| `EmailSettings:SenderEmail` | Email người gửi | — |

### `cms.frontend/src/config.js`

```js
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7047";
```

Có thể ghi đè bằng biến môi trường `REACT_APP_API_URL`.

---

## 🛠️ Phát triển

### Migration

```bash
# Thêm migration mới
cd CMS.Backend
dotnet ef migrations add MigrationName --project ../CMS.Data

# Cập nhật database
dotnet ef database update

# Xoá migration cuối
dotnet ef migrations remove
```

### Build

```bash
dotnet build
# Hiện tại: 0 errors, ~14 warnings (nullable)
```

### Project conventions

- Controller API: route prefix `api/[controller]`, `[ApiController]` attribute
- Controller MVC: không route prefix, dùng Razor Views
- Views: `_LayoutAdmin.cshtml` cho Admin, `_Layout.cshtml` cho public
- DbContext: `ApplicationDbContext` trong `CMS.Data`
- DI Registration: `Program.cs` (Scoped: DbContext, EmailService)

---

## 📝 Ghi chú phát triển

- Dùng **`VerifyPassword()` helper pattern** ở 3 controller (AuthController, AccountController, CustomersController): kiểm tra null → BCrypt → fallback plain text → auto migrate
- Email gửi đồng bộ (`await`) trong request — tránh fire-and-forget gây DbContext disposed
- Phân trang đơn hàng: 10 đơn/trang, giữ trang hiện tại sau khi duyệt/từ chối (dùng `Request.Headers["Referer"]` để trích xuất page)
- Kho (StockQuantity): trừ khi duyệt đơn (Status 0→1), cộng lại khi hủy (Status →3), trừ lại khi bỏ hủy (Status 3→khác)

---

## ❌ Troubleshooting

| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-------------|-----------|
| `SaltParseException` | Password cũ plain text truyền vào BCrypt.Verify | Đã xử lý bằng `VerifyPassword` helper — đăng nhập 1 lần để tự động migrate |
| `Cannot access database` | Server name sai / LocalDB chưa chạy | Sửa `ConnectionStrings:DefaultConnection` hoặc chạy `SqlLocalDb start` |
| `SendGrid email không gửi` | API key sai hoặc hết hạn | Kiểm tra/tạo lại API key trên [SendGrid Dashboard](https://app.sendgrid.com) |
| CORS lỗi | Frontend gọi sai port | Đảm bảo frontend port 3000, backend port 7047 |
| `ResetPassword` link sai | Thiếu cấu hình `Frontend:Url` | Thêm vào `appsettings.json` |

---

## 📄 Giấy phép

Dự án sinh viên — Dương Văn Nam — CNTT K47
