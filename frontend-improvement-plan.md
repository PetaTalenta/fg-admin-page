# Rencana Perbaikan Frontend: Schools Management & Enhanced Users

**Tanggal**: 17 Oktober 2025  
**Proyek**: FG Admin Dashboard (Next.js)  
**Versi**: 1.0.0

---

## 📋 Executive Summary

Berdasarkan laporan implementasi backend "Admin Service### **Estimasi Waktu Total**: 28-39 jam (2-3 hari kerja untuk developer handal)

### **Prioritas Tinggi** (1 hari):
- ✅ **Testing cURL**: Test semua endpoint users/schools sebelum implementasi
- **Fase 1: Types, Hooks & UI Users** (10-14 jam)
- Test integrasi dengan backend

### **Prioritas Tinggi** (1-2 hari):
- ✅ **Testing cURL**: Test endpoint schools jika diimplementasikan
- **Fase 2: Schools Management, Edit School & Testing** (18-25 jam)
- Final testing dan optimizationsers dan Schools Management", frontend admin dashboard perlu diperbarui untuk mendukung fitur schools management dan menampilkan school data di users. Perbaikan ini meliputi update komponen, hooks, types, dan penambahan page schools untuk konsistensi dengan backend yang telah diperbarui.

### ⏱️ **Estimasi Waktu Total**: 28-39 jam (2-3 hari kerja untuk developer handal)
- **Fase 1**: 10-14 jam (Types, Hooks & UI Users)
- **Fase 2**: 18-25 jam (Schools Management, Edit School & Testing)

### 🎯 Tujuan Perbaikan:
- ✅ Menampilkan school data di list dan detail users
- ✅ Menambahkan fitur CRUD schools (jika diperlukan)
- ✅ Mendukung filter users by school_id
- ✅ **Fitur edit school di detail user page**
- ✅ Sinkronisasi frontend dengan backend API terbaru
- ✅ **Testing cURL setiap endpoint sebelum implementasi**
- ✅ **Reporting progress setiap fase dengan mark checklist**

---

## 🔍 Analisis Perubahan Backend

### Endpoint yang Diperbarui:

| Method | Endpoint | Perubahan | Dampak Frontend |
|--------|----------|-----------|-----------------|
| GET | `/admin/users` | ✨ Include school data, ✨ Filter by `school_id` | Update tabel users, tambah kolom school |
| GET | `/admin/users/:id` | ✨ Include school data di profile | Update detail user page |
| GET | `/admin/schools` | 🆕 Endpoint baru - List schools | Page schools baru (opsional) |
| GET | `/admin/schools/:id` | 🆕 Endpoint baru - Detail school | Detail school page (opsional) |
| POST | `/admin/schools` | 🆕 Endpoint baru - Create school | Form create school (opsional) |
| PUT | `/admin/schools/:id` | 🆕 Endpoint baru - Update school | Form edit school (opsional) |
| DELETE | `/admin/schools/:id` | 🆕 Endpoint baru - Delete school | Delete action (opsional) |

### Struktur Data Baru:
```typescript
// School data sekarang include di User profile
interface School {
  id: number;
  name: string;
  address?: string;
  city?: string;
  province?: string;
  created_at: string;
}

// User profile sekarang include school
interface UserProfile {
  // ... existing fields
  school_id?: number;
  school?: School;
}
```

---

## 🎯 Komponen Frontend Terpengaruh

### 1. **Types** (`src/types/`)
- `user.ts` - Perlu tambah `School` interface dan update `UserProfile`
- Mungkin perlu `school.ts` baru untuk types schools

### 2. **Hooks** (`src/hooks/`)
- `useUsers.ts` - Update untuk include school data dan support filter `school_id`
- `useUserDetail.ts` - Update untuk include school data di profile
- **Baru**: `useSchools.ts`, `useSchoolDetail.ts` (jika ada page schools)

### 3. **Pages** (`src/app/(dashboard)/`)
- `users/page.tsx` - Update tabel untuk tampilkan kolom school
- `users/[id]/page.tsx` - Update detail untuk tampilkan school info **dan edit school dropdown**
- **Baru**: `schools/page.tsx`, `schools/[id]/page.tsx` (jika diperlukan)

### 4. **Komponen** (`src/components/`)
- Tabel users - Tambah kolom "School"
- Detail user - Tambah section school info
- **Baru**: Komponen schools management (jika diperlukan)

### 5. **Navigasi** (`src/components/layout/`)
- `Sidebar.tsx` - Tambah menu "Schools" jika ada page schools

---

## ❓ Mengapa Harus Diperbaiki?

### Masalah Saat Ini:
1. **Data School Tidak Ditampilkan**: Users list dan detail tidak menampilkan informasi school yang sekarang tersedia dari backend
2. **Filter Tidak Tersedia**: Tidak ada cara untuk filter users berdasarkan school
3. **Fitur Schools Hilang**: Tidak ada interface untuk manage schools (list, create, update, delete)
4. **Inconsistency**: Frontend tidak sesuai dengan backend API terbaru

### Dampak Bisnis:
- Admin tidak bisa melihat school affiliation users
- Sulit mengelola data schools
- Dashboard tidak lengkap dan tidak user-friendly
- Potensi confusion karena data tidak sinkron

### Manfaat Perbaikan:
- **Complete Data View**: Admin dapat melihat school setiap user
- **Better Management**: CRUD schools untuk data maintenance
- **Advanced Filtering**: Filter users by school untuk analisis
- **Consistency**: Frontend-backend alignment untuk reliability

---

## 🛠️ Rencana Implementasi Detail

### Fase 1: Types, Hooks & UI Users (Prioritas Tinggi) - **10-14 jam**
**Pre-Implementation**: Testing cURL endpoint `/admin/users` dan `/admin/users/:id` untuk memastikan school data tersedia.

1. **Update Types & Hooks** (4-6 jam):
   - Update `src/types/user.ts`: Tambah interface `School`, update `UserProfile`
   - Update `src/hooks/useUsers.ts`: Include school data dan filter `school_id`
   - Update `src/hooks/useUserDetail.ts`: Include school data di profile

2. **Update Komponen Users** (6-8 jam):
   - Update `src/app/(dashboard)/users/page.tsx`: Tambah kolom school di tabel, filter dropdown
   - Update `src/app/(dashboard)/users/[id]/page.tsx`: Tambah section school info
   - Testing UI changes dan integrasi

### Fase 2: Schools Management, Edit School & Testing (Prioritas Tinggi) - **18-25 jam**
**Pre-Implementation**: Testing cURL semua endpoint schools (`/admin/schools`, `/admin/schools/:id`, POST/PUT/DELETE).

1. **Implementasi Schools Management** (12-16 jam):
   - Buat `src/types/school.ts`: Interface untuk School dan responses
   - Buat hooks schools: `useSchools.ts`, `useSchoolDetail.ts`, CRUD hooks
   - Buat pages schools: List dan detail dengan tabel dan forms
   - Update navigasi: Tambah menu "Schools" di sidebar

2. **Fitur Edit School di Detail User** (2-3 jam):
   - Tambah dropdown school selector di `users/[id]/page.tsx`
   - Implementasi update user profile dengan school_id baru
   - Validasi dan error handling untuk school changes

3. **Testing & Optimization** (4-6 jam):
   - Integration testing: Test semua CRUD operations dan edit school
   - UI/UX improvements: Responsive design, loading states, error handling
   - Performance optimization: Caching, lazy loading
   - **Build Testing**: Jalankan `npm run build` untuk memastikan tidak ada build errors
   - Final testing dan bug fixes

---

## 🧪 Testing Endpoint dengan cURL

**Instruksi Penting**: Sebelum mengimplementasikan fetching API di frontend, lakukan testing endpoint dengan cURL untuk memastikan backend berfungsi dengan benar dan response format sesuai ekspektasi.

### Persiapan Testing:
1. Pastikan backend admin service running di production (api.futureguide.id)
2. Dapatkan admin token dari endpoint login: `email: admin@futureguide.id, password: admin123`
3. Ganti `YOUR_ADMIN_TOKEN` dengan token yang didapat

### Endpoint Users:
```bash
# Test GET /admin/users dengan school data
curl -X GET "https://api.futureguide.id/admin/users?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Test GET /admin/users dengan filter school_id
curl -X GET "https://api.futureguide.id/admin/users?page=1&limit=5&school_id=1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Test GET /admin/users/:id dengan school data
curl -X GET "https://api.futureguide.id/admin/users/ff55968b-1e62-43ef-b93d-6da70e5c7029" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Endpoint Schools (jika diimplementasikan):
```bash
# Test GET /admin/schools
curl -X GET "https://api.futureguide.id/admin/schools?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Test GET /admin/schools/:id
curl -X GET "https://api.futureguide.id/admin/schools/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Test POST /admin/schools (create)
curl -X POST "https://api.futureguide.id/admin/schools" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SMA Test Baru",
    "address": "Jl. Test No. 123",
    "city": "Jakarta",
    "province": "DKI Jakarta"
  }'
```

**Expected Response Format**: Pastikan response sesuai dengan contoh di `admin-enhanced-implementation-report.md`. Jika ada perbedaan, koordinasikan dengan backend team.

**Catatan Base URL**: Menggunakan production URL `api.futureguide.id` karena development sudah selesai dan backend deployed.

---

## 📚 Sumber Informasi Akurat

### 1. **Instruksi Agen** - `.github/copilot-instructions.md`
- **Lokasi**: `/home/rayin/Desktop/fg-admin-page/.github/copilot-instructions.md`
- **Mengapa Penting**: Panduan arsitektur proyek, pola implementasi, alias path
- **Cara Penggunaan**:
  - Section "Arsitektur Komponen" untuk pola komponen page
  - Section "Alias Path" untuk import paths yang benar
  - Section "Pola Styling" untuk konsistensi UI

### 2. **Laporan Backend** - `admin-enhanced-implementation-report.md`
- **Lokasi**: `/home/rayin/Desktop/fg-admin-page/admin-enhanced-implementation-report.md`
- **Mengapa Penting**: Detail perubahan backend dan contoh response
- **Cara Penggunaan**:
  - Section "Hasil Testing dengan cURL" untuk contoh API responses
  - Section "Ringkasan Endpoint" untuk overview perubahan
  - Section "Cara Penggunaan" untuk authentication dan examples

### 3. **Kode Frontend Existing** - `src/`
- **Lokasi**: `/home/rayin/Desktop/fg-admin-page/src/`
- **Mengapa Penting**: Konsistensi pola implementasi
- **Cara Penggunaan**:
  - `hooks/` - Lihat pola hooks seperti `useUsers.ts` untuk konsistensi
  - `types/` - Lihat struktur types existing
  - `components/dashboard/` - Lihat pola komponen tabel dan cards
  - `app/(dashboard)/users/` - Template untuk implementasi schools

### 4. **Konfigurasi Proyek**
- `package.json` - Dependencies dan scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Styling configuration

**Catatan**: `docs/ADMIN_SERVICE_API_DOCUMENTATION.md` belum diupdate dengan perubahan terbaru, jadi gunakan laporan backend sebagai referensi utama untuk spesifikasi API.

---

## ⏰ Timeline & Prioritas

### **Estimasi Waktu Total**: 26-36 jam (2-3 hari kerja untuk developer handal)

### **Prioritas Tinggi** (1 hari):
- ✅ **Testing cURL**: Test semua endpoint users/schools sebelum implementasi
- **Fase 1: Types, Hooks & UI Users** (10-14 jam)
- Test integrasi dengan backend

### **Prioritas Tinggi** (1-2 hari):
- ✅ **Testing cURL**: Test endpoint schools jika diimplementasikan
- **Fase 2: Schools Management & Testing** (16-22 jam)
- Final testing dan optimization

### **Breakdown Estimasi per Fase**:

#### **Fase 1: Types, Hooks & UI Users** (10-14 jam)
- Testing cURL endpoint users: 30-60 min
- Update types & hooks: 4-6 jam
- Update UI komponen users: 6-8 jam
- Testing integrasi: 30-60 min

#### **Fase 2: Schools Management, Edit School & Testing** (18-25 jam)
- Testing cURL endpoint schools: 30-60 min
- Implementasi schools management: 12-16 jam
- Fitur edit school di detail user: 2-3 jam
- Testing & optimization: 4-6 jam

### **Faktor yang Mempengaruhi Durasi**:
- **Testing cURL**: Wajib dilakukan sebelum setiap fase (30-60 min per fase)
- **Debugging**: 20-30% dari total waktu untuk fix issues
- **Koordinasi Tim**: Diskusi dengan backend team jika ada perubahan API
- **Code Review**: Review internal sebelum merge
- **Environment Setup**: Setup local environment dengan data schools
- **Learning Curve**: Jika ada teknologi baru yang perlu dipelajari

### **Dependencies**:
- Harus selesai setelah backend deployment
- Perlu akses ke environment dengan data schools
- Koordinasi dengan backend team untuk API changes
- **Wajib**: Testing cURL setiap endpoint sebelum implementasi fetching

---

## ✅ Kriteria Kesuksesan

- [ ] **Fase 1 Complete**: Types & hooks updated dengan school data
- [ ] **Fase 1 Complete**: UI users menampilkan school data dan filter
- [ ] **Fase 2 Complete**: CRUD schools tersedia dan berfungsi
- [ ] **Fase 2 Complete**: Fitur edit school di detail user berfungsi
- [ ] **Fase 2 Complete**: Tidak ada error console terkait API calls
- [ ] **Fase 2 Complete**: UI responsive dan konsisten dengan design system
- [ ] **Fase 2 Complete**: Performance optimal dengan caching

---

## 📝 Reporting per Fase

**Instruksi**: Setelah menyelesaikan setiap fase, beri mark ✅ pada checklist di atas dan buat laporan progress dengan format berikut. Simpan laporan sebagai file terpisah (contoh: `phase1-completion-report.md`).

### Template Laporan Fase

```
# Laporan Progress: [Nama Fase]

**Tanggal**: [Tanggal selesai]
**Fase**: [Nomor dan nama fase]
**Status**: ✅ COMPLETED / ❌ FAILED / ⏳ IN PROGRESS

## 🎯 Tujuan Fase
[Deskripsi singkat tujuan fase]

## ✅ Yang Telah Diselesaikan
- [x] Task 1 - [Deskripsi detail]
- [x] Task 2 - [Deskripsi detail]
- [x] Task 3 - [Deskripsi detail]

## 🧪 Testing yang Dilakukan
- [x] cURL testing endpoint sebelum implementasi
- [x] Unit testing komponen baru
- [x] Integration testing dengan backend
- [x] UI/UX testing

## 🔧 Perubahan Kode
- **Files Modified**: `src/types/user.ts`, `src/hooks/useUsers.ts`, dll.
- **Files Added**: `src/types/school.ts`, dll.
- **Key Changes**: [Deskripsi perubahan utama]

## 🚨 Issues & Blocker
- [Jika ada] Deskripsi issue dan solusi yang diterapkan

## 📊 Metrics
- **API Response Time**: [rata-rata ms]
- **Bundle Size Impact**: [+/- KB]
- **Test Coverage**: [% jika ada]

## 🎉 Next Steps
[Langkah berikutnya atau fase selanjutnya yang akan dikerjakan]
```

### Contoh Implementasi:
- **Fase 1 Selesai** → Buat `phase1-completion-report.md`
- **Fase 2 Selesai** → Buat `phase2-completion-report.md`
- **Semua Fase Selesai** → Buat `frontend-improvement-final-report.md`

---

## 🚀 Langkah Selanjutnya

1. **Testing Awal**: Jalankan testing cURL untuk semua endpoint yang akan digunakan (production: api.futureguide.id)
2. **Kickoff Fase 1**: Mulai implementasi Types, Hooks & UI Users setelah testing cURL berhasil
3. **Fase 2**: Implementasi Schools Management, Edit School & Testing setelah Fase 1 selesai
4. **Reporting**: Buat laporan setiap fase selesai menggunakan template yang disediakan.
5. **Testing**: Integrasi testing dengan backend setiap fase
6. **Build Verification**: Jalankan `npm run build` di akhir Fase 2 untuk memastikan production readiness
7. **Deployment**: Rollout setelah semua fase selesai dan testing final

---

## ⚠️ Catatan Estimasi Waktu

**Estimasi di atas untuk developer handal** yang sudah familiar dengan Next.js, TypeScript, dan React Query. Durasi aktual dapat bervariasi tergantung pada:

- **Tingkat pengalaman developer**: Developer handal vs Senior developer
- **Kompleksitas issues yang ditemukan**: Bug fixing dan debugging
- **Perubahan requirement**: Jika ada perubahan dari backend atau business requirements
- **Environment issues**: Setup local environment, dependencies conflicts
- **Code review process**: Waktu untuk review dan feedback
- **Testing thoroughness**: Coverage testing yang lebih mendalam

**Rekomendasi**: 
- Alokasikan buffer time 20-30% untuk handling unexpected issues
- Lakukan daily standup untuk monitoring progress
- Siapkan contingency plan jika ada blocker dari backend atau environment
- **Wajib**: Jalankan `npm run build` sebelum deployment untuk memastikan production readiness

---
