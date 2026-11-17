# Frontend

เว็บส่วนหน้าสร้างด้วย Next.js สำหรับแบบทดสอบบุคลิกภาพและ Dashboard

## เริ่มใช้งาน

ติดตั้ง dependencies และเปิด development server:

```bash
npm ci
npm run dev
```

เปิดเว็บที่ `http://localhost:3000` ต้องเปิด FastAPI Backend จากโฟลเดอร์ `blackend/` ด้วย เพราะหน้า quiz และ dashboard เรียก API ที่ `http://127.0.0.1:8000`

## หน้าเว็บ

- `/` — เปลี่ยนเส้นทางไปหน้า Dashboard
- `/dashboard` — Dashboard สำหรับจอแสดงผลแบบเรียลไทม์
- `/quiz` — แบบทดสอบ 10 ข้อ
- `/dashboard?fromQuiz=1` — Dashboard ที่เปิดจากหน้าจบแบบทดสอบ พร้อมปุ่มกลับไปทำแบบทดสอบอีกครั้ง

## คำสั่งที่ใช้บ่อย

```bash
npm run dev
npm run lint
npm run build
npm start
```

รายละเอียดการติดตั้ง Backend และการตั้งค่าโปรเจกต์ทั้งหมดอยู่ใน [README หลัก](../README.md)
