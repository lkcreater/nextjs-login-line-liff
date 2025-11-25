# Next.js TypeScript + LINE LIFF Integration

แอปพลิเคชัน Next.js ที่ใช้ TypeScript และเชื่อมต่อกับ LINE LIFF (LINE Front-end Framework) เพื่อทำงานภายใน LINE environment

## ✨ Features

- ✅ Next.js 15 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ LINE LIFF SDK Integration
- ✅ User Profile Display
- ✅ Send Messages to Chat
- ✅ LIFF Window Controls
- ✅ External Browser Support

## 📋 Prerequisites

- Node.js 18+ และ npm
- LINE Developers Account
- LIFF App (สร้างจาก LINE Developers Console)

## 🚀 Getting Started

### 1. สร้าง LIFF App

1. ไปที่ [LINE Developers Console](https://developers.line.biz/console/)
2. สร้าง Provider (ถ้ายังไม่มี)
3. สร้าง Channel ประเภท "LINE Login"
4. ไปที่แท็บ "LIFF" และกด "Add"
5. กรอกข้อมูล:
   - **LIFF app name**: ชื่อแอพของคุณ
   - **Size**: Full, Tall, หรือ Compact (ตามต้องการ)
   - **Endpoint URL**: `http://localhost:3000` (สำหรับทดสอบ) หรือ URL production ของคุณ
   - **Scope**: profile, openid (ขั้นต่ำ)
   - **Bot link feature**: เปิดหรือปิดตามต้องการ
6. คัดลอก **LIFF ID** ที่ได้

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` จากไฟล์ตัวอย่าง:

```bash
cp .env.example .env.local
```

แก้ไขไฟล์ `.env.local` และใส่ LIFF ID ของคุณ:

```env
NEXT_PUBLIC_LIFF_ID=your-liff-id-here
```

### 4. รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### 5. ทดสอบใน LINE App

เพื่อทดสอบฟีเจอร์ที่ใช้งานได้เฉพาะใน LINE App:

1. เปิด LINE App ในมือถือ
2. ส่ง LIFF URL ให้ตัวเอง: `https://liff.line.me/{YOUR_LIFF_ID}`
3. คลิกที่ลิงก์เพื่อเปิดแอพ
4. แอพจะแสดง user profile และฟีเจอร์ต่างๆ

## 📁 Project Structure

```
nextjs-liff/
├── app/
│   ├── layout.tsx          # Root layout with LiffProvider
│   ├── page.tsx            # Main page with LIFF features
│   └── globals.css         # Global styles
├── components/
│   └── LiffProfile.tsx     # User profile component
├── contexts/
│   └── LiffContext.tsx     # LIFF context provider
├── lib/
│   └── liff.ts             # LIFF helper functions
├── .env.example            # Environment variables template
└── .env.local              # Your local env config (git-ignored)
```

## 🔧 LIFF Features

### ✅ ใช้งานได้

- ✅ **User Authentication**: ล็อกอินด้วย LINE
- ✅ **Get Profile**: ดึงข้อมูล user profile (ชื่อ, รูปภาพ, status message)
- ✅ **Check Environment**: ตรวจสอบว่าเปิดใน LINE App หรือ external browser

### 🔒 ใช้งานได้เฉพาะใน LINE App

- 🔒 **Send Messages**: ส่งข้อความไปยังแชทปัจจุบัน
- 🔒 **Close Window**: ปิดหน้าต่าง LIFF
- ✅ **Open External Browser**: เปิด URL ใน external browser (ใช้ได้ทั้งใน LINE และนอก LINE)

## 🎯 Usage Examples

### ใช้ LIFF Context

```typescript
import { useLiff } from '@/contexts/LiffContext';

export default function MyComponent() {
  const { isReady, isLoggedIn, profile, liffObject } = useLiff();

  if (!isReady) return <div>Loading...</div>;
  if (!isLoggedIn) return <div>Please login</div>;

  return (
    <div>
      <h1>Hello, {profile?.displayName}!</h1>
    </div>
  );
}
```

### ส่งข้อความ

```typescript
import { sendMessages } from '@/lib/liff';

const handleSend = async () => {
  await sendMessages([
    {
      type: 'text',
      text: 'Hello from LIFF!',
    },
  ]);
};
```

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📚 Resources

- [LINE LIFF Documentation](https://developers.line.biz/en/docs/liff/)
- [Next.js Documentation](https://nextjs.org/docs)
- [LINE Developers Console](https://developers.line.biz/console/)

## 🐛 Troubleshooting

### "LIFF ID is not configured"

- ตรวจสอบว่าได้สร้างไฟล์ `.env.local` แล้ว
- ตรวจสอบว่า `NEXT_PUBLIC_LIFF_ID` ถูกต้อง

### "Failed to initialize LIFF"

- ตรวจสอบว่า LIFF ID ถูกต้อง
- ตรวจสอบว่า Endpoint URL ใน LIFF Console ตรงกับ URL ที่กำลังใช้งาน

### ฟีเจอร์บางอย่างใช้งานไม่ได้

- ฟีเจอร์บางอย่าง (send messages, close window) ใช้งานได้เฉพาะเมื่อเปิดใน LINE App เท่านั้น
- ตรวจสอบด้วย `liffObject?.isInClient()`

## 📝 License

MIT

---

Made with ❤️ using Next.js and LINE LIFF
