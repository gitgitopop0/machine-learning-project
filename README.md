# Animal Personality Quiz

เว็บแบบทดสอบบุคลิกภาพที่ทำนายว่าสัตว์ชนิดใดมีลักษณะใกล้เคียงกับผู้ทำแบบทดสอบ พร้อมแสดงผลล่าสุดและสถิติผู้เข้าร่วมแบบเรียลไทม์

## ส่วนประกอบ

- `frontend/` — เว็บไซต์ Next.js สำหรับทำแบบทดสอบและแสดง Dashboard
- `blackend/` — API ด้วย FastAPI, โมเดลทำนาย และฐานข้อมูล SQLite
- `blackend/ml/model.pkl` — โมเดลที่ใช้ทำนายผล
- `blackend/data/animal_personality_dataset_25000.csv` — ชุดข้อมูลสำหรับฝึกโมเดล

## ความต้องการของระบบ

- Python 3.14 และ pip
- Node.js 20.9 ขึ้นไป และ npm

## เริ่มใช้งานในเครื่อง

เปิด Terminal สองหน้าต่าง โดยเปิด Backend และ Frontend แยกกัน

### 1. ติดตั้งและเปิด Backend

บน Windows PowerShell:

```powershell
cd blackend
py -3.14 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

บน macOS หรือ Linux:

```bash
cd blackend
python3.14 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

API จะทำงานที่ `http://127.0.0.1:8000` และดูเอกสาร API ได้ที่ `http://127.0.0.1:8000/docs` ฐานข้อมูล SQLite ที่ `blackend/data/app.db` จะถูกสร้างให้อัตโนมัติเมื่อเริ่ม Backend ครั้งแรก

### 2. ติดตั้งและเปิด Frontend

เปิด Terminal อีกหน้าต่างที่โฟลเดอร์หลักของโปรเจกต์:

```bash
cd frontend
npm ci
npm run dev
```

เว็บไซต์จะทำงานที่ `http://localhost:3000` โดย Frontend ตั้งค่าให้เรียก Backend ที่ `http://127.0.0.1:8000` อยู่แล้ว ระหว่างใช้งานต้องเปิด Backend และ Frontend พร้อมกัน

## วิธีใช้หน้าจอ

โปรเจกต์รองรับการเปิดคนละจอหรือคนละอุปกรณ์:

- **จอแสดง Dashboard:** เปิด `http://localhost:3000/dashboard` ค้างไว้ หน้านี้แสดงผลล่าสุดและสถิติสด โดยไม่มีปุ่มกลับไปเล่นแบบทดสอบ
- **จอทำแบบทดสอบ:** เปิด `http://localhost:3000/quiz` ผู้ทำแบบทดสอบเลือกคำตอบ จากนั้นกด **ถัดไป** เพื่อไปข้อถัดไป เมื่อทำครบให้กดส่งผล
- หลังส่งคำตอบสำเร็จ กด **ไปดู Dashboard** เพื่อเปิดผลบนหน้าจอนี้ พร้อมปุ่มกลับไปทำแบบทดสอบอีกครั้ง

Dashboard รับผลใหม่ผ่าน WebSocket และโหลดสถิติจาก Backend โดยตรง เมื่อเปิดหน้า Dashboard จะได้รับผลล่าสุดที่บันทึกไว้ด้วย

หน้าแรก `http://localhost:3000` จะเปิด Dashboard โดยอัตโนมัติ

## API

| Endpoint | วิธี | รายละเอียด |
| --- | --- | --- |
| `/predict` | POST | รับคำตอบ 10 ข้อ (คะแนนข้อละ 1–5) และบันทึกผลทำนาย |
| `/latest` | GET | อ่านผลทำนายล่าสุด |
| `/stats` | GET | อ่านจำนวนผู้ทำแบบทดสอบและจำนวนผลแยกตามสัตว์ |
| `/ws/result` | WebSocket | ส่งผลล่าสุดให้ Dashboard ทันทีเมื่อมีผลใหม่ |

## โครงสร้างโปรเจกต์

```text
.
├── blackend/
│   ├── data/       # ชุดข้อมูล, ข้อมูลสัตว์ และ SQLite
│   ├── ml/         # โค้ดทำนายและฝึกโมเดล
│   ├── db.py
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── app/
    │   ├── dashboard/
    │   └── quiz/
    └── lib/
```

## คำสั่งตรวจสอบ Frontend

```bash
cd frontend
npm run lint
```

ผลแบบทดสอบเก็บไว้ใน SQLite ภายในเครื่องที่ `blackend/data/app.db` ส่วนโมเดลที่ใช้รันเว็บอยู่ใน `blackend/ml/model.pkl` และสคริปต์ฝึกโมเดลอยู่ที่ `blackend/ml/train.py`
