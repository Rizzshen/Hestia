# 🌿 Hestia - Inventory & Order Management System

**Built for Whole Earth Herbs**  
Hestia is a comprehensive, full-stack ERP and inventory management system designed to streamline business operations. It handles raw material tracking, product recipe management, client relations, order processing with automated stock deductions, and professional PDF invoice generation.

## ✨ Key Features

- **🔐 Secure Authentication & RBAC**: JWT-based authentication with HttpOnly cookies and Role-Based Access Control (Admin, Finance, Business).
- **📊 Interactive Dashboard**: Real-time business metrics, order status visualization (Recharts), and low-stock alerts.
- **📦 Raw Materials & Inventory**: Track stock levels, set low-stock thresholds, and receive automated alerts.
- **🧪 Product Recipes**: Link finished products to their required raw materials (ingredients).
- **🛒 Order Processing**: Full order lifecycle management. **Automated stock deduction** for both finished goods and raw materials when an order is confirmed.
- **🧾 Automated Invoicing**: Generate professional PDF invoices on the fly and store them securely via Supabase Storage.
- **👥 Client Management**: Multi-currency support (USD, EUR, NPR, INR, CNY) and detailed client profiles.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, Vite 8
- **Styling**: Tailwind CSS 4
- **State & Data**: Zustand, React Query (TanStack Query)
- **Forms & Validation**: React Hook Form, Zod
- **Data Visualization**: Recharts
- **Routing**: React Router DOM 7
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js, Express 5
- **Database**: PostgreSQL (Hosted on Supabase)
- **Authentication**: JWT, bcrypt, cookie-parser
- **PDF Generation**: pdf-lib
- **File Storage**: Supabase Storage
- **API Docs**: Swagger UI (swagger-jsdoc)

---

## 🗄️ Database Schema

The application is powered by a relational PostgreSQL database with the following core tables:

### `users`
| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `name` | `text` | |
| `email` | `text` | Unique |
| `password_hash` | `text` | |
| `role` | `text` | (admin, finance, business) |

### `clients`
| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `company_name` | `text` | |
| `contact_name` | `text` | |
| `email` | `text` | Unique |
| `country` | `text` | |
| `currency` | `text` | |

### `raw_materials`
| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `name` | `text` | |
| `unit` | `text` | |
| `stock_qty` | `numeric` | |
| `low_stock_threshold` | `numeric` | |

### `products`
| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `name` | `text` | |
| `description` | `text` | Nullable |
| `unit_price` | `numeric` | |
| `currency` | `text` | |
| `stock_qty` | `numeric` | |

### `product_ingredients` (Recipes)
| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `product_id` | `int4` | Foreign Key |
| `raw_material_id` | `int4` | Foreign Key |
| `quantity_needed` | `numeric` | |

### `orders`
| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `client_id` | `int4` | Foreign Key |
| `status` | `text` | (pending, confirmed, processing, shipped, delivered) |
| `notes` | `text` | Nullable |
| `created_at` | `timestamptz` | |

### `order_items`
| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `order_id` | `int4` | Foreign Key |
| `product_id` | `int4` | Foreign Key |
| `quantity` | `numeric` | |
| `unit_price_at_time` | `numeric` | |

### `invoices`
| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `order_id` | `int4` | Foreign Key |
| `issued_at` | `timestamptz` | |
| `total_amount` | `numeric` | |
| `currency` | `text` | |
| `pdf_url` | `text` | Nullable |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- A PostgreSQL database (Supabase recommended)
- A Supabase project (for Storage and Database)
## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Rizzshen/Hestia
cd Hestia
```

---

### 2. Backend Setup

Navigate to the backend folder and install dependencies.

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
DATABASE_URL=your_postgres_connection_string

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

---

### 3. Frontend Setup

Navigate to the frontend folder and install dependencies.

```bash
cd ../frontend
npm install
```

Create a `.env` file inside the `frontend` folder.

```env
VITE_API_URL=http://localhost:5000/api
```

---

### 4. Database Setup

Run the provided SQL schema to create the required PostgreSQL tables.

If you're using Supabase, also create a **public storage bucket** named:

```
invoices
```

This bucket is used to store generated PDF invoices.

---

## ▶️ Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

### Start the Frontend

```bash
cd frontend
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## 📖 API Documentation

Swagger documentation is available at:

```
http://localhost:5000/api/docs
```

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push the project to GitHub.
2. Import the **frontend** folder into Vercel.
3. Add the following environment variable:

```env
VITE_API_URL=https://your-backend-url/api
```

4. Deploy.

### Backend (Railway)

1. Create a new Railway project.
2. Deploy the **backend** folder.
3. Connect a PostgreSQL database (or Supabase).
4. Add all backend environment variables.
5. Deploy.

---

## 📁 Project Structure

```
Hestia
# Project Structure


backend/
├── src
│   ├── config
│   │   ├── db.js
│   │   ├── supabase.js
│   │   └── swagger.js
│   ├── controllers
│   │   ├── authController.js
│   │   ├── clientsController.js
│   │   ├── dashboardController.js
│   │   ├── ingredientsController.js
│   │   ├── invoiceController.js
│   │   ├── orderItemsController.js
│   │   ├── ordersController.js
│   │   ├── productsController.js
│   │   └── rawMaterialsController.js
│   ├── lib
│   ├── middlewares
│   │   └── auth.js
│   ├── routes
│   │   ├── auth.js
│   │   ├── clients.js
│   │   ├── dashboard.js
│   │   ├── ingredients.js
│   │   ├── invoice.js
│   │   ├── orderItems.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   └── rawMaterials.js
│   ├── services
│   │   ├── authService.js
│   │   ├── clientsService.js
│   │   ├── dashboardService.js
│   │   ├── ingredientsService.js
│   │   ├── invoiceService.js
│   │   ├── orderItemsService.js
│   │   ├── ordersService.js
│   │   ├── productsService.js
│   │   └── rawMaterialsService.js
│   ├── app.js
│   └── server.js
├── package-lock.json
└── package.json
|
frontend/
├── public
│   ├── favicon.svg
│   └── icons.svg
├── src
│   ├── api
│   │   ├── auth.js
│   │   ├── axios.js
│   │   ├── clients.js
│   │   ├── dashboard.js
│   │   ├── orderItems.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   └── rawmaterials.js
│   ├── assets
│   │   ├── hestia.png
│   │   └── hestia.svg
│   ├── components
│   │   ├── forms
│   │   │   ├── ClientForm.jsx
│   │   │   ├── OrderForm.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   └── RawMaterialForm.jsx
│   │   ├── layout
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PageWrapper.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TopBar.jsx
│   │   └── ui
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── ConfirmDialog.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       ├── Pagination.jsx
│   │       ├── ScreenState.jsx
│   │       ├── SearchInput.jsx
│   │       ├── Skeleton.jsx
│   │       ├── StatCard.jsx
│   │       ├── Table.jsx
│   │       ├── Toast.jsx
│   │       └── Tooltip.jsx
│   ├── constants
│   │   ├── index.js
│   │   └── routes.js
│   ├── hooks
│   │   ├── useDebounce.js
│   │   ├── usePagination.js
│   │   ├── useSortableData.js
│   │   └── useToast.js
│   ├── layouts
│   ├── lib
│   │   ├── formatters.js
│   │   └── utils.js
│   ├── pages
│   │   ├── Auth
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Clients
│   │   │   └── Clients.jsx
│   │   ├── Dashboard
│   │   │   └── Dashboard.jsx
│   │   ├── Orders
│   │   │   ├── OrderDetail.jsx
│   │   │   └── Orders.jsx
│   │   ├── Products
│   │   │   └── Products.jsx
│   │   └── RawMaterials
│   │       └── RawMaterials.jsx
│   ├── routes
│   ├── schemas
│   │   ├── client.js
│   │   ├── order.js
│   │   ├── product.js
│   │   └── rawMaterial.js
│   ├── services
│   ├── store
│   │   └── authStore.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vercel.json
└── vite.config.js
│
└── README.md
```

---

## 📄 License

This project is proprietary software developed for **Whole Earth Herbs**.
