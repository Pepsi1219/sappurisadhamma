# สัปปุริสธรรม 7 ประการ · สื่อการเรียนรู้สำหรับครู

เว็บไซต์ immersive scrollytelling สำหรับนำเสนอและใช้บรรยาย

## วิธีเปิดใช้งาน

เปิดไฟล์ `index.html` ด้วยเบราว์เซอร์สมัยใหม่ (Chrome / Edge / Safari / Firefox)  
หรือรัน local server เช่น:

```bash
cd sappurisadhamma
npx serve .
# หรือ
python3 -m http.server 8080
```

## Design System (สรุป)

### Typography
- Font: Sarabun (Thai-friendly rounded sans)
- Scale: Fluid clamp จาก caption → hero

### Color
- Deep background + warm soft gold accent
- Glass surfaces ด้วย backdrop-filter
- Negative space กว้างเพื่อความสง่างาม

### Motion
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo)
- Duration: 0.28s / 0.55s / 0.9s
- Parallax ambient orbs เบาๆ
- Reveal ด้วย IntersectionObserver

### Navigation
- Spatial dots ด้านขวา (มี label บน desktop)
- Guidance light ด้านล่าง
- Progress bar ด้านบน
- ไม่มี navbar แบบเดิม

## โครงสร้างเนื้อหา
1. Hero
2. ภาพรวมสัปปุริสธรรม
3–9. หลัก 7 ประการ + การปรับใช้กับวิชาชีพครู
10. สรุป & คำคม

## Performance notes
- ไม่มี library หนัก (vanilla JS)
- Lazy feel ผ่าน opacity/transform
- `prefers-reduced-motion` รองรับ
- Backdrop-filter อาจลดลงบน mobile อัตโนมัติตาม device

สร้างด้วยใจ · สำหรับใช้บรรยายและเรียนรู้