# 🛒 ARMA Store — Premium Grocery E-Commerce Platform

Welcome to **ARMA Store**, a high-performance, modern, and visually stunning grocery e-commerce web application. The platform features a glassmorphic client interface built using React 19 and Next.js 15, powered by a robust, secure Django REST API backend, Neon PostgreSQL database, Firebase Auth, Cloudinary, and Razorpay payment integration.

---

## ⚡ Tech Stack & Integrations

### Frontend (Client)
* **Framework**: [Next.js 15](file:///d:/a0.0%20M-4/E-commerce/package.json) (App Router, React 19)
* **Styling**: Tailwind CSS 4 with custom glassmorphism and animations
* **Animations**: Motion (Framer Motion) for fluid micro-interactions and route changes
* **State Management**: Zustand for real-time shopping cart and filtering state
* **Notifications**: Sonner for sleek, toast notifications
* **Authentication**: Firebase Authentication (Google Sign-In)

### Backend (API)
* **Framework**: Django 4.2 & Django REST Framework (DRF)
* **Database**: Neon PostgreSQL (Serverless Cloud DB) in production, SQLite in local development
* **Authentication**: JWT authentication via `django-rest-framework-simplejwt`
* **Static Assets**: WhiteNoise for high-performance static files management in production
* **Settings Management**: Python Decouple for decoupling credentials from settings file
* **Media & Cloud Storage**: Cloudinary for responsive and optimized product image delivery

### Third-Party Services
* **Payment Gateway**: Razorpay (UPI, Cards, Net Banking)
* **Auth Identity**: Firebase Auth & Firestore
* **Notifications**: Meta WhatsApp Cloud API (architecture ready)

---

## 📁 Repository Structure

```
E-commerce/
├── app/                        # Next.js Client application pages
│   ├── orders/                 # Order history page
│   ├── layout.tsx              # Base page layout & Provider injector
│   └── page.tsx                # Homepage featuring catalog & filters
├── components/                 # Shared React Components (Header, Cart, Product Card)
│   └── ui/                     # UI Primitives (Button, Badge, Dialog)
├── lib/                        # Client helper libraries
│   ├── AuthContext.tsx         # Firebase Auth Context Provider
│   ├── firebase.ts             # Firebase Initializer (uses config JSON)
│   ├── store.ts                # Zustand global state store (cart & filters)
│   └── utils.ts                # Tailwind utility merger
├── backend/                    # Django Backend Application
│   ├── api/                    # Core Django App (Models, Views, Serializers)
│   │   ├── models.py           # Database Schemas (Category, Product, Order)
│   │   ├── views.py            # API ViewSets & payment validation logic
│   │   └── urls.py             # API Endpoint Routing mappings
│   ├── backend/                # Main Django config folder (settings.py, urls.py)
│   ├── build.sh                # Executable script for Render environment setup
│   └── requirements.txt        # Backend dependencies
├── ALLMARKDOWN/                # Production manuals & local setup guidelines
└── README.md                   # Main documentation file
```

---

## 🔧 Local Development Setup

To run ARMA Store locally on your machine, follow these instructions.

### 1. Frontend Setup (Next.js)

1. Open your terminal at the project root folder.
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Setup the **Firebase Web App Config**:
   Create a file named [firebase-applet-config.json](file:///d:/a0.0%20M-4/E-commerce/firebase-applet-config.json) in the project root directory and add your Firebase configurations:
   ```json
   {
     "projectId": "your-project-id",
     "appId": "your-app-id",
     "apiKey": "your-api-key",
     "authDomain": "your-auth-domain",
     "firestoreDatabaseId": "default",
     "storageBucket": "your-storage-bucket",
     "messagingSenderId": "your-sender-id"
   }
   ```
4. Configure local environment variables:
   Create a [.env.local](file:///d:/a0.0%20M-4/E-commerce/.env.local) file in the root directory:
   ```env
   # Django backend API URL
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

   # Razorpay Public Key ID (from Razorpay Dashboard)
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```
5. Spin up the Next.js development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

### 2. Backend Setup (Django)

1. Open a new terminal session and navigate into the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Create environment
   python -m venv venv

   # Activate on Windows (PowerShell):
   venv\Scripts\Activate.ps1
   
   # Activate on macOS/Linux:
   source venv/bin/activate
   ```
3. Install the required libraries:
   ```bash
   pip install -r requirements.txt
   ```
4. Create the backend `.env` file inside the `backend/` directory and configure the database/keys:
   ```env
   SECRET_KEY=your-django-secret-key-goes-here
   DEBUG=True
   
   # Local SQLite URL format (automatically falls back if DATABASE_URL is empty)
   # Or configure a Postgres string: postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
   DATABASE_URL=
   
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

   # Cloudinary (Credentials for product images storage)
   CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
   
   # Razorpay API Secrets (For payment processing)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # WhatsApp Cloud API (Meta developer keys - optional)
   WHATSAPP_ACCESS_TOKEN=your_token
   WHATSAPP_PHONE_NUMBER_ID=your_phone_id
   ```
5. Apply database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
6. Create an administrator account to manage categories and products via the admin portal:
   ```bash
   python manage.py createsuperuser
   ```
7. Fire up the Django server:
   ```bash
   python manage.py runserver
   ```
   The backend API endpoints will be served at `http://127.0.0.1:8000`. Access the administrative interface at `http://127.0.0.1:8000/admin`.

---

## 🛠️ Production Deployment Guides

The setup guides for migrating the database, deploying the backend to Render, and deploying the frontend to Vercel are located in the local [ALLMARKDOWN/](file:///d:/a0.0%20M-4/E-commerce/ALLMARKDOWN) folder:

* **Backend Deployment (Render + Neon Postgres)**: [backend_deploy.md](file:///d:/a0.0%20M-4/E-commerce/ALLMARKDOWN/backend_deploy.md)
* **Frontend Deployment (Vercel)**: [frontend_deploy.md](file:///d:/a0.0%20M-4/E-commerce/ALLMARKDOWN/frontend_deploy.md)
* **Razorpay Payment Gateway Integration**: [razorpay.md](file:///d:/a0.0%20M-4/E-commerce/ALLMARKDOWN/razorpay.md)
* **Cloudinary Image Hosting Setup**: [cloudinary.md](file:///d:/a0.0%20M-4/E-commerce/ALLMARKDOWN/cloudinary.md)
* **WhatsApp Cloud OTP Integration**: [whatsapp.md](file:///d:/a0.0%20M-4/E-commerce/ALLMARKDOWN/whatsapp.md)
* **Local Reference Guide**: [local.md](file:///d:/a0.0%20M-4/E-commerce/ALLMARKDOWN/local.md)

---

## 📊 Database Models

Here is a summary of the core database schema configured in the Django backend ([models.py](file:///d:/a0.0%20M-4/E-commerce/backend/api/models.py)):

### 1. `Category`
Stores product categories such as Daily Essentials, Spices, Beverages, etc.
* `name` (`CharField`, unique): The display name of the category.
* `icon` (`CharField`): Emoji or Lucide icon identifier representing the category.

### 2. `Product`
Stores individual grocery listings.
* `name` (`CharField`): The product title.
* `category` (`ForeignKey`): Links to a `Category` entity.
* `price` (`DecimalField`): Price in INR.
* `pack_size` (`CharField`): Size description (e.g., `1 kg`, `500 ml`).
* `in_stock` (`BooleanField`): Toggle indicating inventory availability.
* `image` (`ImageField`): Directly uploaded to Cloudinary.
* `image_icon` (`CharField`): Fallback emoji if no image is uploaded.

### 3. `Order`
Stores client checkouts and payment context.
* `user` (`ForeignKey`): Links to the user.
* `total_amount` (`DecimalField`): Total price paid.
* `status` (`CharField`): Status tracking (`pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`).
* `razorpay_order_id` (`CharField`): Order ID from Razorpay SDK.
* `razorpay_payment_id` (`CharField`): Successful payment transaction receipt ID.

### 4. `OrderItem`
Stores items contained within an order.
* `order` (`ForeignKey`): Parent order.
* `product` (`ForeignKey`): Product mapping (set to null if product is deleted).
* `product_name` (`CharField`): Text fallback for the product name.
* `quantity` (`PositiveIntegerField`): Number of units ordered.
* `price` (`DecimalField`): Purchase price at the time order was created.
