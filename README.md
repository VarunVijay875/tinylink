# 🔗 TinyLink — URL Shortener (Next.js + Prisma + Neon + Vercel)

TinyLink is a simple, production-ready URL shortening service that supports link creation, redirection, click tracking, stats pages, and a lightweight dashboard UI.

This project was built as part of a technical assignment and includes a deployed live version, API routes, database integration, and a clean interface.

---

## 🚀 Live Deployment

🌍 **Production URL:**  
https://tinylink-omega-five.vercel.app

📡 **Health Check:**  
https://tinylink-omega-five.vercel.app/api/healthz

---

## 🧠 Features

| Feature | Status |
|---------|--------|
| Create short URLs | ✅ |
| Custom codes (6–8 chars) | ✅ |
| Redirect shortened links | ✅ |
| Click tracking | ✅ |
| Last clicked timestamp | ✅ |
| Stats page `/code/:code` | ✅ |
| Delete links | ✅ |
| Dashboard UI | ✅ |
| REST API | ✅ |
| Production deployment | ✅ |

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (Pages Router), React |
| Styling | TailwindCSS |
| Database ORM | Prisma 6 |
| Database | Neon Tech (PostgreSQL) |
| Hosting | Vercel |
| Runtime | Node.js |

---

## 🛠 Local Setup

### **1️⃣ Clone the repository**

```sh
git clone https://github.com/VarunVijay875/tinylink
cd tinylink
```

### **2️⃣ Install dependencies**

```sh
npm install
```

### **3️⃣ Create `.env` file**

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

(See `.env.example` for required variables.)

### **4️⃣ Run database migrations**

```sh
npx prisma migrate dev --name init
```

### **5️⃣ Start development server**

```sh
npm run dev
```

Visit:
```
http://localhost:3000
```

---

## 🗄 Database Schema (Prisma)

```prisma
model Link {
  id          Int      @id @default(autoincrement())
  code        String   @unique
  url         String
  clicks      Int      @default(0)
  lastClicked DateTime?
  createdAt   DateTime @default(now())
}
```

---

## 📡 API Endpoints

### **POST /api/links**
Create a short link.

```json
{
  "url": "https://google.com",
  "code": "google1"
}
```

### **GET /api/links**
Get all links.

### **GET /api/links/:code**
Fetch a single link.

### **DELETE /api/links/:code**
Delete a link.

### **GET /api/healthz**
Health check endpoint.

---

## 🔗 Redirects

Visiting a short code automatically redirects while tracking clicks:

```
https://tinylink-omega-five.vercel.app/google1
```

---

## 📊 Stats Page

Each link has a dedicated stats page:

```
https://tinylink-omega-five.vercel.app/code/google1
```

Displays:

- Full URL
- Short URL
- Click count
- Created time
- Last clicked time

---

## 🌍 Deployment

- Hosted on **Vercel**
- Connected to **Neon PostgreSQL**
- Uses `postinstall` script to generate Prisma client during build:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "postinstall": "prisma generate"
}
```

---

## 🧪 Testing Instructions

| Action | How to Test |
|--------|------------|
| Create Link | Use Dashboard or POST `/api/links` |
| Redirect | Visit `/{code}` |
| Click Count | Check `/api/links/:code` |
| Stats Page | Visit `/code/:code` |
| Delete Link | Click Delete on Dashboard |
| Validation | Try invalid codes (short, symbols, long) |

---

## 🎥 Demo Video (Pending)

A short walkthrough video will be added here.

---

## ✨ Future Improvements

- Auth + user accounts
- Expiration & link lifetime
- Analytics dashboard (charts)
- QR code generation
- Rate limiting & abuse prevention

---

## 📝 License

This project is for demonstration and evaluation purposes only.

---

### 👤 Author

**Varun Vijay**  
GitHub: https://github.com/VarunVijay875
