# Next.js Template

Template Next.js sederhana dengan TypeScript dan Tailwind CSS.

## Struktur Folder

```
nextjs-template/
├── src/
│   ├── app/           # Halaman Next.js dengan App Router
│   ├── styles/        # File CSS global
│   ├── lib/           # Utilitas dan helper functions
│   ├── hooks/         # Custom React hooks
│   └── types/         # TypeScript type definitions
├── public/            # Asset statis
└── docs/              # Dokumentasi
```

## Fitur

- ✅ Next.js 14 dengan App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Turbopack untuk development
- ✅ Custom path aliases
- ✅ ESLint configuration
- ✅ Arsitektur komponen page yang tidak modular
- ✅ Custom hooks
- ✅ Type definitions

## Quick Start

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` - Menjalankan development server dengan Turbopack
- `npm run build` - Build aplikasi untuk production
- `npm run start` - Menjalankan production server
- `npm run lint` - Menjalankan ESLint
- `npm run type-check` - Cek TypeScript errors

## Path Aliases

Template ini menggunakan path aliases untuk import yang lebih bersih:

```typescript
import Button from '@/components/Button'
import { cn } from '@/lib/utils'
import type { User } from '@/types'
```

Available aliases:
- `@/*` → `./src/*`
- `@/app/*` → `./src/app/*`
- `@/lib/*` → `./src/lib/*`
- `@/utils/*` → `./src/utils/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/types/*` → `./src/types/*`
- `@/styles/*` → `./src/styles/*`
- `@/public/*` → `./public/*`

## Customization

Template ini dirancang untuk dikustomisasi sesuai kebutuhan project Anda. Hapus komponen yang tidak diperlukan dan tambahkan sesuai requirements.

## Arsitektur Komponen

- **Komponen Page**: Semua komponen yang dibutuhkan oleh suatu page harus didefinisikan langsung di dalam file page tersebut, bukan diimpor dari folder components.
- **Modul Global**: Untuk utils, service, hooks, store, dan modul lainnya, tetap gunakan yang global dan diimpor dari folder yang sesuai (misalnya `@/lib/utils`, `@/hooks/useHook`).