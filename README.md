# Animal Personality Project

เว็บทำแบบทดสอบบุคลิกภาพเพื่อทำนายสัตว์ที่มีลักษณะใกล้เคียง พร้อมหน้าแสดงผลและสถิติ

โปรเจกต์มีสองส่วน:

- `blackend/` — Backend API ด้วย FastAPI, ใช้โมเดลที่เตรียมไว้ใน `blackend/ml/model.pkl` และบันทึกผลลง SQLite
- `frontend/` — เว็บไซต์ Next.js

## สิ่งที่ต้องติดตั้ง

- Git
- Python 3.14 (แนะนำให้ใช้เวอร์ชันนี้เพื่อให้ตรงกับสภาพแวดล้อมที่ใช้สร้างโมเดล)
- Node.js 20.9 ขึ้นไป และ npm

## ดาวน์โหลดโปรเจกต์

```bash
git clone https://github.com/gitgitopop0/machine-learning-project.git
cd machine-learning-project
```

## ติดตั้งและเปิด Backend

เปิด Terminal หนึ่งหน้าต่าง แล้วสร้าง virtual environment และติดตั้งแพ็กเกจ:

### Windows (CMD)

```cmd
cd blackend
py -3.14 -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### macOS / Linux

```bash
cd blackend
python3.14 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

เมื่อเริ่ม Backend แล้ว API จะอยู่ที่ `http://127.0.0.1:8000` และเอกสาร API อยู่ที่ `http://127.0.0.1:8000/docs` ฐานข้อมูล `blackend/data/app.db` จะถูกสร้างให้อัตโนมัติเมื่อเปิด Backend ครั้งแรก

## ติดตั้งและเปิด Frontend

เปิด Terminal อีกหน้าต่าง ที่โฟลเดอร์หลักของโปรเจกต์:

```bash
cd frontend
npm ci
npm run dev
```

เปิดเว็บที่ `http://localhost:3000`:

- แบบทดสอบ: `http://localhost:3000/quiz`
- Dashboard: `http://localhost:3000/dashboard`

Frontend ตั้งค่าให้เรียก Backend ที่ `http://127.0.0.1:8000` ดังนั้นให้เปิดทั้งสองส่วนบนเครื่องเดียวกันระหว่างพัฒนา

## โครงสร้างข้อมูลและโมเดล

- ข้อมูลชุดฝึกอยู่ที่ `blackend/data/animal_personality_dataset_25000.csv`
- โมเดลที่ Backend โหลดอยู่ที่ `blackend/ml/model.pkl`
- สคริปต์ฝึกโมเดลอยู่ที่ `blackend/ml/train.py`
- ผลแบบทดสอบของแต่ละเครื่องจะถูกเก็บใน SQLite ที่ `blackend/data/app.db` ซึ่งไม่ถูกส่งขึ้น GitHub

ไฟล์ `model.pkl` สร้างด้วย scikit-learn รุ่นที่ระบุใน `blackend/requirements.txt` ควรใช้ dependency รุ่นเดียวกันเพื่อหลีกเลี่ยงปัญหาความเข้ากันได้ของโมเดลที่บันทึกไว้

## API หลัก

- `POST /predict` — ส่งคำตอบ 10 ข้อและรับผลทำนาย
- `GET /latest` — อ่านผลล่าสุด
- `GET /stats` — อ่านสถิติผลทำนาย
- `WS /ws/result` — รับการแจ้งผลล่าสุดผ่าน WebSocket
