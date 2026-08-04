# สัปปุริสธรรม 7 ประการ — Interactive Learning Site

สื่อการเรียนรู้แบบ immersive scrollytelling สำหรับใช้บรรยาย/นำเสนอเรื่อง **สัปปุริสธรรม 7 ประการ** ในบริบท **วิชาชีพครู**  
กลุ่มเป้าหมาย: ผู้ฟังบรรยาย (ครู/นักศึกษาครู) — ไม่มีระบบสมาชิก ไม่มี login ทุกอย่างเปิดใช้ทันที

---

## Stack & Philosophy

- **Vanilla HTML/CSS/JS** ล้วน (ไม่ใช้ framework, ไม่มี build step, ไม่มี npm dependency)
- **เหตุผล**: โปรเจ็คเป็น presentation site หน้าเดียว — ต้องเปิดเร็ว, deploy ง่าย, ไม่มี runtime overhead
- **อย่าเพิ่ม** React / Vue / bundler / package.json โดยไม่จำเป็น — ถ้าจำเป็นต้องใช้ (เช่น Three.js, GSAP) ให้โหลดผ่าน CDN + defer
- Font: `Sarabun` จาก Google Fonts (Thai-friendly rounded sans)

## รันโปรเจ็ค

เปิด `index.html` ตรงๆ ได้ หรือ:
```bash
npx serve .
# หรือ
python -m http.server 8080
```

## โครงสร้างไฟล์

```
index.html              — 10 sections: hero → intro → p1..p7 → closing
css/design-tokens.css   — ทุก token (color/type/space/motion) อยู่ที่นี่
css/main.css            — @import tokens + styles ทั้งหมด
js/main.js              — IIFE เดียว: progress, dots, reveal, parallax
assets/                 — ว่าง (ยังไม่มีรูป/วิดีโอ)
```

## Design System (สรุปสิ่งที่ยึด)

### สี (Depth + Warm Gold)
- Background: `--bg-deep #0B0F14` → mid → soft (มืดลึก, ไม่ดำสนิท)
- Accent หลัก: `--accent #C9A87C` (warm soft gold) — ใช้สำหรับ CTA, active state, gradient เส้น
- Accent รอง: `--teal-mist #7EB8A8` — ใช้กับ label "สำหรับครู" เพื่อแยก visual
- Glass surfaces: `rgba(255,255,255,0.06)` + `backdrop-filter: blur(20px)`

### Typography
- Fluid scale ด้วย `clamp()`: `--fs-hero` (2.8–5.2rem) → `--fs-caption` (0.85rem)
- Weight: 300 (display), 400 (body), 500 (emphasis) — **หลีกเลี่ยง 700+** ให้รู้สึกเบา สง่างาม
- letter-spacing ติดลบเล็กน้อยที่ heading ใหญ่ (`-0.02em`)

### Motion — **หัวใจของโปรเจ็ค**
> ผู้ใช้เน้นย้ำว่า **"Timing" และ "Easing" สำคัญที่สุด** เพื่อไม่ให้รู้สึกเหมือน AI ทำ
- Easing หลัก: `--ease-out-expo cubic-bezier(0.16, 1, 0.3, 1)` — ใช้เกือบทุกอย่าง
- Duration: 0.28s (micro) / 0.55s (interaction) / 0.9s (reveal)
- Hero entrance: stagger 160ms ระหว่าง element
- Reveal delay 80ms หลัง intersect เพื่อความ organic
- **ห้าม** animation ที่ bouncy หรือ linear แข็งๆ

### Navigation Pattern
- **ไม่มี navbar แบบเดิม** (Home/About/…)
- Spatial dots ด้านขวา + label popup on active/hover
- **Fixed pager** กลางล่างจอ (`.pager` / `#pager`) — ปุ่ม "ย้อนกลับ / ถัดไป" ลอยอยู่เสมอ กดได้โดยไม่ต้องเลื่อนหาปุ่ม, section สุดท้าย next กลายเป็น "กลับไปหน้าแรก" (class `.is-home`). ควบคุมแบบ dynamic ใน `main.js` ผ่าน `updatePager()` (เรียกเฉพาะตอน active section เปลี่ยน)
- Guidance light ล่างกลาง (`.guidance-line`) — โชว์เฉพาะ hero, หายเมื่อเลื่อน > 80px (สลับกับ pager)
- Progress bar บนสุด 2px gradient accent → teal
- **Keyboard nav**: `←/→` (และ PageUp/Down) กระโดดทีละ section — เหมาะกับการบรรยาย
- Scroll behavior: native `scroll-behavior: smooth` + `scroll-snap-type: y proximity` (section = `scroll-snap-align: start`) ให้ feel เลื่อนทีละ section แต่ยังไม่ trap ผู้ใช้ — **ไม่ทำ scroll-jacking แข็งๆ** เพื่อ a11y
- **หลักการวางปุ่มนำทาง**: ห้ามฝังปุ่มไว้ท้ายเนื้อหาใน flow ของ section (เนื้อหายาวแล้วปุ่มหลุดใต้จอ) — ให้ใช้ fixed pager เท่านั้น

## กฎการเพิ่ม/แก้เนื้อหา

1. **แต่ละหลักธรรม** ใช้ pattern เดียวกัน: `.principle` card ที่มี `__number`, `__name` (strong = ชื่อบาลี), `__meaning`, `__body` + `.apply-card` (มี label, text, `<ul>`)
2. ถ้าเพิ่ม section ใหม่ ต้อง:
   - ใส่ `id="xxx"` + `data-section` บน `<section>`
   - เพิ่ม `<button class="spatial-nav__dot" data-target="xxx" data-label="..." aria-label="...">` ใน `.spatial-nav`
   - ใส่ `.reveal` บน element ที่ต้องการให้ fade-in ตอน scroll
3. ข้อความบรรยาย: **ภาษาไทย** เป็นหลัก, tone อบอุ่น-ให้กำลังใจ-ไม่แข็ง (ห้ามใช้ภาษาราชการ/AI voice)

## สิ่งที่ต้องรักษาไว้เสมอ

- `prefers-reduced-motion`: ปิด animation ทั้งหมด และให้ทุก `.reveal` เห็นทันที (มี handling แล้วใน `main.js:152-160`)
- `overflow-x: hidden` บน body — orb parallax ห้ามทำ horizontal scroll
- `will-change: transform` เฉพาะ orb เท่านั้น (อย่าใส่พร่ำเพรื่อ)
- Focus ring: `:focus-visible` outline accent — ห้ามลบ
- Mobile (< 768px): ซ่อน label ของ dot, ลด padding, guidance line เตี้ยลง

## Roadmap / งานที่อาจเพิ่มในอนาคต

ผู้ใช้ระบุ vision ระดับ Apple/Vision Pro ในโจทย์เดิม — สิ่งที่ยังไม่ได้ทำและอาจต่อยอด:
- 3D layer (Three.js) เบาๆ ในฉาก hero — ต้อง lazy-load + fallback บน mobile
- Lottie / SVG morph transitions ระหว่าง section
- Cinematic parallax ที่ซับซ้อนขึ้น (ปัจจุบันมีแค่ orb 3 ลูก)
- Soft scroll-snap แบบนุ่มนวลตอนหยุดเลื่อน
- Presentation mode (keyboard `←/→` เพื่อกระโดด section) — เหมาะกับใช้บรรยาย

**ก่อนเพิ่มของหนักๆ**: ต้องคง 60fps, ไม่ทำให้ initial load > 1s, และรักษา mood/vibe เดิมบน mobile

## การทำงาน

- **ห้าม preview / รัน dev server / screenshot** — ผู้ใช้ทดสอบเอง ให้โฟกัสที่การเขียนโค้ดและคุณภาพของโค้ดเท่านั้น
- **Push ได้เลย** โดยไม่ต้องถามก่อน ยกเว้นถูกสั่งห้ามไว้ชัดเจน

## Git

- Branch หลัก: `main`
- Remote: https://github.com/Pepsi1219/sappurisadhamma
- ยังไม่มี CI / test / lint — ถ้าเพิ่ม ให้ discuss ก่อน
