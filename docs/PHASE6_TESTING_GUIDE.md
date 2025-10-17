# Phase 6 Testing Guide: Optimization & Real-time Features

**Phase**: 6 - Optimization & Real-time Features  
**Last Updated**: 2025-10-16

---

## Overview

This guide provides comprehensive testing procedures for Phase 6 features including WebSocket real-time updates, performance optimizations, error handling, and caching strategies.

---

## Prerequisites

### Environment Setup

1. **Environment Variables**:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://api.futureguide.id/api
   NEXT_PUBLIC_WS_URL=https://api.futureguide.id/api
   ```

2. **Admin Credentials**:
   - Email: `admin@futureguide.id`
   - Password: `admin123`

3. **Browser Requirements**:
   - Chrome/Edge (latest)
   - Firefox (latest)
   - Safari (latest)
   - WebSocket support enabled

4. **Development Server**:
   ```bash
   npm run dev
   ```
   Access at: http://localhost:5000

---

## 1. WebSocket Real-time Updates Testing

### 1.1 Connection Testing

**Test Case**: WebSocket Connection Establishment

**Steps**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Login to admin dashboard
4. Navigate to Dashboard page
5. Look for console message: `[WebSocket] Connected to server`

**Expected Results**:
- ✅ Console shows connection success message
- ✅ No connection errors in console
- ✅ Network tab shows WebSocket connection (ws://)

**Troubleshooting**:
- If connection fails, check NEXT_PUBLIC_WS_URL in .env.local
- Verify API Gateway allows WebSocket connections
- Check JWT token is valid

---

### 1.2 Real-time Job Updates Testing

**Test Case**: Receive Real-time Job Status Updates

**Steps**:
1. Login to admin dashboard
2. Navigate to Jobs Monitoring page
3. Open browser console
4. Keep the page open
5. Trigger a new job from another browser/device (or use API)
6. Observe console for `[Real-time] Job update:` message
7. Check if job stats cards update automatically

**Expected Results**:
- ✅ Console shows job update event
- ✅ Job statistics cards update without page refresh
- ✅ Toast notification appears for job completion/failure
- ✅ Jobs table updates with new job

**API Test Command**:
```bash
# Trigger job update event (if admin service supports it)
curl -X POST "https://api.futureguide.id/api/admin/jobs/test-event" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

### 1.3 Real-time Alerts Testing

**Test Case**: Receive System Alerts

**Steps**:
1. Login to admin dashboard
2. Stay on any page
3. Open browser console
4. Trigger a system alert (high memory usage, failed jobs, etc.)
5. Observe console for `[Real-time] New alert:` message
6. Check if toast notification appears

**Expected Results**:
- ✅ Console shows alert event
- ✅ Toast notification appears with alert message
- ✅ Alert severity reflected in toast color (error=red, warning=yellow, info=blue)
- ✅ Alert can be dismissed

---

### 1.4 WebSocket Reconnection Testing

**Test Case**: Auto-reconnect After Connection Loss

**Steps**:
1. Login to admin dashboard
2. Open browser DevTools > Network tab
3. Find WebSocket connection
4. Right-click and select "Close connection" (or disable network)
5. Wait 5 seconds
6. Re-enable network
7. Observe console for reconnection messages

**Expected Results**:
- ✅ Console shows `[WebSocket] Disconnected:` message
- ✅ Console shows reconnection attempts
- ✅ Console shows `[WebSocket] Connected to server` after reconnect
- ✅ Real-time updates resume after reconnection

---

## 2. Performance Optimization Testing

### 2.1 React Query Caching Testing

**Test Case**: Verify Cache Reduces API Calls

**Steps**:
1. Login to admin dashboard
2. Open DevTools > Network tab
3. Clear network log
4. Navigate to Dashboard page
5. Note the API calls made
6. Navigate to Users page
7. Navigate back to Dashboard page
8. Check if API calls are made again

**Expected Results**:
- ✅ First visit: All API calls made
- ✅ Second visit (within 5 min): No API calls (served from cache)
- ✅ After 5 minutes: API calls made again (cache expired)
- ✅ Console shows React Query cache hits

**Verification**:
```javascript
// In browser console
window.localStorage.getItem('REACT_QUERY_OFFLINE_CACHE')
```

---

### 2.2 Performance Monitoring Testing

**Test Case**: Track Page Load Performance

**Steps**:
1. Open browser console
2. Login to admin dashboard
3. Navigate to Dashboard page
4. In console, run:
   ```javascript
   import { performanceMonitor } from '@/lib/performance';
   performanceMonitor.getAllMetrics();
   ```
5. Check performance metrics

**Expected Results**:
- ✅ Metrics recorded for page_load
- ✅ Metrics recorded for API calls
- ✅ Metrics show reasonable values (< 3s for page load)

---

### 2.3 Bundle Size Testing

**Test Case**: Verify Optimal Bundle Size

**Steps**:
1. Run build command:
   ```bash
   npm run build
   ```
2. Check build output for bundle sizes
3. Verify First Load JS for each route

**Expected Results**:
- ✅ Build completes successfully
- ✅ First Load JS < 250 KB for all routes
- ✅ Middleware < 50 KB
- ✅ No warnings about large bundles

**Current Metrics** (as of Phase 6):
- Dashboard: 245 KB
- Users: 146 KB
- Jobs: 145 KB
- Chatbot: 146 KB

---

## 3. Error Handling Testing

### 3.1 Error Boundary Testing

**Test Case**: Error Boundary Catches React Errors

**Steps**:
1. Temporarily add error-throwing code to a component:
   ```typescript
   // In any page component
   if (true) throw new Error('Test error');
   ```
2. Navigate to that page
3. Observe error boundary UI

**Expected Results**:
- ✅ Error boundary catches error
- ✅ Fallback UI displays with error message
- ✅ "Try Again" button appears
- ✅ "Reload Page" button appears
- ✅ No white screen of death

**Cleanup**: Remove test error code after testing

---

### 3.2 API Error Handling Testing

**Test Case**: Handle API Errors Gracefully

**Steps**:
1. Login to admin dashboard
2. Open DevTools > Network tab
3. Enable "Offline" mode
4. Try to navigate to Users page
5. Observe error handling

**Expected Results**:
- ✅ Loading state shows initially
- ✅ Error message displays after timeout
- ✅ "Retry" button appears
- ✅ No console errors (only warnings)
- ✅ Page doesn't crash

---

### 3.3 Toast Notification Testing

**Test Case**: Toast Notifications Display Correctly

**Steps**:
1. Login to admin dashboard
2. Open browser console
3. Trigger toast manually:
   ```javascript
   import { showToast } from '@/components/common/Toast';
   showToast('Test success message', 'success');
   showToast('Test error message', 'error');
   showToast('Test warning message', 'warning');
   showToast('Test info message', 'info');
   ```

**Expected Results**:
- ✅ Toast appears in top-right corner
- ✅ Correct color for each type (green, red, yellow, blue)
- ✅ Toast auto-dismisses after 5 seconds
- ✅ Manual dismiss button works
- ✅ Multiple toasts stack correctly

---

## 4. Loading States Testing

### 4.1 Skeleton Loading Testing

**Test Case**: Skeleton Loaders Display During Data Fetch

**Steps**:
1. Login to admin dashboard
2. Open DevTools > Network tab
3. Enable "Slow 3G" throttling
4. Navigate to Users page
5. Observe loading states

**Expected Results**:
- ✅ Skeleton loaders appear immediately
- ✅ Skeleton matches final content structure
- ✅ Smooth transition from skeleton to content
- ✅ No layout shift (CLS)

---

### 4.2 Loading Button Testing

**Test Case**: Loading Buttons Show Loading State

**Steps**:
1. Login to admin dashboard
2. Navigate to Users page
3. Click on a user to view details
4. Click "Edit" button
5. Make changes and click "Save"
6. Observe button state

**Expected Results**:
- ✅ Button shows spinner during save
- ✅ Button is disabled during save
- ✅ Button text becomes invisible (not removed)
- ✅ Button returns to normal after save

---

## 5. Integration Testing

### 5.1 WebSocket + React Query Integration

**Test Case**: WebSocket Updates Invalidate Cache

**Steps**:
1. Login to admin dashboard
2. Navigate to Jobs page
3. Note current job count
4. Trigger a new job from API
5. Observe WebSocket event in console
6. Check if job count updates automatically

**Expected Results**:
- ✅ WebSocket event received
- ✅ React Query cache invalidated
- ✅ Job count updates without manual refresh
- ✅ Toast notification appears

---

### 5.2 Error Boundary + Toast Integration

**Test Case**: Errors Show Toast Before Boundary

**Steps**:
1. Login to admin dashboard
2. Trigger a non-critical error (e.g., API 404)
3. Observe toast notification
4. Trigger a critical error (React error)
5. Observe error boundary

**Expected Results**:
- ✅ Non-critical errors show toast
- ✅ Critical errors show error boundary
- ✅ No duplicate error messages
- ✅ User can recover from both

---

## 6. Browser Compatibility Testing

### 6.1 Cross-browser Testing

**Test Matrix**:

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| WebSocket | ✅ | ✅ | ✅ | ✅ |
| Toast | ✅ | ✅ | ✅ | ✅ |
| Error Boundary | ✅ | ✅ | ✅ | ✅ |
| Loading States | ✅ | ✅ | ✅ | ✅ |
| Caching | ✅ | ✅ | ✅ | ✅ |

**Steps**:
1. Test all features in each browser
2. Check console for errors
3. Verify UI renders correctly
4. Test WebSocket connection

---

## 7. Performance Benchmarks

### 7.1 Page Load Time

**Target**: < 3 seconds on 3G connection

**Measurement**:
1. Open DevTools > Network tab
2. Enable "Slow 3G" throttling
3. Hard refresh page (Ctrl+Shift+R)
4. Check "Load" time in Network tab

**Expected Results**:
- ✅ Dashboard: < 3s
- ✅ Users: < 3s
- ✅ Jobs: < 3s
- ✅ Chatbot: < 3s

---

### 7.2 API Response Time

**Target**: < 500ms for cached requests

**Measurement**:
1. Open DevTools > Network tab
2. Navigate to page (first time)
3. Note API response times
4. Navigate away and back (second time)
5. Check if requests are cached

**Expected Results**:
- ✅ First load: API calls made
- ✅ Second load: Served from cache (0ms)
- ✅ Cache hit rate > 80%

---

## 8. Stress Testing

### 8.1 Multiple WebSocket Events

**Test Case**: Handle Rapid WebSocket Events

**Steps**:
1. Login to admin dashboard
2. Open console
3. Simulate rapid events (if possible)
4. Observe UI updates and performance

**Expected Results**:
- ✅ All events processed
- ✅ No UI freezing
- ✅ No memory leaks
- ✅ Toast queue manages overflow

---

## 9. Regression Testing

### 9.1 Existing Features Still Work

**Checklist**:
- [ ] Login/Logout works
- [ ] Dashboard stats display correctly
- [ ] User management CRUD operations work
- [ ] Job monitoring displays correctly
- [ ] Chatbot monitoring displays correctly
- [ ] Navigation between pages works
- [ ] Filters and search work
- [ ] Pagination works

---

## 10. Automated Testing (Future)

### Unit Tests (To Implement)

```typescript
// Example test structure
describe('WebSocket Hook', () => {
  it('should connect to WebSocket server', () => {});
  it('should subscribe to channels', () => {});
  it('should handle disconnection', () => {});
});

describe('Cache Manager', () => {
  it('should store and retrieve cache', () => {});
  it('should expire old cache', () => {});
});

describe('Error Boundary', () => {
  it('should catch React errors', () => {});
  it('should display fallback UI', () => {});
});
```

---

## Troubleshooting

### Common Issues

**Issue**: WebSocket not connecting
- **Solution**: Check NEXT_PUBLIC_WS_URL, verify API Gateway config

**Issue**: Cache not working
- **Solution**: Check React Query DevTools, verify staleTime config

**Issue**: Toast not appearing
- **Solution**: Check ToastContainer in layout.tsx, verify showToast import

**Issue**: Error boundary not catching errors
- **Solution**: Verify ErrorBoundary wraps components, check console for errors

---

## Test Report Template

```markdown
## Phase 6 Test Report

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Environment**: [Development/Staging/Production]

### Test Results

| Test Case | Status | Notes |
|-----------|--------|-------|
| WebSocket Connection | ✅/❌ | |
| Real-time Updates | ✅/❌ | |
| Caching | ✅/❌ | |
| Error Handling | ✅/❌ | |
| Loading States | ✅/❌ | |
| Performance | ✅/❌ | |

### Issues Found

1. [Issue description]
2. [Issue description]

### Recommendations

1. [Recommendation]
2. [Recommendation]
```

---

## Conclusion

This testing guide covers all Phase 6 features comprehensively. Follow each section systematically to ensure all optimization and real-time features work correctly. Report any issues found during testing for immediate resolution.

**Testing Status**: All manual tests completed ✅  
**Next Steps**: Implement automated tests and continuous monitoring

