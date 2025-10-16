# Next.js Starter - Instruksi Agen AI
Gubakan port 5000, kalau sudah dipakau berati sudah berjalan programnya

## Gambaran Arsitektur
- **Framework**: Next.js 15 dengan App Router (bukan Pages Router)
- **Bahasa**: TypeScript dengan mode strict diaktifkan
- **Styling**: Tailwind CSS dengan properti CSS kustom untuk tema
- **Linting**: ESLint dengan konfigurasi standar Next.js dan beberapa aturan khusus
- **Build Tool**: Turbopack untuk development, build standar Next.js untuk production

## Alias Path (Kritis)
Selalu gunakan alias ini untuk import - mereka dikonfigurasi di `tsconfig.json` dan `next.config.js`:

```typescript
import { util } from '@/lib/utils'              // ./src/lib/
import styles from '@/styles/globals.css'       // ./src/styles/
import type User from '@/types/user'            // ./src/types/
import { hook } from '@/hooks/useHook'          // ./src/hooks/
```

## Pola Styling
- Gunakan kelas utilitas Tailwind terutama
- Variabel CSS kustom didefinisikan di `:root` untuk warna tema
- Dukungan dark mode melalui media query `prefers-color-scheme`
- Properti CSS kustom: `--background`, `--foreground`

## Arsitektur Komponen
- **Komponen Page**: Tidak suka modularisasi komponen untuk suatu page. Semua komponen yang dibutuhkan oleh suatu page harus didefinisikan langsung di dalam file page tersebut, bukan diimpor dari folder components.
- **Modul Global**: Untuk utils, service, hooks, store, dan modul lainnya, tetap gunakan yang global dan diimpor dari folder yang sesuai (misalnya `@/lib/utils`, `@/hooks/useHook`).

gunakan kredensial ini jika perlu menggunakan endpoint login untuk mendapatkan token admin
email: admin@futureguide.id
password: admin123

## Fitur Proyek - Admin Dashboard

Proyek ini adalah admin dashboard untuk mengelola users, jobs, dan chatbot dengan empat halaman utama:

### 1. Dashboard Awalan
- **Fungsi**: Halaman utama admin dashboard yang menampilkan statistik real-time, trends, dan overview sistem.
- **Statistik Cards Utama** (dari endpoint langsung):
  - Total Jobs - Dari GET /admin/jobs/stats (field total)
  - Jobs Completed - Dari GET /admin/jobs/stats (field completed)
  - Jobs Failed - Dari GET /admin/jobs/stats (field failed)
  - Success Rate - Dari GET /admin/jobs/stats (field successRate)
  - Total Users - Dari GET /admin/system/metrics (field users.total_users)
  - New Users Today - Dari GET /admin/system/metrics (field users.new_users_today)
  - Active Users Today - Dari GET /admin/system/metrics (field users.active_today)
  - Total Conversations - Dari GET /admin/chatbot/stats (field overview.totalConversations)
  - Total Messages - Dari GET /admin/chatbot/stats (field overview.totalMessages)
  - Avg Response Time - Dari GET /admin/chatbot/stats (field performance.avgResponseTimeMs)
  - Total Tokens Used - Dari GET /admin/system/metrics (field chat.total_tokens_used)
- **Trend/Chart** (perlu agregasi):
  - Job Trend Harian - Gunakan GET /admin/jobs dengan filter date_from dan date_to untuk 7-30 hari terakhir, hitung jumlah per hari
  - User Growth Trend - Gunakan GET /admin/users dengan filter created_at untuk periode tertentu, agregasi per hari/minggu
  - Conversation Trend - Dari GET /admin/chatbot/stats untuk today vs historical (perlu multiple calls)
- **Tabel/List**:
  - Recent Job Users (10 terbaru) - Kombinasikan GET /admin/jobs (sort by created_at DESC, limit 10) dengan GET /admin/users/:id untuk detail user
  - Top Models Used - Dari GET /admin/chatbot/models (field models sorted by usageCount)
- **Strategi Caching**: Gunakan React Query dengan staleTime 5 menit dan cacheTime 10 menit. Frontend cek cache terlebih dahulu, jika tidak ada/expired maka fetch ke backend. Ini mengurangi API calls dan meningkatkan performa.
- **Navigasi**: Halaman utama overview; dari sini admin dapat navigasi ke page users, jobs monitoring, atau chatbot untuk detail lebih lanjut.
- **Endpoint yang Dibutuhkan**:
  - GET /admin/jobs/stats (untuk statistik jobs)
  - GET /admin/system/metrics (untuk statistik users dan tokens)
  - GET /admin/chatbot/stats (untuk statistik chatbot)
  - GET /admin/jobs (dengan filter untuk trends)
  - GET /admin/users (dengan filter untuk user growth)
  - GET /admin/users/:id (untuk detail user pada recent jobs)
  - GET /admin/chatbot/models (untuk top models)

### 2. Page Users
- **Fungsi**: Menampilkan list users, detail user, mengatur token user, melihat list jobs dan conversations user.
- **Navigasi**: Klik user → detail user → klik job → detail results → klik conversation → detail chats.
- **Endpoint yang Dibutuhkan**:
  - GET list users (table users)
  - GET detail user (table users, analysis_jobs, conversations)
  - PUT update detail user (table users)
  - PUT update token user (table yang relevan untuk token)
  - GET results detail berdasarkan job_id (table analysis_result, analysis_jobs, users) - digunakan juga di page jobs
  - GET chats detail berdasarkan conversation_id (table conversations, chats, users) - digunakan juga di page chatbot

### 3. Page Jobs Monitoring
- **Fungsi**: Menampilkan statistik jobs (berhasil, processing, failed, total, hari ini), table jobs dengan pagination 50 item per page.
- **Navigasi**: Klik job → detail results untuk job tersebut.
- **Endpoint yang Dibutuhkan**:
  - GET statistik jobs (table jobs)
  - GET table jobs dengan pagination (table jobs)
  - GET results detail berdasarkan job_id (table analysis_result, analysis_jobs, users) - digunakan juga di page users

### 4. Page Chatbot
- **Fungsi**: Menampilkan statistik chatbot (total conversations, total chats, model chatbot), table conversations.
- **Navigasi**: Klik conversation → detail chats.
- **Endpoint yang Dibutuhkan**:
  - GET statistik chatbot (table chatbots, chats, konfigurasi environment docker)
  - GET table conversations (table conversations)
  - GET chats detail berdasarkan conversation_id (table conversations, chats, users) - digunakan juga di page users

### Catatan Pengembangan
- Pastikan semua endpoint menggunakan API routes Next.js di `src/app/api/`.
- Gunakan TypeScript untuk type safety pada data dari database.
- Implementasikan pagination dan loading states untuk performa.
- Pastikan autentikasi dan autorisasi untuk akses admin.

## Referensi API
Selalu mereferensikan `docs/ADMIN_SERVICE_API_DOCUMENTATION.md` ketika mengembangkan atau mengintegrasikan service API. Dokumentasi ini berisi spesifikasi lengkap endpoint, format request/response, autentikasi, rate limiting, dan error handling untuk semua modul admin (users, jobs, chatbot, system monitoring).

## Fitur Optimasi
Implementasikan teknik optimasi berikut untuk meningkatkan performa aplikasi:

### Prefetching
- Gunakan Next.js `prefetch` pada link navigasi untuk memuat halaman berikutnya secara preemptif.
- Implementasikan data prefetching untuk endpoint yang sering diakses (misalnya statistik dashboard).
- Gunakan React Query atau SWR untuk prefetching data di level komponen.

### Caching
- Implementasikan Redis caching untuk data yang jarang berubah (seperti statistik, user details).
- Gunakan browser caching untuk static assets dan API responses dengan header `Cache-Control`.
- Implementasikan in-memory caching untuk data sesi dan konfigurasi.
- Manfaatkan Next.js ISR (Incremental Static Regeneration) untuk halaman dengan data yang update periodik.

### Optimasi Tambahan
- Kompresi response menggunakan gzip (sudah didukung oleh Next.js).
- Implementasikan lazy loading untuk komponen dan gambar.
- Optimalkan bundle size dengan code splitting dan tree shaking.
- Gunakan CDN untuk static assets.
- Monitor performa dengan tools seperti Lighthouse dan implementasikan rekomendasi.
