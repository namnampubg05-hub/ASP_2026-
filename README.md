# NamCMS Solution - DrinkStore

Web bán nước giải khát (ASP.NET Core + React).

## Yêu cầu

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- SQL Server (hoặc LocalDB)

## Cấu trúc

```
NamCMS_Solution/
├── CMS.Backend/        # ASP.NET Core Web API (backend)
├── CMS.Data/           # Entity Framework models + DbContext
├── cms.frontend/       # React SPA (frontend)
└── NamCMS_Solution.slnx
```

## Chạy Backend (F5)

1. Mở file `NamCMS_Solution.slnx` bằng Visual Studio 2022+.
2. Chọn project **CMS.Backend** làm Startup Project.
3. Nhấn **F5** (hoặc `Ctrl+F5`) — backend chạy tại:
   - https://localhost:7047 (HTTPS)
   - http://localhost:5235 (HTTP)

Hoặc chạy bằng CLI:

```bash
cd CMS.Backend
dotnet run
```

Backend dùng Entity Framework + SQL Server. Connection string cấu hình trong `appsettings.json`.

## Chạy Frontend

```bash
cd cms.frontend
npm install
npm start
```

Frontend chạy tại **http://localhost:3000**, gọi API backend qua `https://localhost:7047` (cấu hình trong `src/config.js`).

## Tính năng chính

- Quản lý sản phẩm, danh mục, đơn hàng
- Giỏ hàng, đặt hàng, kiểm tra tồn kho
- Xác thực khách hàng (JWT)
- Admin CRUD qua giao diện Razor Pages
- API RESTful cho frontend React
