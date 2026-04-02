# Company Intranet System

เว็บ Intranet ภาษาไทยสำหรับบริษัทในโรงงานอุตสาหกรรม สร้างด้วย React + Vite, TailwindCSS, Express.js และ MongoDB โดยแยกโปรเจกต์เป็น `client` และ `server`

## คุณสมบัติหลัก

- เข้าสู่ระบบและสมัครสมาชิกด้วย JWT Authentication
- Dashboard สรุปประกาศ เอกสาร โครงการ และการแจ้งเตือน
- จัดการประกาศบริษัท เอกสารภายใน และโครงการ
- แผงควบคุมผู้ดูแลระบบและระบบกำหนดสิทธิ์ `admin` / `employee`
- รองรับอัปโหลดไฟล์ PDF และรูปภาพด้วย Multer
- UI ภาษาไทย รองรับการค้นหากลาง และใช้งานบนมือถือได้

## โครงสร้างโปรเจกต์

```text
client/  -> React + Vite frontend
server/  -> Node.js + Express backend
```

## วิธีติดตั้ง

### 1. Backend

```bash
cd server
copy .env.example .env
npm install
npm run dev
```

### 2. Frontend

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

## Environment ฝั่ง Server

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/industrial_intranet
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

## Environment ฝั่ง Client

```env
VITE_API_URL=http://localhost:5000/api
```

## API สำคัญ

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/announcements`
- `POST /api/announcements`
- `PUT /api/announcements/:id`
- `DELETE /api/announcements/:id`
- `GET /api/documents`
- `POST /api/documents`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/notifications`
- `PUT /api/notifications/:id/read`
- `GET /api/dashboard/summary`

## หมายเหตุ

- หน้า `Register` เปิดให้เลือกระดับสิทธิ์เพื่อสะดวกต่อการเดโม portfolio ถ้าจะใช้จริงควรจำกัดการสร้าง `admin`
- ฝั่ง backend ให้บริการไฟล์อัปโหลดผ่าน `/uploads`
- ก่อนใช้งานจริงควรเพิ่ม validation เชิงลึก, audit log, rate limit และ secret management
