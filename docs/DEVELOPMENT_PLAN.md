# Rencana Pengembangan Admin Dashboard FutureGuide

## Overview

Dokumen ini berisi rencana komprehensif untuk pengembangan admin dashboard FutureGuide yang akan mengelola users, jobs monitoring, dan chatbot monitoring. Dashboard ini dibangun menggunakan Next.js 15 dengan App Router, TypeScript, dan Tailwind CSS, serta terintegrasi dengan Admin Service API yang sudah tersedia.

### Tujuan Utama
- Menyediakan interface admin yang intuitif untuk monitoring dan management
- Menampilkan statistik real-time dan trends dari sistem
- Memungkinkan admin untuk mengelola users, jobs, dan conversations
- Mengoptimalkan performa dengan caching dan real-time updates

### Teknologi Stack
- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Real-time**: Socket.IO Client
- **Charts**: Recharts atau Chart.js
- **API Base URL**: `https://api.futureguide.id/api`

## Referensi API

Selalu mereferensikan `docs/ADMIN_SERVICE_API_DOCUMENTATION.md` ketika mengembangkan atau mengintegrasikan service API. Dokumentasi ini berisi spesifikasi lengkap endpoint, format request/response, autentikasi, rate limiting, dan error handling untuk semua modul admin (users, jobs, chatbot, system monitoring).

**Environment Variables**: Semua informasi sensitif seperti API base URL, authentication keys, database connections, dan konfigurasi lainnya harus disimpan di file `.env.local`. Jangan commit file `.env*` ke repository. Gunakan `process.env` untuk mengakses variabel environment di kode.

---

## Fase 1: Foundation, Authentication & Layout

### Apa
Fase ini membangun fondasi project dengan setup infrastruktur dasar, konfigurasi environment, struktur folder terorganisir, sistem autentikasi admin, protected routes, dan layout dashboard yang konsisten. Termasuk instalasi dependencies, konfigurasi TypeScript, Tailwind CSS, setup API client, login page, session management, dan middleware untuk route protection.

### Kenapa
Foundation yang solid sangat penting untuk:
- Memastikan konsistensi code structure di seluruh project
- Mempermudah maintenance dan scalability
- Menghindari refactoring besar di masa depan
- Menyediakan utilities dan helpers yang reusable
- Memastikan type safety dengan TypeScript

Authentication adalah gerbang utama untuk:
- Memastikan hanya admin yang bisa akses dashboard
- Melindungi data sensitif dari unauthorized access
- Menyediakan user context untuk activity logging
- Memungkinkan role-based access control (admin vs superadmin)

Layout yang konsisten penting untuk:
- User experience yang seamless
- Navigation yang intuitif
- Branding consistency
- Responsive design di berbagai device

### Dimana
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx          # Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Dashboard layout dengan sidebar
│   │   └── page.tsx              # Dashboard home (akan diisi di Fase 2)
│   └── api/
│       └── auth/
│           └── [...nextauth]/    # Auth API routes (optional)
├── lib/                    # Utilities dan helpers
│   ├── api-client.ts      # HTTP client dengan axios/fetch
│   ├── utils.ts           # Utility functions
│   └── constants.ts       # Constants dan configurations
├── types/                  # TypeScript type definitions
│   ├── api.ts             # API response types
│   ├── user.ts            # User related types
│   ├── job.ts             # Job related types
│   └── chatbot.ts         # Chatbot related types
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   └── useUser.ts         # Current user hook
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Sidebar navigation
│   │   ├── Header.tsx            # Header dengan user info
│   │   └── DashboardLayout.tsx   # Main layout wrapper
│   └── auth/
│       └── LoginForm.tsx         # Login form component
├── middleware.ts                  # Route protection middleware
└── styles/
    └── globals.css        # Global styles dengan Tailwind
```

### Bagaimana
1. **Project Initialization**: Menggunakan Next.js 15 starter yang sudah ada, memastikan semua dependencies terinstall
2. **Environment Configuration**: Setup `.env.local` dengan API base URL, authentication keys, dan configuration lainnya. Pastikan semua informasi sensitif (API keys, secrets, database URLs, dll.) disimpan di file `.env.local` dan tidak di-commit ke repository. Gunakan prefix `NEXT_PUBLIC_` untuk variabel yang diakses di client-side.
3. **TypeScript Configuration**: Konfigurasi `tsconfig.json` dengan strict mode dan path aliases (@/lib, @/types, @/hooks)
4. **API Client Setup**: Membuat HTTP client wrapper yang handle authentication headers, error handling, dan response transformation
5. **Type Definitions**: Mendefinisikan TypeScript interfaces untuk semua API responses berdasarkan dokumentasi API
6. **Utility Functions**: Membuat helper functions untuk formatting (date, number, currency), validation, dan transformasi data
7. **Login Page**: Membuat form login dengan email dan password, validasi input, error handling, dan loading states
8. **Authentication Flow**: 
   - Submit credentials ke `POST /admin/auth/login`
   - Simpan JWT token di localStorage atau httpOnly cookie
   - Redirect ke dashboard setelah login sukses
9. **Middleware Protection**: Implementasi Next.js middleware untuk check authentication sebelum akses protected routes
10. **Session Management**: 
    - Verify token dengan `GET /admin/auth/verify` saat app load
    - Auto-refresh token jika mendekati expiry
    - Handle logout dengan clear token dan redirect ke login
11. **Layout Structure**:
    - Sidebar dengan navigation menu (Dashboard, Users, Jobs, Chatbot)
    - Header dengan user info, notifications, dan logout button
    - Main content area yang responsive
    - Active state untuk current page

### Endpoint API
Selalu mereferensikan `docs/ADMIN_SERVICE_API_DOCUMENTATION.md` untuk spesifikasi lengkap endpoint ini.

- Base URL: `https://api.futureguide.id/api`
- Authentication: Bearer token di header `Authorization`
- Content-Type: `application/json`
- **POST /admin/auth/login**: Login admin dengan email dan password
  - Request: `{ email, password }`
  - Response: `{ user, token }`
  - Rate Limit: 10 requests per 15 minutes
- **GET /admin/auth/verify**: Verify JWT token validity
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ id, email, user_type }`
- **POST /admin/auth/logout**: Logout dan invalidate session
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success: true }`

### Teknik Optimasi
1. **Path Aliases**: Menggunakan `@/` aliases untuk import yang lebih clean dan mudah di-refactor
2. **Tree Shaking**: Konfigurasi untuk memastikan unused code tidak masuk ke bundle
3. **TypeScript Strict Mode**: Mencegah bugs di development time
4. **Code Organization**: Struktur folder yang modular untuk code splitting yang optimal
5. **Environment Variables**: Centralized configuration untuk easy deployment
6. **Token Storage**: Menggunakan httpOnly cookie untuk security, fallback ke localStorage
7. **Middleware Caching**: Cache authentication check untuk mengurangi API calls
8. **Layout Persistence**: Next.js layout tidak re-render saat navigasi antar pages
9. **Lazy Loading**: Sidebar menu items di-lazy load untuk faster initial render
10. **Optimistic UI**: Show loading state immediately saat login, tidak tunggu response
11. **Error Boundaries**: Wrap authentication flow dengan error boundary untuk graceful error handling

### KPI
- [ ] Environment setup dan dependencies terinstall
- [ ] TypeScript path aliases dikonfigurasi
- [ ] API client dengan authentication setup
- [ ] Login page dan authentication flow working
- [ ] Protected routes dengan middleware
- [ ] Dashboard layout dengan sidebar dan header responsive

Ketika fase ini selesai, update bagian judul fase dengan [DONE] dan checklist KPI yang telah tercapai.

---

## Fase 2: Dashboard Overview Page

### Apa
Halaman dashboard utama yang menampilkan overview sistem dengan statistik real-time, charts/trends, recent activities, dan quick navigation. Ini adalah landing page setelah admin login.

### Kenapa
Dashboard overview penting sebagai:
- Single source of truth untuk health sistem
- Quick glance untuk identify issues atau anomalies
- Entry point untuk deep dive ke specific modules
- Decision making tool untuk admin
- Performance monitoring at a glance

### Dimana
```
src/
├── app/
│   └── (dashboard)/
│       └── page.tsx                    # Dashboard home page
├── components/
│   └── dashboard/
│       ├── StatsCard.tsx               # Reusable stats card
│       ├── JobTrendChart.tsx           # Job trend line chart
│       ├── UserGrowthChart.tsx         # User growth chart
│       ├── ConversationTrendChart.tsx  # Conversation trend
│       ├── RecentJobsTable.tsx         # Recent jobs table
│       └── TopModelsCard.tsx           # Top models used
└── hooks/
    ├── useDashboardStats.ts            # Hook untuk fetch stats
    └── useDashboardTrends.ts           # Hook untuk fetch trends
```

### Bagaimana
1. **Stats Cards Section**: 
   - Grid layout 4 kolom untuk desktop, 2 untuk tablet, 1 untuk mobile
   - Setiap card menampilkan metric, value, dan trend indicator (up/down)
   - Color coding: green untuk positive, red untuk negative, blue untuk neutral
   - Loading skeleton saat data fetching

2. **Charts Section**:
   - Job Trend: Line chart menampilkan jobs per hari untuk 7-30 hari terakhir
   - User Growth: Area chart menampilkan new users per hari/minggu
   - Conversation Trend: Bar chart menampilkan conversations dan messages
   - Responsive chart sizing dengan aspect ratio maintained

3. **Recent Activities**:
   - Table menampilkan 10 jobs terbaru dengan user info
   - Columns: User, Job ID, Assessment Name, Status, Created At
   - Click row untuk navigate ke job detail
   - Status badge dengan color coding

4. **Top Models**:
   - Card list menampilkan top 5 models by usage
   - Show model name, usage count, dan percentage
   - Visual bar untuk comparison

5. **Data Fetching Strategy**:
   - Parallel fetch semua endpoints saat page load
   - React Query untuk caching dengan 5 menit staleTime
   - Auto-refetch setiap 30 detik untuk real-time feel
   - Error handling dengan retry logic

### Endpoint API
Selalu mereferensikan `docs/ADMIN_SERVICE_API_DOCUMENTATION.md` untuk spesifikasi lengkap endpoint ini.

- **GET /admin/jobs/stats**: Statistik jobs (total, completed, failed, success rate)
- **GET /admin/system/metrics**: Statistik users dan tokens (total users, new users today, active today, total tokens)
- **GET /admin/chatbot/stats**: Statistik chatbot (total conversations, total messages, avg response time)
- **GET /admin/jobs**: List jobs dengan filter `date_from` dan `date_to` untuk trend calculation
  - Query params: `?date_from=2025-10-01&date_to=2025-10-14&sort_by=created_at&sort_order=DESC`
- **GET /admin/users**: List users dengan filter `created_at` untuk user growth trend
  - Query params: `?date_from=2025-10-01&date_to=2025-10-14`
- **GET /admin/users/:id**: Detail user untuk recent jobs table (fetch per user)
- **GET /admin/chatbot/models**: Top models dengan usage statistics

### Teknik Optimasi
1. **Parallel Data Fetching**: Fetch semua stats endpoints secara parallel dengan `Promise.all()` atau React Query parallel queries
2. **React Query Caching**: 
   - `staleTime: 5 * 60 * 1000` (5 menit) - data dianggap fresh
   - `cacheTime: 10 * 60 * 1000` (10 menit) - data tetap di cache
   - `refetchInterval: 30 * 1000` (30 detik) - auto-refetch untuk real-time
3. **Memoization**: Memo expensive calculations seperti trend aggregation dan percentage calculations
4. **Lazy Loading Charts**: Load chart library hanya saat dibutuhkan dengan dynamic import
5. **Skeleton Loading**: Show skeleton UI immediately untuk better perceived performance
6. **Data Aggregation**: Aggregate trend data di frontend untuk mengurangi API calls (fetch raw data sekali, calculate trends di client)
7. **Prefetching**: Prefetch user detail dan job detail saat hover di table untuk instant navigation
8. **Debouncing**: Debounce auto-refetch jika user actively interacting dengan page

### KPI
- [ ] Stats cards menampilkan data real-time dari API
- [ ] Charts (job trend, user growth, conversation trend) render dengan data akurat
- [ ] Recent jobs table dengan user info dan navigation
- [ ] Top models card dengan usage statistics
- [ ] Dashboard responsive di berbagai device
- [ ] Real-time updates dengan React Query caching

Ketika fase ini selesai, update bagian judul fase dengan [DONE] dan checklist KPI yang telah tercapai.

---

## Fase 3: User Management Page

### Apa
Halaman untuk mengelola users dengan fitur list, search, filter, detail view, token management, dan monitoring aktivitas user (jobs dan conversations). Admin dapat melihat semua informasi user dan melakukan update.

### Kenapa
User management adalah core functionality untuk:
- Monitoring user activity dan behavior
- Managing user tokens dan permissions
- Troubleshooting user issues
- Understanding user engagement dengan platform
- Supporting users dengan melihat history mereka

### Dimana
```
src/
├── app/
│   └── (dashboard)/
│       └── users/
│           ├── page.tsx                    # User list page
│           └── [id]/
│               ├── page.tsx                # User detail page
│               ├── jobs/
│               │   └── [jobId]/
│               │       └── page.tsx        # Job results detail
│               └── conversations/
│                   └── [convId]/
│                       └── page.tsx        # Conversation chats detail
├── components/
│   └── users/
│       ├── UserTable.tsx                   # User list table
│       ├── UserFilters.tsx                 # Search and filters
│       ├── UserDetailCard.tsx              # User info card
│       ├── TokenManagementCard.tsx         # Token balance & history
│       ├── UserJobsList.tsx                # User's jobs list
│       ├── UserConversationsList.tsx       # User's conversations list
│       ├── JobResultsView.tsx              # Job results detail view
│       └── ConversationChatsView.tsx       # Conversation chats view
└── hooks/
    ├── useUsers.ts                         # Users list hook
    ├── useUserDetail.ts                    # User detail hook
    ├── useUpdateUser.ts                    # Update user mutation
    └── useUpdateToken.ts                   # Update token mutation
```

### Bagaimana
1. **User List Page**:
   - Table dengan columns: Username, Email, User Type, Status, Token Balance, Last Login, Created At
   - Search bar untuk search by email atau username
   - Filters: User Type (user/admin), Status (active/inactive), Auth Provider
   - Pagination dengan 20 items per page
   - Click row untuk navigate ke user detail

2. **User Detail Page**:
   - User Info Card: Display semua user information (username, email, type, status, auth provider, Firebase UID, etc.)
   - Edit Mode: Toggle untuk enable editing user info (username, status, user_type, federation_status)
   - Save button untuk submit changes dengan loading state
   - Statistics: Total jobs, total conversations, last login

3. **Token Management**:
   - Current Balance display dengan prominent styling
   - Token History table: Date, Activity Type, Amount, Reason, New Balance
   - Add/Subtract Token form: Amount input, Reason textarea, Submit button
   - Validation: Amount harus positive number, Reason required
   - Success/Error toast notifications

4. **User Jobs List**:
   - Table: Job ID, Assessment Name, Status, Created At, Completed At
   - Status badge dengan color coding
   - Click job untuk navigate ke job results detail
   - Pagination untuk jobs

5. **User Conversations List**:
   - Table: Conversation ID, Title, Context Type, Status, Created At
   - Click conversation untuk navigate ke chats detail
   - Pagination untuk conversations

6. **Job Results Detail**:
   - Job Info: Job ID, Status, Assessment Name, Completion Time
   - Results Data: Display test_data, test_result, raw_responses dalam structured format
   - JSON viewer untuk complex nested data
   - Back button ke user detail

7. **Conversation Chats Detail**:
   - Conversation Info: Title, Status, Context Type, Total Messages, Total Tokens
   - Chat Messages: Display dalam chat bubble format (user vs assistant)
   - Show model used dan tokens per message
   - Pagination untuk messages (50 per page)
   - Back button ke user detail

### Endpoint API
Selalu mereferensikan `docs/ADMIN_SERVICE_API_DOCUMENTATION.md` untuk spesifikasi lengkap endpoint ini.

- **GET /admin/users**: List users dengan pagination dan filters
  - Query params: `?page=1&limit=20&search=john&user_type=user&is_active=true`
- **GET /admin/users/:id**: Detail user dengan statistics dan recent activity
- **PUT /admin/users/:id**: Update user information
  - Body: `{ username, is_active, user_type, federation_status, profile }`
- **GET /admin/users/:id/tokens**: Token balance dan transaction history
- **PUT /admin/users/:id/tokens**: Update token balance
  - Body: `{ amount, reason }`
- **GET /admin/users/:id/jobs**: User's jobs dengan pagination
  - Query params: `?page=1&limit=20`
- **GET /admin/users/:id/conversations**: User's conversations dengan pagination
  - Query params: `?page=1&limit=20`
- **GET /admin/jobs/:id/results**: Complete job results (digunakan dari user jobs dan jobs page)
- **GET /admin/conversations/:id/chats**: Conversation chat messages dengan pagination
  - Query params: `?page=1&limit=50`

### Teknik Optimasi
1. **Search Debouncing**: Debounce search input 500ms untuk mengurangi API calls saat user typing
2. **Filter Caching**: Cache filter combinations dengan React Query untuk instant back navigation
3. **Pagination State**: Persist pagination state di URL query params untuk shareable links
4. **Optimistic Updates**: Update UI immediately saat edit user atau token, rollback jika error
5. **Lazy Loading**: Lazy load job results dan conversation chats hanya saat tab dibuka
6. **Data Prefetching**: Prefetch user detail saat hover di user table row
7. **Virtual Scrolling**: Implement virtual scrolling untuk large token history atau chat messages
8. **Memoization**: Memo user statistics calculations dan data transformations
9. **Incremental Loading**: Load user info first, then jobs dan conversations secara parallel
10. **Error Recovery**: Implement retry logic dengan exponential backoff untuk failed requests

### KPI
- [ ] User list table dengan search, filters, dan pagination
- [ ] User detail page dengan info, stats, dan token management
- [ ] Token balance update dengan validation dan notifications
- [ ] User jobs list dengan navigation ke results detail
- [ ] User conversations list dengan navigation ke chats detail
- [ ] Job results viewer dengan structured data display
- [ ] Conversation chats viewer dengan message bubbles

Ketika fase ini selesai, update bagian judul fase dengan [DONE] dan checklist KPI yang telah tercapai.

---

## Fase 4: Jobs Monitoring Page

### Apa
Halaman untuk monitoring semua analysis jobs dengan statistik, filtering, sorting, dan detail view. Admin dapat melihat job status, performance metrics, dan hasil analysis.

### Kenapa
Jobs monitoring penting untuk:
- Tracking job processing performance dan success rate
- Identifying failed jobs untuk troubleshooting
- Understanding system load dan capacity
- Monitoring job queue dan processing times
- Ensuring SLA compliance untuk job completion

### Dimana
```
src/
├── app/
│   └── (dashboard)/
│       └── jobs/
│           ├── page.tsx                # Jobs list page
│           └── [id]/
│               └── page.tsx            # Job detail & results page
├── components/
│   └── jobs/
│       ├── JobStatsCards.tsx           # Job statistics cards
│       ├── JobTable.tsx                # Jobs list table
│       ├── JobFilters.tsx              # Filters and sorting
│       ├── JobDetailCard.tsx           # Job information card
│       ├── JobResultsViewer.tsx        # Results data viewer
│       └── JobStatusBadge.tsx          # Status badge component
└── hooks/
    ├── useJobStats.ts                  # Job statistics hook
    ├── useJobs.ts                      # Jobs list hook
    └── useJobDetail.ts                 # Job detail hook
```

### Bagaimana
1. **Job Statistics Dashboard**:
   - Stats Cards: Total Jobs, Queued, Processing, Completed, Failed, Success Rate, Avg Processing Time
   - Color coding: Blue (total), Yellow (queued), Orange (processing), Green (completed), Red (failed)
   - Trend indicators untuk comparison dengan periode sebelumnya
   - Auto-refresh setiap 10 detik

2. **Jobs Table**:
   - Columns: Job ID, User Email, Assessment Name, Status, Priority, Created At, Completed At, Processing Time
   - Pagination: 50 items per page (sesuai requirement)
   - Sortable columns: Created At, Completed At, Status, Priority
   - Status badge dengan icon dan color
   - Click row untuk navigate ke job detail

3. **Filters & Sorting**:
   - Status filter: All, Queued, Processing, Completed, Failed, Cancelled
   - Date range picker: Filter by created date (from - to)
   - Assessment name search: Partial match search
   - User ID filter: Filter by specific user
   - Sort by: Created At, Updated At, Completed At, Status, Priority
   - Sort order: ASC / DESC
   - Clear all filters button

4. **Job Detail Page**:
   - Job Info Card: All job metadata (ID, user, status, timestamps, retry count, error message)
   - Processing Timeline: Visual timeline dari created → processing → completed/failed
   - User Info: Link ke user detail page
   - Results Section: Display complete analysis results jika job completed

5. **Job Results Viewer**:
   - Structured display untuk test_data, test_result, raw_responses
   - Collapsible sections untuk better organization
   - JSON viewer dengan syntax highlighting untuk complex data
   - Copy to clipboard functionality
   - Download results as JSON

### Endpoint API
Selalu mereferensikan `docs/ADMIN_SERVICE_API_DOCUMENTATION.md` untuk spesifikasi lengkap endpoint ini.

- **GET /admin/jobs/stats**: Job statistics dashboard
  - Response: `{ total, queued, processing, completed, failed, successRate, avgProcessingTimeMinutes }`
- **GET /admin/jobs**: Paginated jobs list dengan filtering dan sorting
  - Query params: `?page=1&limit=50&status=completed&date_from=2025-10-01&date_to=2025-10-14&sort_by=created_at&sort_order=DESC&user_id=xxx&assessment_name=AI`
- **GET /admin/jobs/:id**: Detailed job information
  - Response: Job object dengan user info dan processing time calculation
- **GET /admin/jobs/:id/results**: Complete analysis results untuk job
  - Response: `{ job, result }` dengan full test_data dan test_result

### Teknik Optimasi
1. **Auto-refresh dengan Smart Polling**:
   - Polling interval 10 detik untuk stats
   - Stop polling saat tab tidak active (Page Visibility API)
   - Resume polling saat tab active kembali
2. **Server-side Pagination**: Fetch hanya data yang dibutuhkan per page untuk mengurangi payload
3. **Filter State Management**: Persist filters di URL untuk shareable dan bookmarkable links
4. **Debounced Search**: Debounce assessment name search 500ms
5. **Conditional Rendering**: Render results viewer hanya jika job status completed
6. **Lazy Load Results**: Load job results on-demand saat user click "View Results"
7. **Memoized Calculations**: Memo processing time calculations dan status derivations
8. **Skeleton Loading**: Show skeleton untuk table rows saat loading
9. **Error Boundaries**: Wrap results viewer dengan error boundary untuk handle malformed data
10. **Cache Invalidation**: Invalidate jobs cache saat job status changes (via WebSocket di Fase 6)

### KPI
- [ ] Job statistics cards dengan auto-refresh setiap 10 detik
- [ ] Jobs table dengan filters, sorting, dan pagination 50 item per page
- [ ] Job detail page dengan metadata, timeline, dan user info
- [ ] Job results viewer dengan structured data display dan download
- [ ] Search dan filter functionality working
- [ ] Error handling untuk failed jobs dan malformed data

Ketika fase ini selesai, update bagian judul fase dengan [DONE] dan checklist KPI yang telah tercapai.

---

## Fase 5: Chatbot Monitoring Page

### Apa
Halaman untuk monitoring chatbot performance, conversations, dan model usage. Admin dapat melihat statistik chatbot, list conversations, detail percakapan, dan analytics model yang digunakan.

### Kenapa
Chatbot monitoring penting untuk:
- Understanding chatbot usage patterns dan engagement
- Monitoring response quality dan performance
- Tracking token consumption dan costs
- Identifying popular models dan their effectiveness
- Troubleshooting conversation issues
- Optimizing model selection strategy

### Dimana
```
src/
├── app/
│   └── (dashboard)/
│       └── chatbot/
│           ├── page.tsx                    # Chatbot overview page
│           └── conversations/
│               └── [id]/
│                   └── page.tsx            # Conversation detail page
├── components/
│   └── chatbot/
│       ├── ChatbotStatsCards.tsx           # Statistics cards
│       ├── ModelUsageChart.tsx             # Model usage pie/bar chart
│       ├── ConversationTable.tsx           # Conversations list table
│       ├── ConversationFilters.tsx         # Filters
│       ├── ConversationDetailCard.tsx      # Conversation info
│       ├── ChatMessagesView.tsx            # Chat messages display
│       └── MessageBubble.tsx               # Individual message bubble
└── hooks/
    ├── useChatbotStats.ts                  # Chatbot statistics hook
    ├── useConversations.ts                 # Conversations list hook
    ├── useConversationDetail.ts            # Conversation detail hook
    └── useModels.ts                        # Models analytics hook
```

### Bagaimana
1. **Chatbot Statistics Dashboard**:
   - Stats Cards: Total Conversations, Total Messages, Active Conversations, Avg Messages per Conversation, Avg Response Time, Total Tokens Used
   - Today's Activity: Conversations Today, Messages Today
   - Performance Metrics: Avg Response Time dengan trend indicator
   - Auto-refresh setiap 30 detik

2. **Model Usage Analytics**:
   - Pie chart atau bar chart menampilkan distribution model usage
   - Table: Model Name, Usage Count, Total Tokens, Avg Processing Time, Free/Paid indicator
   - Sort by usage count descending
   - Percentage calculation untuk each model
   - Free vs Paid models comparison

3. **Conversations Table**:
   - Columns: Conversation ID, Title, User Email, Status, Message Count, Created At, Updated At
   - Pagination: 20 items per page
   - Status badge: Active, Archived, Deleted
   - Click row untuk navigate ke conversation detail

4. **Filters**:
   - Status filter: All, Active, Archived, Deleted
   - Context Type filter: General, Career Guidance, Assessment, etc.
   - Date range: Filter by created date
   - User ID filter: Filter by specific user
   - Search: Search in conversation titles
   - Sort by: Created At, Updated At, Title, Status

5. **Conversation Detail Page**:
   - Conversation Info Card: Title, Status, Context Type, User Email, Message Count, Total Tokens, Total Cost, Created/Updated timestamps
   - Edit Title: Inline editing untuk conversation title
   - Status Management: Change status (Active/Archived)

6. **Chat Messages View**:
   - Chat bubble layout: User messages di kanan (blue), Assistant messages di kiri (gray)
   - Display message content dengan proper formatting (markdown support)
   - Show model used dan token count per assistant message
   - Timestamp untuk each message
   - Pagination: 50 messages per page, load more button
   - Scroll to bottom untuk latest messages
   - Copy message content functionality

### Endpoint API
Selalu mereferensikan `docs/ADMIN_SERVICE_API_DOCUMENTATION.md` untuk spesifikasi lengkap endpoint ini.

- **GET /admin/chatbot/stats**: Comprehensive chatbot statistics
  - Response: `{ overview, today, performance, tokenUsage, modelUsage }`
- **GET /admin/chatbot/models**: Model usage statistics dan analytics
  - Response: `{ summary, models }` dengan usage count, tokens, avg processing time per model
- **GET /admin/conversations**: Paginated conversations list dengan filtering
  - Query params: `?page=1&limit=20&status=active&user_id=xxx&context_type=career_guidance&search=title&date_from=2025-10-01&sort_by=created_at&sort_order=DESC`
- **GET /admin/conversations/:id**: Detailed conversation information
  - Response: Conversation object dengan user info, message count, token totals
- **GET /admin/conversations/:id/chats**: Paginated chat messages untuk conversation
  - Query params: `?page=1&limit=50`
  - Response: `{ conversation, messages, pagination }` dengan sender_type, content, usage per message

### Teknik Optimasi
1. **Auto-refresh dengan Intelligent Polling**:
   - Stats: Refresh setiap 30 detik
   - Conversations list: Refresh setiap 60 detik
   - Stop polling saat page tidak visible
2. **Lazy Loading Messages**: Load chat messages hanya saat conversation detail dibuka
3. **Infinite Scroll**: Implement infinite scroll untuk chat messages dengan virtual scrolling
4. **Message Pagination**: Load messages in chunks (50 per page) untuk better performance
5. **Memoized Calculations**: Memo token totals, cost calculations, dan statistics aggregations
6. **Chart Optimization**: Use lightweight chart library, lazy load chart component
7. **Search Debouncing**: Debounce conversation title search 500ms
8. **Filter Caching**: Cache filter combinations dengan React Query
9. **Markdown Rendering**: Lazy load markdown renderer hanya untuk messages yang visible
10. **Image Lazy Loading**: Lazy load images dalam messages jika ada
11. **Skeleton Loading**: Show skeleton untuk messages saat loading
12. **Error Handling**: Graceful error handling untuk malformed messages atau missing data

### KPI
- [ ] Chatbot statistics cards dengan auto-refresh setiap 30 detik
- [ ] Model usage chart dengan analytics dan top models
- [ ] Conversations table dengan filters, search, dan pagination
- [ ] Conversation detail page dengan info, title editing, dan status management
- [ ] Chat messages viewer dengan bubble layout dan pagination
- [ ] Markdown rendering dan copy functionality untuk messages

Ketika fase ini selesai, update bagian judul fase dengan [DONE] dan checklist KPI yang telah tercapai.

---

## Fase 6: Optimization & Real-time Features

### Apa
Fase final untuk implementasi optimasi menyeluruh, real-time updates via WebSocket, performance tuning, error handling, dan final polish. Ini adalah enhancement layer di atas semua fase sebelumnya.

### Kenapa
Optimasi dan real-time features penting untuk:
- Meningkatkan user experience dengan instant updates
- Mengurangi server load dengan efficient caching
- Mempercepat page load times dan interactions
- Providing real-time monitoring capabilities
- Ensuring production-ready quality dan stability
- Meeting performance benchmarks (Core Web Vitals)

### Dimana
```
src/
├── lib/
│   ├── websocket.ts                # WebSocket client setup
│   ├── cache.ts                    # Cache utilities
│   └── performance.ts              # Performance monitoring
├── hooks/
│   ├── useWebSocket.ts             # WebSocket hook
│   ├── useRealTimeJobs.ts          # Real-time job updates
│   └── useRealTimeAlerts.ts        # Real-time alerts
├── components/
│   ├── common/
│   │   ├── ErrorBoundary.tsx       # Error boundary component
│   │   ├── LoadingState.tsx        # Loading states
│   │   └── ErrorState.tsx          # Error states
│   └── notifications/
│       ├── Toast.tsx               # Toast notifications
│       └── AlertBanner.tsx         # Alert banner
└── middleware.ts                    # Enhanced middleware
```

### Bagaimana

#### 1. React Query Caching Strategy
- **Global Configuration**:
  - Default staleTime: 5 menit untuk data yang jarang berubah
  - Default cacheTime: 10 menit untuk keep data di memory
  - Retry logic: 3 retries dengan exponential backoff
  - RefetchOnWindowFocus: true untuk fresh data saat user kembali

- **Per-Query Configuration**:
  - Dashboard stats: staleTime 2 menit, refetchInterval 30 detik
  - User list: staleTime 5 menit, refetchOnMount true
  - Job stats: staleTime 1 menit, refetchInterval 10 detik
  - Chatbot stats: staleTime 3 menit, refetchInterval 30 detik
  - User detail: staleTime 5 menit, no auto-refetch
  - Job results: staleTime 10 menit (static data)
  - Conversation chats: staleTime 5 menit

- **Cache Invalidation**:
  - Invalidate user cache setelah update user
  - Invalidate token cache setelah update token
  - Invalidate jobs cache saat job status change (via WebSocket)
  - Invalidate conversations cache saat new message (via WebSocket)

#### 2. WebSocket Real-time Updates
- **Connection Setup**:
  - Connect ke `ws://admin-service:3007/admin/socket.io` via API Gateway
  - Authentication via JWT token di handshake
  - Auto-reconnect dengan exponential backoff jika connection lost
  - Connection status indicator di header

- **Subscriptions**:
  - Subscribe to `jobs` channel untuk job updates
  - Subscribe to `system` channel untuk system health
  - Subscribe to `alerts` channel untuk critical alerts
  - Unsubscribe saat component unmount atau page change

- **Event Handlers**:
  - `job-stats`: Update job statistics cards real-time
  - `job-update`: Update specific job di table, show toast notification
  - `job-alert`: Show alert banner untuk critical job issues
  - `alert:new`: Show toast notification untuk new system alerts
  - `alert:update`: Update alert status di UI

- **UI Updates**:
  - Optimistic updates: Update UI immediately, rollback jika error
  - Toast notifications: Show non-intrusive notifications untuk updates
  - Badge indicators: Show unread count untuk new alerts
  - Auto-scroll: Scroll to new items di tables jika user at top

#### 3. Performance Optimizations
- **Code Splitting**:
  - Route-based splitting (automatic dengan Next.js App Router)
  - Component-based splitting untuk heavy components (charts, JSON viewers)
  - Dynamic imports untuk libraries yang besar

- **Bundle Optimization**:
  - Tree shaking untuk remove unused code
  - Minimize bundle size dengan proper imports (import specific functions)
  - Analyze bundle dengan `@next/bundle-analyzer`
  - Target bundle size: < 200KB initial load

- **Image Optimization**:
  - Use Next.js Image component untuk automatic optimization
  - Lazy loading images dengan loading="lazy"
  - Proper sizing dan formats (WebP dengan fallback)

- **Font Optimization**:
  - Use Next.js Font optimization
  - Preload critical fonts
  - Font subsetting untuk reduce size

- **Prefetching**:
  - Prefetch user detail saat hover di user table
  - Prefetch job detail saat hover di job table
  - Prefetch next page data saat user near bottom
  - Use Next.js Link prefetch untuk navigation

#### 4. Error Handling & Loading States
- **Error Boundaries**:
  - Global error boundary di root layout
  - Page-level error boundaries untuk isolated errors
  - Component-level boundaries untuk critical components
  - Fallback UI dengan retry button

- **Loading States**:
  - Skeleton loading untuk tables dan cards
  - Spinner untuk buttons dan forms
  - Progress bars untuk long operations
  - Suspense boundaries untuk lazy loaded components

- **Error Messages**:
  - User-friendly error messages (tidak expose technical details)
  - Actionable error messages dengan suggestions
  - Toast notifications untuk non-critical errors
  - Modal dialogs untuk critical errors

- **Retry Logic**:
  - Automatic retry untuk network errors (3 attempts)
  - Manual retry button untuk failed requests
  - Exponential backoff untuk retries
  - Circuit breaker untuk repeated failures

#### 5. Monitoring & Analytics
- **Performance Monitoring**:
  - Track Core Web Vitals (LCP, FID, CLS)
  - Monitor API response times
  - Track error rates dan types
  - Log slow queries dan operations

- **User Analytics**:
  - Track page views dan navigation patterns
  - Monitor feature usage
  - Track user actions (clicks, searches, filters)
  - Session duration dan engagement metrics

- **Error Tracking**:
  - Log all errors dengan context (user, page, action)
  - Track error frequency dan patterns
  - Alert untuk critical errors
  - Error reporting dashboard

### Endpoint API
Selalu mereferensikan `docs/ADMIN_SERVICE_API_DOCUMENTATION.md` untuk spesifikasi lengkap endpoint ini.

Semua endpoint dari fase sebelumnya, plus:
- **WebSocket Connection**: `ws://admin-service:3007/admin/socket.io`
  - Events: `subscribe:jobs`, `subscribe:system`, `subscribe:alerts`
  - Responses: `job-stats`, `job-update`, `job-alert`, `alert:new`, `alert:update`

### Teknik Optimasi
1. **React Query Caching**: Comprehensive caching strategy dengan smart invalidation
2. **WebSocket Real-time**: Instant updates tanpa polling untuk better UX dan reduced server load
3. **Code Splitting**: Reduce initial bundle size untuk faster load times
4. **Prefetching**: Anticipate user actions dan prefetch data
5. **Memoization**: Memo expensive calculations dan components
6. **Virtual Scrolling**: Handle large lists efficiently
7. **Debouncing**: Reduce API calls untuk search dan filters
8. **Optimistic Updates**: Instant UI feedback untuk better perceived performance
9. **Error Boundaries**: Graceful error handling tanpa crash entire app
10. **Performance Monitoring**: Continuous monitoring dan optimization based on metrics
11. **Lazy Loading**: Load components dan data on-demand
12. **Image Optimization**: Automatic image optimization dengan Next.js
13. **Font Optimization**: Optimized font loading
14. **Bundle Analysis**: Regular bundle size analysis dan optimization
15. **Cache Headers**: Leverage browser caching untuk static assets

### KPI
- [ ] WebSocket connection dan real-time updates working
- [ ] React Query caching strategy dengan smart invalidation
- [ ] Error boundaries dan loading states di seluruh app
- [ ] Performance monitoring dan analytics setup
- [ ] Code splitting dan lazy loading implemented
- [ ] Bundle size optimized dan Core Web Vitals improved

Ketika fase ini selesai, update bagian judul fase dengan [DONE] dan checklist KPI yang telah tercapai.

---

## Timeline & Dependencies

### Estimasi Waktu
- **Fase 1**: 4-6 hari (Foundation, Authentication & Layout)
- **Fase 2**: 4-5 hari (Dashboard Overview)
- **Fase 3**: 5-7 hari (User Management)
- **Fase 4**: 4-5 hari (Jobs Monitoring)
- **Fase 5**: 4-5 hari (Chatbot Monitoring)
- **Fase 6**: 3-5 hari (Optimization & Real-time)

**Total Estimasi**: 24-33 hari kerja (5-7 minggu)

### Dependencies
```
Fase 1 (Foundation, Auth & Layout)
    ↓
    ├─→ Fase 2 (Dashboard) ─┐
    ├─→ Fase 3 (Users) ─────┤
    ├─→ Fase 4 (Jobs) ──────┼─→ Fase 6 (Optimization)
    └─→ Fase 5 (Chatbot) ───┘
```

- **Fase 1** adalah prerequisite untuk semua fase lainnya
- **Fase 2-5** dapat dikerjakan secara parallel setelah Fase 1 selesai
- **Fase 6** dilakukan setelah semua fase 2-5 selesai untuk optimization menyeluruh

### Prioritas
1. **Critical**: Fase 1 (Tidak bisa skip, foundation dan authentication)
2. **High**: Fase 2, 4 (Dashboard dan Jobs monitoring adalah core features)
3. **Medium**: Fase 3, 5 (User dan Chatbot management penting tapi bisa incremental)
4. **Enhancement**: Fase 6 (Optimization bisa dilakukan bertahap)

---

## Best Practices & Considerations

### Code Quality
- **TypeScript Strict Mode**: Enforce type safety di seluruh codebase
- **ESLint Rules**: Follow Next.js recommended rules plus custom rules
- **Code Review**: Mandatory review untuk semua changes
- **Testing**: Unit tests untuk utilities, integration tests untuk critical flows
- **Documentation**: Inline comments untuk complex logic, README untuk setup

### Security
- **Authentication**: JWT token dengan proper expiry dan refresh
- **Authorization**: Role-based access control (admin vs superadmin)
- **Input Validation**: Validate semua user inputs di frontend dan backend
- **XSS Prevention**: Sanitize user-generated content
- **CSRF Protection**: Implement CSRF tokens untuk mutations
- **Rate Limiting**: Respect API rate limits, implement client-side throttling

### Accessibility
- **Semantic HTML**: Use proper HTML elements (button, nav, main, etc.)
- **ARIA Labels**: Add ARIA labels untuk screen readers
- **Keyboard Navigation**: Ensure semua features accessible via keyboard
- **Color Contrast**: Meet WCAG AA standards untuk color contrast
- **Focus Management**: Proper focus management untuk modals dan dialogs

### Responsive Design
- **Mobile First**: Design untuk mobile first, enhance untuk desktop
- **Breakpoints**: Use Tailwind breakpoints (sm, md, lg, xl, 2xl)
- **Touch Targets**: Minimum 44x44px untuk touch targets
- **Flexible Layouts**: Use flexbox dan grid untuk flexible layouts
- **Testing**: Test di berbagai device sizes dan orientations

### Performance Targets
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.8s
- **Bundle Size**: Initial load < 200KB gzipped

---

## Kesimpulan

Rencana pengembangan ini menyediakan roadmap komprehensif untuk membangun admin dashboard FutureGuide yang robust, performant, dan user-friendly. Dengan mengikuti fase-fase yang terstruktur dan menerapkan teknik optimasi yang tepat, dashboard ini akan menjadi tool yang powerful untuk admin dalam mengelola dan monitoring platform.

### Key Takeaways
1. **Structured Approach**: Pembagian fase yang jelas memudahkan development dan tracking progress
2. **Optimization First**: Teknik optimasi dipertimbangkan dari awal, bukan afterthought
3. **Real-time Capabilities**: WebSocket integration untuk monitoring real-time
4. **User Experience**: Focus pada UX dengan loading states, error handling, dan responsive design
5. **Scalability**: Architecture yang scalable untuk future enhancements
6. **Performance**: Target performance metrics yang jelas dan achievable

### Next Steps
1. Review dan approval rencana ini oleh team
2. Setup development environment (Fase 1)
3. Create detailed task breakdown untuk each fase
4. Assign resources dan set milestones
5. Begin development dengan Fase 1
6. Regular progress reviews dan adjustments

---

**Document Version**: 1.0
**Last Updated**: 2025-10-14
**Author**: Development Team
**Status**: Draft - Pending Review

