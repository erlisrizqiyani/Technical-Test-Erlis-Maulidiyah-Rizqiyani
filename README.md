## Waktu Pengerjaan

Tanggal mulai : 19.00 WIB 19 Februari 2026

Tanggal selesai: 01.00 WIB 20 Februari 2026

Estimasi fokus pengerjaan: ± 6 jam

## Candidate
Erlis Maulidiyah Rizqiyani
Frontend Developer Candidate


# E-Commerce Paket Data Internet

Prototype website e-commerce pembelian paket data internet berbasis ReactJS + json-server sebagai mock backend.

# Fitur Utama

## Authentication

* Login customer
* Session disimpan di localStorage
* Protected routes

## Katalog Paket Data

* Menampilkan paket dari mock API
* Search global (filter by name/provider/quota)
* Tampilan card modern & responsive

## Checkout

* Input nomor HP tujuan
* Validasi nomor (format 08xxxxxxxx)
* Cek saldo sebelum transaksi
* Simulasi pembayaran saldo

## Top Up Saldo

* Customer bisa menambah saldo
* Update balance ke backend
* Saldo langsung ter-refresh

## Riwayat Transaksi

* Menampilkan transaksi berdasarkan customer login
* Filter berdasarkan status
* Menampilkan nomor tujuan & waktu transaksi

---

# 🖼 Screenshot

## 🔐 Login Page

<img width="1901" height="921" alt="image" src="https://github.com/user-attachments/assets/0f623087-4765-4a1d-9f23-7055d6fbcee0" />

---

## 🏠 Home / Katalog

<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/72c07762-1d9a-416c-b0d8-620daabce871" />

---

## 💳 Checkout Modal

<img width="824" height="654" alt="image" src="https://github.com/user-attachments/assets/f13e4c9a-e142-4753-b0c3-bf10e337a701" />

---

## 💰 Top Up Saldo

<img width="605" height="465" alt="image" src="https://github.com/user-attachments/assets/d5e0b3e3-e59e-4edd-be8e-770577921793" />

---

## 📜 Transaksi

<img width="1917" height="893" alt="image" src="https://github.com/user-attachments/assets/26b88573-0435-47c0-b0a3-10cb65814926" />

---

# ⚙️ Cara Menjalankan Project

## 1️⃣ Clone Project

```bash
git clone <repo-url>
cd ecommerce-paketdata
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Jalankan Mock API (json-server)

Install json-server jika belum:

```bash
npm install -g json-server
```

Lalu jalankan:

```bash
json-server --watch db.json --port 3001
```

Backend akan berjalan di:

```
http://localhost:3001
```

---

## 4️⃣ Jalankan Frontend

```bash
npm run dev
```

Frontend akan berjalan di:

```
http://localhost:5173
```

(atau port lain sesuai Vite)

---

# 👤 Akun Demo

```json
{
  "email": "erlis@mail.com",
  "password": "erlis"
}
```

Atau:

```json
{
  "email": "rizqiyani@mail.com",
  "password": "rizqiyani"
}
```

---

# 🗂 Struktur Folder

```
src/
│
├── app/
├── components/
├── context/
├── pages/
├── services/
├── utils/
│
db.json
```

---

# 📌 Simulasi Data (db.json)

Data utama terdiri dari:

* customers
* packages
* transactions

Semua operasi CRUD dilakukan melalui json-server.

---
