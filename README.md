# Secondhand Mobile Phone Sales System

ระบบ Back Office สำหรับร้านขายโทรศัพท์มือถือมือสอง ใช้จัดการข้อมูลสินค้า การรับซื้อ การขาย งานซ่อม ผู้ใช้งาน บริษัท และสรุปยอดขายผ่าน Dashboard

## Features

- Sign in ด้วย JWT และแยกสิทธิ์ผู้ใช้งานระหว่าง `admin` และ `user`
- จัดการผู้ใช้งาน เช่น เพิ่ม แก้ไข ลบ และกำหนดระดับสิทธิ์
- จัดการข้อมูลบริษัท เช่น ชื่อบริษัท อีเมล เบอร์โทร ที่อยู่ และเลขประจำตัวผู้เสียภาษี
- จัดการข้อมูลการรับซื้อโทรศัพท์มือถือมือสอง พร้อมข้อมูลลูกค้า สี รุ่น ราคา serial number และสถานะสินค้า
- จัดการการขายสินค้าโดยค้นหาจาก serial number และยืนยันยอดขาย
- ดูประวัติการขายและหน้าพิมพ์ข้อมูลการขาย
- จัดการงานซ่อมและบริการ
- Dashboard แสดงยอดขายรวม จำนวนงานซ่อม และจำนวนรายการขาย
- Export ข้อมูลสินค้าเป็นไฟล์ Excel

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Recharts
- SweetAlert2
- XLSX

### Backend

- Node.js
- Express.js
- Prisma ORM
- MongoDB
- JSON Web Token (JWT)
- CORS
- dotenv
- XLSX

## Project Structure

```text
Secondhand-mobile-phone-sales-system/
├── api/              # Express.js backend API
│   ├── controllers/  # API controllers
│   ├── prisma/       # Prisma schema
│   └── server.js     # API entry point
└── web/
    └── my-app/       # Next.js frontend
```

## Prerequisites

ติดตั้งโปรแกรมเหล่านี้ก่อนเริ่มใช้งาน:

- Node.js
- npm
- MongoDB database หรือ MongoDB Atlas

## Installation

### 1. Clone project

```bash
git clone <repository-url>
cd Secondhand-mobile-phone-sales-system
```

### 2. Install backend dependencies

```bash
cd api
npm install
```

### 3. Create backend environment file

สร้างไฟล์ `.env` ในโฟลเดอร์ `api`:

```env
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>"
SECRET_KEY="your-secret-key"
```

> Backend ใช้ `SECRET_KEY` สำหรับสร้างและตรวจสอบ JWT token

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Install frontend dependencies

เปิด terminal ใหม่ หรือกลับไปที่ root project แล้วเข้า frontend:

```bash
cd ../web/my-app
npm install
```

## Running the Project

ต้องเปิด backend และ frontend พร้อมกันคนละ terminal

### 1. Start backend API

```bash
cd api
node server.js
```

Backend จะรันที่:

```text
http://localhost:3001
```

### 2. Start frontend

```bash
cd web/my-app
npm run dev
```

Frontend จะรันที่:

```text
http://localhost:3000
```

เปิด browser แล้วเข้า:

```text
http://localhost:3000/signin
```

## First User Setup

ถ้ายังไม่มีผู้ใช้งานในระบบ ให้สร้าง user ผ่าน API ก่อน โดยเปิด backend แล้วเรียก endpoint นี้:

```http
POST http://localhost:3001/api/user/create
```

Example request body:

```json
{
  "name": "Admin",
  "username": "admin",
  "password": "1234",
  "level": "admin"
}
```

หลังจากสร้าง user แล้ว สามารถเข้าสู่ระบบผ่านหน้า `/signin` ได้

## Main Pages

- `/signin` - หน้าเข้าสู่ระบบ
- `/backoffice/dashboard` - Dashboard สรุปยอดขายและงานซ่อม
- `/backoffice/buy` - จัดการข้อมูลการรับซื้อและสินค้าในสต็อก
- `/backoffice/sell` - จัดการการขาย
- `/backoffice/sell/history` - ประวัติการขาย
- `/backoffice/repair` - จัดการงานซ่อมและบริการ
- `/backoffice/company` - จัดการข้อมูลบริษัท
- `/backoffice/user` - จัดการผู้ใช้งาน

## API Overview

Backend API base URL:

```text
http://localhost:3001/api
```

ตัวอย่างกลุ่ม API ที่มีในระบบ:

- `/user` - authentication และ user management
- `/company` - company profile
- `/buy` - product purchase และ inventory
- `/sell` - sales, confirmation, history และ dashboard data
- `/service` - repair/service records

## Notes

- Frontend ตั้งค่า API URL ไว้ที่ `web/my-app/app/config.ts`
- Backend ใช้ port `3001`
- Frontend ใช้ port `3000`
- ต้องรัน MongoDB และตั้งค่า `DATABASE_URL` ให้ถูกต้องก่อนใช้งาน
