# Logika Search Job Berdasarkan Username/Email

**Tanggal**: October 16, 2025
**Versi**: 1.0
**File**: SEARCH_LOGIC_EXPLANATION.md

## Pendahuluan

Dokumen ini menjelaskan implementasi fitur search job berdasarkan username dan email di aplikasi admin dashboard. Fitur ini memungkinkan admin untuk mencari job berdasarkan informasi user (email/username) atau nama assessment secara real-time.

## Arsitektur Sistem

Fitur search menggunakan arsitektur client-server dengan pembagian tanggung jawab yang jelas:

- **Frontend**: Mengelola UI, state management, dan pengiriman request
- **Backend**: Menangani logika pencarian di database level
- **Database**: Menyimpan dan mengindeks data untuk performa optimal

## Frontend Implementation

### 1. State Management

```typescript
// State untuk search term
const [searchTerm, setSearchTerm] = useState<string>('');

// State untuk filters (termasuk search)
const [filters, setFilters] = useState<JobFilters>({
  page: 1,
  limit: 50,
  sort_by: 'created_at',
  sort_order: 'DESC',
});
```

### 2. Real-time Search Logic

```typescript
// useEffect untuk auto-apply search saat user mengetik
useEffect(() => {
  setFilters(prev => ({
    ...prev,
    search: searchTerm || undefined,  // undefined jika kosong
    page: 1, // Reset pagination ke halaman 1
  }));
}, [searchTerm]); // Dependency array - trigger saat searchTerm berubah
```

**Logika**:
- Setiap kali `searchTerm` berubah, filter otomatis diupdate
- Jika `searchTerm` kosong, parameter `search` di-set ke `undefined`
- Pagination selalu reset ke halaman 1 untuk menampilkan hasil terbaru

### 3. UI Components

```tsx
<input
  type="text"
  id="search"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search by email, username, or assessment..."
  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[250px]"
/>
```

**Fitur UI**:
- Input text dengan placeholder yang informatif
- Real-time update saat user mengetik (tidak perlu tombol search)
- Styling konsisten dengan design system
- Minimum width untuk UX yang baik

### 4. Data Fetching dengan React Query

```typescript
// Hook useJobs menggunakan parameter search
const { data: jobsData, isLoading: jobsLoading } = useJobs(filters);

// Di dalam useJobs hook:
if (filters.search) queryParams.append('search', filters.search);
```

**Caching Strategy**:
- React Query cache berdasarkan `filters` object
- Cache time: 5 minutes
- Stale time: 2 minutes
- Auto-refetch saat filters berubah

## Backend Implementation

### 1. API Endpoint

**Endpoint**: `GET /admin/jobs`
**Parameter**: `search` (string, optional)

**Request Example**:
```
GET /admin/jobs?page=1&limit=50&search=john&sort_by=created_at&sort_order=DESC
```

### 2. Database Query Logic

Backend kemungkinan menggunakan salah satu dari algoritma berikut:

#### Algoritma 1: SQL LIKE Query (Basic)
```sql
SELECT j.*, u.email, u.username
FROM jobs j
JOIN users u ON j.user_id = u.id
WHERE
  LOWER(u.email) LIKE LOWER('%john%') OR
  LOWER(u.username) LIKE LOWER('%john%') OR
  LOWER(j.assessment_name) LIKE LOWER('%john%')
ORDER BY j.created_at DESC
LIMIT 50 OFFSET 0;
```

#### Algoritma 2: Full-Text Search (Advanced)
```sql
SELECT j.*, u.email, u.username,
       ts_rank(to_tsvector('english', u.email || ' ' || u.username || ' ' || j.assessment_name),
               plainto_tsquery('english', 'john')) as rank
FROM jobs j
JOIN users u ON j.user_id = u.id
WHERE to_tsvector('english', u.email || ' ' || u.username || ' ' || j.assessment_name)
      @@ plainto_tsquery('english', 'john')
ORDER BY rank DESC, j.created_at DESC
LIMIT 50 OFFSET 0;
```

### 3. Search Fields

Search dilakukan di 3 kolom utama:
1. `users.email` - Alamat email user
2. `users.username` - Username user
3. `jobs.assessment_name` - Nama assessment/job

### 4. Performance Optimizations

- **Database Indexes**: Index pada kolom email, username, dan assessment_name
- **Query Optimization**: Menggunakan JOIN yang efisien
- **Pagination**: Limit 50 records per page
- **Case Insensitive**: Menggunakan LOWER() untuk case-insensitive search

## Frontend-Backend Integration

### 1. Request Flow

```
1. User mengetik di search input
2. onChange trigger -> setSearchTerm(state)
3. useEffect detect perubahan -> update filters
4. React Query detect filter change -> invalidate cache
5. HTTP Request dikirim ke backend dengan query parameter
6. Backend process search di database
7. Response dikembalikan ke frontend
8. React Query update cache dan re-render UI
```

### 2. HTTP Request Details

**Request Headers**:
```
GET /admin/jobs?search=john&page=1&limit=50&sort_by=created_at&sort_order=DESC
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Response Format**:
```json
{
  "success": true,
  "message": "Jobs retrieved successfully",
  "data": {
    "jobs": [
      {
        "id": "job-uuid",
        "job_id": "job-123",
        "user_id": "user-uuid",
        "status": "completed",
        "assessment_name": "AI-Driven Talent Mapping",
        "created_at": "2025-10-16T10:00:00.000Z",
        "user": {
          "id": "user-uuid",
          "email": "john.doe@example.com",
          "username": "johndoe"
        }
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 50,
      "totalPages": 1
    }
  }
}
```

### 3. Error Handling

**Frontend Error Handling**:
- Loading states selama fetch
- Error boundaries untuk unexpected errors
- Retry mechanism via React Query

**Backend Error Handling**:
- Input validation untuk search parameter
- SQL injection prevention
- Rate limiting untuk search requests
- Timeout handling untuk long-running queries

### 4. Caching Strategy

**Frontend Caching**:
- React Query cache per filter combination
- Cache invalidation saat filters berubah
- Background refetch untuk data stale

**Backend Caching** (opsional):
- Redis caching untuk popular search terms
- Database query result caching
- CDN caching untuk static responses

## Kesimpulan

### Keunggulan Implementasi

1. **Real-time Search**: User experience yang smooth tanpa delay
2. **Multi-field Search**: Fleksibilitas mencari di email, username, atau assessment
3. **Performance**: Database-level search dengan optimasi
4. **Scalability**: Pagination dan caching untuk handle large datasets
5. **Maintainability**: Separation of concerns antara frontend dan backend

### Potensi Improvements

1. **Debounced Search**: Tambahkan debounce untuk reduce API calls saat user mengetik cepat
2. **Search Suggestions**: Auto-complete berdasarkan existing data
3. **Advanced Filters**: Filter berdasarkan multiple criteria simultaneously
4. **Search Analytics**: Track popular search terms untuk optimization
5. **Fuzzy Search**: Algoritma yang lebih toleran terhadap typo

### Testing Considerations

1. **Unit Tests**: Test search logic di frontend dan backend
2. **Integration Tests**: Test end-to-end search functionality
3. **Performance Tests**: Load testing untuk search dengan large datasets
4. **Edge Cases**: Empty search, special characters, long search terms

---

**Catatan**: Implementasi backend mungkin bervariasi tergantung pada teknologi database dan framework yang digunakan. Dokumentasi ini didasarkan pada spesifikasi API dan praktik terbaik umum.
