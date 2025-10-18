# Rencana Perbaikan Error Endpoint Schools

## Masalah
Error 404 pada endpoint `/admin/schools?page=1&limit=20` di halaman schools. Endpoint ini tidak ada di backend API, sehingga frontend tidak dapat mengambil data schools.

## Analisis Root Cause
- Dari dokumentasi `ADMIN_SERVICE_API_DOCUMENTATION.md`, tidak ada endpoint untuk schools.
- Endpoint yang tersedia: users, jobs, conversations, chatbot, system.
- Schools adalah fitur baru di Fase 2, namun backend belum diupdate untuk mendukungnya.

## Solusi Jangka Pendek (Immediate Fix)
1. **Disable Schools Page**: Sembunyikan menu schools dari sidebar sementara.
2. **Mock Data**: Gunakan data mock untuk development/testing.
3. **Error Handling**: Tambahkan fallback UI untuk menampilkan pesan "Feature coming soon".

## Solusi Jangka Panjang (Backend Implementation)
1. **Tambah Endpoint Schools di Backend**:
   - `GET /admin/schools` - List schools dengan pagination
   - `POST /admin/schools` - Create school
   - `GET /admin/schools/:id` - Get school detail
   - `PUT /admin/schools/:id` - Update school
   - `DELETE /admin/schools/:id` - Delete school

2. **Database Schema**: Pastikan tabel schools ada dengan fields:
   - id, name, address, city, province, postal_code, phone, email, created_at, updated_at

3. **Authentication**: Pastikan endpoint memerlukan JWT token admin.

4. **Update Dokumentasi**: Tambahkan endpoint schools ke `ADMIN_SERVICE_API_DOCUMENTATION.md`.

## Langkah Implementasi
### Step 1: Frontend Temporary Fix
- Edit `src/components/layout/Sidebar.tsx`: Comment out schools menu item.
- Edit `src/app/(dashboard)/schools/page.tsx`: Add mock data atau redirect ke dashboard.

### Step 2: Backend Endpoint Implementation
- Tambah routes di backend untuk `/admin/schools/*`.
- Implementasi CRUD operations dengan proper validation.
- Add database migrations untuk tabel schools jika belum ada.

### Step 3: Testing
- Test semua CRUD operations.
- Verify pagination dan search functionality.
- Update frontend untuk menggunakan real endpoint.

### Step 4: Deployment
- Deploy backend changes.
- Re-enable schools menu di frontend.
- Monitor error logs.

## Timeline
- **Immediate (1-2 jam)**: Disable schools page, add mock data.
- **Short-term (1-2 hari)**: Implement backend endpoints.
- **Testing (1 hari)**: Full testing dan integration.
- **Deployment**: Setelah testing passed.

## Dependencies
- Backend developer untuk implementasi endpoint.
- Database admin untuk schema changes.
- Testing team untuk verification.

## Risk Assessment
- **Low Risk**: Disable feature sementara tidak mempengaruhi functionality lain.
- **Medium Risk**: Backend changes perlu careful testing untuk tidak break existing endpoints.

## Monitoring
- Monitor console logs untuk error 404 lainnya.
- Check API response times setelah deployment.
- User feedback pada schools functionality.

---

**Status**: Ready for implementation
**Priority**: High (blocking schools feature)
**Assignee**: Backend Team
**Estimated Time**: 2-3 days</content>
<parameter name="filePath">schools_endpoint_fix_plan.md
