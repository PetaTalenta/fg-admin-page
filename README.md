# FutureGuide Admin Dashboard

Admin dashboard untuk mengelola users, jobs monitoring, dan chatbot monitoring pada platform FutureGuide. Dashboard ini dibangun menggunakan Next.js 15 dengan App Router, TypeScript, dan Tailwind CSS, serta terintegrasi dengan Admin Service API.

**Creator**: Rayina Ilham

## Deskripsi Proyek

Dashboard admin ini menyediakan interface yang intuitif untuk monitoring dan management sistem FutureGuide. Fitur utama meliputi:

- **Dashboard Overview**: Statistik real-time, trends, dan overview sistem dengan 11 kartu statistik utama
- **User Management**: List users, detail user, token management, dan monitoring aktivitas user (jobs dan conversations)
- **Jobs Monitoring**: Monitoring semua analysis jobs dengan statistik, filtering, sorting, dan detail view
- **Chatbot Monitoring**: Monitoring chatbot performance, conversations, dan model usage

## Fitur Utama

- ✅ Next.js 15 dengan App Router
- ✅ TypeScript dengan mode strict
- ✅ Tailwind CSS dengan tema kustom
- ✅ Authentication dengan JWT token
- ✅ Real-time updates via WebSocket
- ✅ React Query untuk state management dan caching
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Error handling dan loading states
- ✅ Pagination dan filtering untuk data besar
- ✅ Charts dan visualisasi data dengan Recharts

## Teknologi Utama

- **Framework**: Next.js 15.5.5
- **Bahasa**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.6
- **State Management**: TanStack React Query
- **Real-time**: Socket.IO Client
- **Charts**: Recharts
- **API Base URL**: `https://api.futureguide.id/api`
- **Linting**: ESLint 9
- **Build Tool**: Turbopack (dev), Next.js build (prod)

## Optimasi dan Metrik Performa

Dashboard ini dioptimalkan untuk performa tinggi dengan teknik-teknik berikut:

### Fitur Optimasi
- **React Query Caching**: Stale time 5 menit, cache time 10 menit, auto-refetch untuk real-time feel
- **WebSocket Real-time Updates**: Instant updates untuk job stats, alerts, dan system metrics
- **Code Splitting**: Route-based splitting dengan Next.js App Router
- **Lazy Loading**: Components dan data dimuat on-demand
- **Prefetching**: Data dan pages diprefetch untuk navigasi cepat
- **Memoization**: Expensive calculations dan components di-memoize
- **Debouncing**: Search dan filter inputs di-debounce 500ms
- **Optimistic Updates**: UI update immediately, rollback jika error
- **Bundle Optimization**: Tree shaking, target bundle size < 200KB gzipped

### Metrik Performa Target
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.8s
- **Bundle Size**: Initial load < 200KB gzipped

## Struktur Folder

```
fg-admin-page/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Authentication pages
│   │   ├── (dashboard)/        # Protected dashboard pages
│   │   │   ├── page.tsx        # Dashboard overview
│   │   │   ├── users/          # User management
│   │   │   ├── jobs/           # Jobs monitoring
│   │   │   └── chatbot/        # Chatbot monitoring
│   │   └── api/                # API routes (opsional)
│   ├── components/             # Reusable components (minimal usage)
│   ├── lib/                    # Utilities dan helpers
│   │   ├── api-client.ts       # HTTP client dengan auth
│   │   ├── utils.ts            # Utility functions
│   │   └── websocket.ts        # WebSocket client
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── styles/                 # Global styles
├── public/                     # Static assets
├── docs/                       # Documentation
├── tests/                      # Test files
├── tailwind.config.js          # Tailwind config
├── next.config.js              # Next.js config
├── eslint.config.mjs           # ESLint config
└── tsconfig.json               # TypeScript config
```

## Quick Start

```bash
# Clone repository
git clone <repository-url>
cd fg-admin-page

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan API credentials

# Jalankan development server
npm run dev

# Buka http://localhost:5000 di browser
```

## Environment Variables

Buat file `.env.local` di root project dengan konfigurasi berikut:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.futureguide.id/api
NEXT_PUBLIC_WS_URL=ws://admin-service:3007/admin/socket.io
# Tambahkan credentials lainnya jika diperlukan
```

## Scripts

- `npm run dev` - Menjalankan development server dengan Turbopack
- `npm run build` - Build aplikasi untuk production
- `npm run start` - Menjalankan production server
- `npm run lint` - Menjalankan ESLint
- `npm run type-check` - Cek TypeScript errors
- `npm run test` - Menjalankan unit tests

## Path Aliases

Template ini menggunakan path aliases untuk import yang lebih bersih:

```typescript
import { cn } from '@/lib/utils'
import type { User } from '@/types/user'
import styles from '@/styles/globals.css'
import { useAuth } from '@/hooks/useAuth'
```

Available aliases:
- `@/*` → `./src/*`
- `@/app/*` → `./src/app/*`
- `@/lib/*` → `./src/lib/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/types/*` → `./src/types/*`
- `@/styles/*` → `./src/styles/*`

## Arsitektur Komponen

- **Komponen Page**: Semua komponen yang dibutuhkan oleh suatu page didefinisikan langsung di dalam file page tersebut, bukan diimpor dari folder components.
- **Modul Global**: Utils, hooks, dan services diimpor dari folder yang sesuai (`@/lib/`, `@/hooks/`).

## API Integration

Dashboard terintegrasi dengan Admin Service API. Referensikan `docs/ADMIN_SERVICE_API_DOCUMENTATION.md` untuk spesifikasi lengkap endpoint, autentikasi, dan error handling.

**Authentication**: Bearer token di header `Authorization`
**Rate Limiting**: Dihormati di frontend dengan debouncing dan caching
**Error Handling**: Comprehensive error handling dengan user-friendly messages

## Testing

- **Unit Tests**: Komponen dan utilities dengan Jest dan React Testing Library
- **Integration Tests**: API calls dan hooks dengan MSW
- **E2E Tests**: User flows dengan Playwright
- **Manual Testing**: Checklist untuk setiap fase development

## Deployment

1. Build aplikasi: `npm run build`
2. Deploy ke hosting yang mendukung Next.js (Vercel, Netlify, dll.)
3. Setup environment variables di hosting platform
4. Configure domain dan SSL

## Lisensi

Project ini dibuat oleh Rayina Ilham untuk keperluan internal FutureGuide.

---

**Version**: 1.0
**Last Updated**: 2025-10-17
**Creator**: Rayina Ilham

## Dokumentasi Tambahan

Lihat file-file di src/ untuk contoh implementasi.