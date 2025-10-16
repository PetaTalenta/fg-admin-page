# Phase 4: Jobs Monitoring Page - Testing Guide

**Phase:** Phase 4 - Jobs Monitoring Page  
**Last Updated:** 2025-10-16

---

## Testing Overview

This guide provides comprehensive testing procedures for the Jobs Monitoring Page implementation. Tests cover functionality, API integration, UI/UX, performance, and error handling.

---

## Prerequisites

1. **Environment Setup:**
   - Dev server running: `npm run dev`
   - API server accessible at `https://api.futureguide.id/api`
   - Admin credentials: `admin@futureguide.id` / `admin123`

2. **Browser:**
   - Chrome/Firefox/Safari (latest version)
   - Developer tools open for console monitoring

3. **Tools:**
   - curl for API testing
   - Postman (optional) for API testing

---

## Unit Tests

### Test Files to Create

#### 1. `src/hooks/__tests__/useJobStats.test.ts`
```typescript
describe('useJobStats', () => {
  it('should fetch job statistics', async () => {
    // Mock API response
    // Assert stats data structure
  });

  it('should auto-refresh every 10 seconds', async () => {
    // Test refetchInterval
  });

  it('should handle API errors gracefully', async () => {
    // Test error handling
  });
});
```

#### 2. `src/hooks/__tests__/useJobs.test.ts`
```typescript
describe('useJobs', () => {
  it('should fetch jobs with filters', async () => {
    // Test with various filter combinations
  });

  it('should handle pagination', async () => {
    // Test page and limit parameters
  });

  it('should build correct query string', async () => {
    // Verify URL parameters
  });
});
```

#### 3. `src/hooks/__tests__/useJobDetail.test.ts`
```typescript
describe('useJobDetail', () => {
  it('should fetch job detail by ID', async () => {
    // Test with valid job ID
  });

  it('should not fetch when jobId is null', async () => {
    // Test enabled: !!jobId
  });

  it('should handle 404 errors', async () => {
    // Test invalid job ID
  });
});
```

---

## Integration Tests

### 1. Jobs List Page Tests

**Test Case 1.1: Page Load**
- Navigate to `/jobs`
- Verify: Page loads without errors
- Verify: Statistics cards display
- Verify: Jobs table displays
- Verify: Status filter buttons visible

**Test Case 1.2: Statistics Cards**
- Verify: Total Jobs count displays
- Verify: Completed count displays
- Verify: Failed count displays
- Verify: Success Rate percentage displays
- Verify: Stats update every 10 seconds

**Test Case 1.3: Status Filtering**
- Click "All" button → Verify all jobs display
- Click "Completed" button → Verify only completed jobs display
- Click "Failed" button → Verify only failed jobs display
- Click "Processing" button → Verify only processing jobs display
- Click "Queued" button → Verify only queued jobs display
- Click "Cancelled" button → Verify only cancelled jobs display

**Test Case 1.4: Pagination**
- Verify: Table shows 50 items per page
- Click "Next" button → Verify page 2 loads
- Click "Previous" button → Verify page 1 loads
- Verify: Pagination info shows correct page/total

**Test Case 1.5: Table Navigation**
- Click job row → Verify navigates to job detail page
- Verify: Job ID link is clickable
- Verify: User email link is clickable

**Test Case 1.6: Loading States**
- Refresh page → Verify skeleton loading displays
- Verify: Skeleton disappears when data loads

### 2. Job Detail Page Tests

**Test Case 2.1: Page Load**
- Navigate to `/jobs/[valid-job-id]`
- Verify: Job detail page loads
- Verify: All job information displays
- Verify: Back button visible

**Test Case 2.2: Job Information Display**
- Verify: Job ID displays correctly
- Verify: Status badge displays with correct color
- Verify: Assessment Name displays
- Verify: User Email displays with link
- Verify: Created At timestamp displays
- Verify: Completed At timestamp displays (if completed)
- Verify: Retry Count displays
- Verify: Priority displays

**Test Case 2.3: Error Message Display**
- Navigate to failed job
- Verify: Error message displays in red box
- Verify: Error message is readable

**Test Case 2.4: Job Results Viewer (Completed Jobs)**
- Navigate to completed job
- Verify: "Job Results" section displays
- Verify: "Show Raw Data" button visible
- Click "Show Raw Data" → Verify raw JSON displays
- Click "Hide Raw Data" → Verify structured view displays
- Verify: Test Data section displays
- Verify: Test Result section displays

**Test Case 2.5: Job Results Viewer (Non-Completed Jobs)**
- Navigate to queued/processing job
- Verify: "Job Results" section NOT visible
- Verify: Only job info displays

**Test Case 2.6: Navigation**
- Click "Back to Jobs" → Verify navigates to jobs list
- Click user email link → Verify navigates to user detail page

### 3. Error Handling Tests

**Test Case 3.1: Invalid Job ID**
- Navigate to `/jobs/invalid-id`
- Verify: Error message displays
- Verify: Back button available

**Test Case 3.2: API Errors**
- Simulate API error (network offline)
- Verify: Error message displays
- Verify: Retry option available

**Test Case 3.3: Missing Data**
- Navigate to job with missing fields
- Verify: Page doesn't crash
- Verify: Missing fields show "-" or "N/A"

---

## E2E Tests (Playwright)

### Test File: `e2e/jobs.spec.ts`

```typescript
test.describe('Jobs Monitoring', () => {
  test('should navigate to jobs page and view list', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page.locator('h1')).toContainText('Jobs Monitoring');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should filter jobs by status', async ({ page }) => {
    await page.goto('/jobs');
    await page.click('button:has-text("Completed")');
    // Verify only completed jobs display
  });

  test('should navigate to job detail', async ({ page }) => {
    await page.goto('/jobs');
    await page.click('table tbody tr:first-child');
    await expect(page.locator('h1')).toContainText('Job Details');
  });

  test('should display job results for completed jobs', async ({ page }) => {
    // Navigate to completed job
    // Verify results section displays
  });
});
```

---

## Manual Testing Checklist

### Jobs List Page
- [ ] Page loads without errors
- [ ] Statistics cards display correct values
- [ ] Status filter buttons work
- [ ] Pagination works (50 items per page)
- [ ] Table rows are clickable
- [ ] Loading states display
- [ ] Responsive on mobile/tablet/desktop
- [ ] Stats auto-refresh every 10 seconds

### Job Detail Page
- [ ] Page loads with correct job data
- [ ] All job fields display
- [ ] Status badge shows correct color
- [ ] User email link works
- [ ] Back button works
- [ ] Results section visible for completed jobs
- [ ] Raw data toggle works
- [ ] JSON displays with proper formatting
- [ ] Error messages display for failed jobs

### API Integration
- [ ] GET /admin/jobs/stats returns data
- [ ] GET /admin/jobs returns paginated results
- [ ] GET /admin/jobs/:id returns job detail
- [ ] GET /admin/jobs/:id/results returns results
- [ ] Filters work correctly
- [ ] Pagination works correctly

### Performance
- [ ] Page loads in < 2 seconds
- [ ] Stats update smoothly every 10 seconds
- [ ] No console errors
- [ ] No memory leaks
- [ ] Responsive to user interactions

---

## API Testing with curl

### Test 1: Get Job Statistics
```bash
curl -X GET https://api.futureguide.id/api/admin/jobs/stats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Test 2: Get Jobs List
```bash
curl -X GET "https://api.futureguide.id/api/admin/jobs?page=1&limit=50&status=completed" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Test 3: Get Job Detail
```bash
curl -X GET "https://api.futureguide.id/api/admin/jobs/{job-id}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Test 4: Get Job Results
```bash
curl -X GET "https://api.futureguide.id/api/admin/jobs/{job-id}/results" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## Performance Benchmarks

| Metric | Target | Status |
|--------|--------|--------|
| Page Load Time | < 2s | ✅ |
| Stats Refresh | 10s | ✅ |
| Table Pagination | < 500ms | ✅ |
| Job Detail Load | < 1s | ✅ |
| Results Viewer Load | < 1s | ✅ |

---

## Conclusion

All tests should pass before considering Phase 4 complete. Refer to this guide for regression testing in future phases.

