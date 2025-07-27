# Kanban Board 

ระบบ Kanban อย่างง่าย พัฒนาด้วย **Nuxt 3**, **Pinia**, และ **TypeScript**


## การติดตั้งและเริ่มใช้งาน

ติดตั้ง dependencies และรันเซิร์ฟเวอร์สำหรับพัฒนา (เปิดที่ http://localhost:3000) ด้วยคำสั่งต่อไปนี้:

```bash
npm install
npm run dev
```


## ข้อมูลผู้ใช้ตัวอย่าง (Mock Users)

```ts
export const users = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@gmail.com',
    password: '1234',
  },
  {
    id: 2,
    username: 'user2',
    email: 'user2@gmail.com',
    password: '1234',
  },
];
```



## ข้อมูลสำหรับทดลองใช้งาน

- **username:** user1  
- **password:** 1234


---

## ภาพรวมส่วนติดต่อผู้ใช้ (User Interface)

ภาพรวมของหน้าจอการใช้งานหลักในระบบ

### หน้าเข้าสู่ระบบ 
หน้าจอสำหรับผู้ใช้ที่มีบัญชีอยู่แล้ว โดยมีข้อมูลตัวอย่างดังนี้:
- **username:** user1  
- **password:** 1234
หลังจากนั้นทำการ กดปุ่ม login เพื่อเข้าสู่ระบบ
![Login Page](https://github.com/user-attachments/assets/f86ce9f4-6a79-43fb-92c6-4f355896d4e3)

---

### Register Page  
หน้าจอสำหรับลงทะเบียนผู้ใช้ใหม่ ผู้ใช้ต้องกรอกข้อมูลดังนี้:
- Username
- Email
- Password
- ยืนยัน Password
  
หลังจากนั้นทำการ กดปุ่ม register เพื่อลงทะเบียนและเข้าสู่ระบบ
![Register Page](https://github.com/user-attachments/assets/37639e99-e8d8-4f19-bfa6-5244c1ccf302)

---

### Kanban Board  
แสดงบอร์ดโปรเจกต์ พร้อมคอลัมน์และงานภายใน  
![Kanban Board](https://github.com/user-attachments/assets/f2e7f5a1-0f89-48ba-912c-cb47e1a335ed)

---

### สร้างบอร์ดใหม่
หน้าจอสำหรับสร้างบอร์ดใหม่และกำหนดสมาชิกในทีม
![Create Board](https://github.com/user-attachments/assets/5a11e2bc-2d83-4c61-a1e7-25d649e97910)  


---

### เพิ่มคอลัมน์ 
เพิ่มคอลัมน์ในบอร์ด เช่น "To Do", "In Progress", "Done"  
![Add Column](https://github.com/user-attachments/assets/e4a98656-9274-406c-9f2a-617b1155837d)

---

### สร้าง Task ใหม่   
เพิ่ม task ใหม่ในคอลัมน์  พร้อมกำหนดผู้รับผิดชอบและเพิ่มแท็กเพื่อระบุหมวดหมู่ เช่น UI, Backend,
![Add Task](https://github.com/user-attachments/assets/713c1f78-f35d-4276-85cc-71590c07bcba)

---

### มอบหมายผู้รับผิดชอบ 
กำหนดผู้รับผิดชอบงานแต่ละ Task สามารถเลือกสมาชิกในทีมเพื่อมอบหมายงานได้
![Assign Members](https://github.com/user-attachments/assets/a06ac53b-1ea9-4f3c-bffa-b0cc206e844d)

---

### เพิ่ม tag ในงาน
เพิ่มแท็กให้กับงาน เพื่อช่วยในการจัดหมวดหมู่ เช่น UI, Backend, Bug
![Add Tags](https://github.com/user-attachments/assets/b287ecd8-4e19-4c36-893e-f989f821963b)  



### แก้ไขและลบคอลัมน์ (Edit & Delete Columns)
ทุกคอลัมน์จะมีเมนูให้เลือกที่มุมขวาบน (ไอคอนจุด 3 จุด) ซึ่งเมื่อคลิกจะมีตัวเลือกให้ แก้ไข กับ ลบ


<img width="1896" height="919" alt="image" src="https://github.com/user-attachments/assets/df7821af-debd-47ea-b673-5d8136a39bfe" />

### สามารถแก้ไขชื่อคอลัมน์ได้
เมื่อกดที่เมนู edit เพื่อเปลี่ยนชื่อคอลัมน์
<img width="1887" height="915" alt="image" src="https://github.com/user-attachments/assets/55a7c8b7-ae9e-459e-beaa-51c7999d1e53" />

### สามารถลบคอลัมน์ที่ไม่ต้องการได้
เมื่อคลิกที่เมนู delete  เพื่อลบคอลัมน์ที่ไม่ต้องการออกจากบอร์ด
<img width="1887" height="916" alt="image" src="https://github.com/user-attachments/assets/92852654-7a8b-4b30-b890-06889c55edc3" />


### แก้ไขและลบงาน (Edit & Delete Tasks)
เมื่อเอาเมาส์ไปชี้ที่กล่องงาน (Task) จะปรากฏไอคอนสำหรับ แก้ไข และ ลบ
<img width="1900" height="922" alt="image" src="https://github.com/user-attachments/assets/14c73e92-3ba9-4921-ac6a-05c67bd21f4a" />

### สามารถแก้ไข task ได้
แก้ไขรายละเอียดงานได้ เช่น ชื่อ task, ผู้รับผิดชอบ, แท็ก
<img width="1895" height="916" alt="image" src="https://github.com/user-attachments/assets/4833a879-1211-4802-8ba0-a03e1300b237" />
### สามารถลบ task ได้
ลบงานที่ไม่ต้องการได้
<img width="1899" height="922" alt="image" src="https://github.com/user-attachments/assets/c82e9426-790e-4c07-aed1-3c7bcff458e3" />



###  การแก้ไขและลบบอร์ด (Edit & Delete Boards)
จะมีเมนูให้เลือกระหว่าง แก้ไขและลบ
<img width="1899" height="922" alt="image" src="https://github.com/user-attachments/assets/551416a9-f846-4f4d-9b4d-2a16220a3fa8" />

### สามารถแก้ไขชื่อบอร์ดและสมาชิกได้
สามารถเปลี่ยนชื่อบอร์ดและจัดการสมาชิกในทีมได้ เพื่อให้บอร์ดสอดคล้องกับความต้องการของโปรเจกต์
<img width="1892" height="920" alt="image" src="https://github.com/user-attachments/assets/9e318b00-56d8-4094-b7a2-120e8407dfba" />


### สามารถลบบอร์ดที่ไม่ต้องการได้
ลบบอร์ดที่ไม่ต้องการได้
<img width="1892" height="925" alt="image" src="https://github.com/user-attachments/assets/e72ceea6-778a-46eb-9ccf-5185a382a83a" />




### ฟีเจอร์ลากและวาง
รองรับการลากและวางเพื่อเปลี่ยนตำแหน่งงานในแต่ละคอลัมน์ 
<img width="1900" height="921" alt="image" src="https://github.com/user-attachments/assets/cab6d62f-3858-4adf-b3d6-a375b0a243ea" />





---

## Summary

- ระบบล็อกอินและลงทะเบียนผู้ใช้  
- สร้างและจัดการบอร์ดงานได้
- เพิ่ม ลบ แก้ไข คอลัมน์ และงานภายในบอร์ด  
- มอบหมายผู้รับผิดชอบและแท็กให้กับงานแต่ละชิ้น  
- รองรับการลากและวางงานได้

---



















