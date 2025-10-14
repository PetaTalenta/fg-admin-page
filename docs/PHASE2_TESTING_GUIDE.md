# Phase 2 Testing Guide - Dashboard Overview Page

**Phase**: 2 - Dashboard Overview Page  
**Last Updated**: 2025-10-14  
**Status**: Ready for Testing

---

## Overview

This guide provides comprehensive testing procedures for the Dashboard Overview Page implemented in Phase 2. It covers manual testing, automated testing strategies, and validation criteria.

---

## Prerequisites

### Environment Setup
1. Ensure the development server is running:
   ```bash
   npm run dev
   ```
2. Admin user credentials for login
3. Backend API service running at `https://api.futureguide.id/api`
4. Valid JWT token (obtained through login)

### Test Data Requirements
- At least 10 jobs in the system (various statuses)
- At least 5 users registered
- At least 5 conversations with messages
- Multiple AI models used in conversations

---

## Manual Testing Checklist

### 1. Dashboard Page Load

#### Test Case 1.1: Initial Page Load
**Steps**:
1. Login to admin dashboard
2. Navigate to dashboard (default landing page)
3. Observe loading states

**Expected Results**:
- ✅ Skeleton loading states appear immediately
- ✅ All 11 stat cards load with data
- ✅ Charts render with data
- ✅ Recent jobs table populates
- ✅ Top models card displays
- ✅ No console errors
- ✅ Page loads within 2 seconds

**Validation**:
- [ ] All stats cards show numeric values (not "-")
- [ ] Charts display data points
- [ ] Recent jobs table has at least 1 row
- [ ] Top models card shows at least 1 model

---

### 2. Statistics Cards Testing

#### Test Case 2.1: Job Statistics Cards
**Cards to Test**:
- Total Jobs
- Jobs Completed
- Jobs Failed
- Success Rate

**Steps**:
1. Verify each card displays a number
2. Check success rate is a percentage
3. Verify color coding (blue, green, red, purple)

**Expected Results**:
- ✅ Total Jobs = Completed + Failed + Processing + Queued
- ✅ Success Rate = (Completed / Total) * 100
- ✅ Icons display correctly
- ✅ Hover effects work

**Validation**:
- [ ] Numbers match API response
- [ ] Success rate calculation is correct
- [ ] Cards are responsive on mobile

#### Test Case 2.2: User Statistics Cards
**Cards to Test**:
- Total Users
- New Users Today
- Active Users Today

**Steps**:
1. Verify user counts display
2. Check "New Users Today" updates at midnight
3. Verify "Active Today" reflects last 24h activity

**Expected Results**:
- ✅ All user counts are non-negative integers
- ✅ New Users Today ≤ Total Users
- ✅ Active Today ≤ Total Users

**Validation**:
- [ ] User counts match database
- [ ] Cards update on data refresh

#### Test Case 2.3: Chatbot Statistics Cards
**Cards to Test**:
- Total Conversations
- Total Messages
- Avg Response Time
- Total Tokens Used

**Steps**:
1. Verify conversation and message counts
2. Check response time is in seconds (converted from ms)
3. Verify token count is formatted with commas

**Expected Results**:
- ✅ Total Messages ≥ Total Conversations
- ✅ Avg Response Time shows in seconds with 2 decimals
- ✅ Token count formatted (e.g., "1,234,567")

**Validation**:
- [ ] Response time is reasonable (< 30s)
- [ ] Token count matches API

---

### 3. Charts Testing

#### Test Case 3.1: Job Trend Chart
**Steps**:
1. Verify chart displays last 7 days
2. Hover over data points to see tooltips
3. Check legend shows Total, Completed, Failed
4. Verify line colors (blue, green, red)

**Expected Results**:
- ✅ X-axis shows dates (e.g., "Oct 8", "Oct 9")
- ✅ Y-axis shows job counts
- ✅ Three lines visible (if data exists)
- ✅ Tooltips show exact values on hover
- ✅ Chart is responsive

**Validation**:
- [ ] Data points match date range
- [ ] Total line ≥ Completed + Failed lines
- [ ] Chart resizes on window resize

#### Test Case 3.2: User Growth Chart
**Steps**:
1. Verify chart displays last 7 days
2. Check area chart with purple gradient
3. Hover to see new user counts per day
4. Verify dates on X-axis

**Expected Results**:
- ✅ Area chart with gradient fill
- ✅ Smooth curve (monotone interpolation)
- ✅ Tooltips show "New Users" count
- ✅ Chart is responsive

**Validation**:
- [ ] Gradient displays correctly
- [ ] Data matches user registration dates
- [ ] Chart resizes properly

---

### 4. Recent Jobs Table Testing

#### Test Case 4.1: Table Display
**Steps**:
1. Verify table shows 10 most recent jobs
2. Check columns: User, Job ID, Assessment, Status, Created At
3. Verify status badges have correct colors
4. Check date formatting

**Expected Results**:
- ✅ Maximum 10 rows displayed
- ✅ Jobs sorted by created_at DESC (newest first)
- ✅ Status badges color-coded:
  - Queued: Yellow
  - Processing: Blue
  - Completed: Green
  - Failed: Red
  - Cancelled: Gray
- ✅ Dates formatted as "Oct 14, 2025, 10:30 AM"

**Validation**:
- [ ] All 10 jobs have user email
- [ ] Job IDs are truncated (8 chars + "...")
- [ ] Status badges match job status

#### Test Case 4.2: Navigation Links
**Steps**:
1. Click on user email link
2. Click on job ID link
3. Click "View all jobs →" link

**Expected Results**:
- ✅ User email navigates to `/users/{user_id}`
- ✅ Job ID navigates to `/jobs/{job_id}`
- ✅ "View all jobs" navigates to `/jobs`
- ✅ Links have hover effects (underline, color change)

**Validation**:
- [ ] Navigation works without page reload
- [ ] Correct pages load

#### Test Case 4.3: Empty State
**Steps**:
1. Test with no jobs in system (or mock empty response)

**Expected Results**:
- ✅ Table shows "No jobs found" message
- ✅ No errors in console

---

### 5. Top Models Card Testing

#### Test Case 5.1: Model Display
**Steps**:
1. Verify top 5 models displayed
2. Check each model shows:
   - Model name
   - Usage count
   - Usage percentage
   - Total tokens
   - Avg processing time
   - Free/Paid badge
3. Verify progress bars

**Expected Results**:
- ✅ Models sorted by usage count (descending)
- ✅ Progress bars proportional to usage
- ✅ Free models have green "Free" badge
- ✅ Percentages add up to ≤ 100%
- ✅ Token counts formatted with commas
- ✅ Processing time in milliseconds

**Validation**:
- [ ] Top model has longest progress bar
- [ ] Free/Paid indicators correct
- [ ] Summary stats match model list

#### Test Case 5.2: Summary Statistics
**Steps**:
1. Check "Free Models" count and percentage
2. Check "Paid Models" count
3. Verify total models count in header

**Expected Results**:
- ✅ Free + Paid models = Total models
- ✅ Free model percentage calculated correctly
- ✅ Summary matches displayed models

**Validation**:
- [ ] Calculations are accurate
- [ ] Summary updates with data

---

### 6. Real-time Updates Testing

#### Test Case 6.1: Auto-refresh
**Steps**:
1. Keep dashboard open for 30+ seconds
2. Observe network tab for API calls
3. Verify data updates without page reload

**Expected Results**:
- ✅ Stats refresh every 30 seconds
- ✅ Trends refresh every 60 seconds
- ✅ Recent jobs refresh every 30 seconds
- ✅ No page flicker or layout shift
- ✅ Loading states don't show on background refresh

**Validation**:
- [ ] API calls occur at correct intervals
- [ ] Data updates smoothly
- [ ] No performance degradation

#### Test Case 6.2: Window Focus Refetch
**Steps**:
1. Switch to another tab/window
2. Wait 2+ minutes
3. Switch back to dashboard tab

**Expected Results**:
- ✅ Data refetches immediately on focus
- ✅ Fresh data displayed
- ✅ No errors

**Validation**:
- [ ] Refetch triggered on focus
- [ ] Data is current

---

### 7. Responsive Design Testing

#### Test Case 7.1: Mobile View (< 640px)
**Steps**:
1. Resize browser to 375px width (iPhone SE)
2. Verify layout adapts

**Expected Results**:
- ✅ Stats cards: 1 column
- ✅ Charts: Full width, scrollable if needed
- ✅ Recent jobs table: Horizontal scroll
- ✅ Top models card: Full width
- ✅ All text readable
- ✅ Touch targets ≥ 44px

**Validation**:
- [ ] No horizontal overflow
- [ ] All content accessible
- [ ] Navigation works

#### Test Case 7.2: Tablet View (640px - 1024px)
**Steps**:
1. Resize to 768px width (iPad)
2. Verify layout

**Expected Results**:
- ✅ Stats cards: 2 columns
- ✅ Charts: 1 column (stacked)
- ✅ Recent jobs + Top models: Stacked
- ✅ Proper spacing

**Validation**:
- [ ] Layout looks balanced
- [ ] Charts readable

#### Test Case 7.3: Desktop View (> 1024px)
**Steps**:
1. View at 1920px width
2. Verify optimal layout

**Expected Results**:
- ✅ Stats cards: 4 columns
- ✅ Charts: 2 columns side-by-side
- ✅ Recent jobs (2/3 width) + Top models (1/3 width)
- ✅ Proper spacing and alignment

**Validation**:
- [ ] Layout uses space efficiently
- [ ] No excessive whitespace

---

### 8. Error Handling Testing

#### Test Case 8.1: API Error
**Steps**:
1. Simulate API failure (disconnect network or mock error)
2. Observe error handling

**Expected Results**:
- ✅ Red error banner appears at top
- ✅ Error message: "Error loading dashboard data"
- ✅ Suggestion: "Please try refreshing the page"
- ✅ Existing cached data still visible (if available)
- ✅ No app crash

**Validation**:
- [ ] Error UI is user-friendly
- [ ] No technical error details exposed
- [ ] Retry mechanism available

#### Test Case 8.2: Partial Data Failure
**Steps**:
1. Mock one endpoint failure (e.g., jobs stats fails)
2. Verify other data still loads

**Expected Results**:
- ✅ Failed stat cards show "-" or loading state
- ✅ Other cards display data normally
- ✅ Charts with available data render
- ✅ Error logged to console (for debugging)

**Validation**:
- [ ] Partial failure doesn't break entire page
- [ ] User can still see available data

---

### 9. Performance Testing

#### Test Case 9.1: Load Time
**Steps**:
1. Clear browser cache
2. Hard refresh dashboard (Ctrl+Shift+R)
3. Measure load time with DevTools

**Expected Results**:
- ✅ First Contentful Paint < 1.8s
- ✅ Largest Contentful Paint < 2.5s
- ✅ Time to Interactive < 2s
- ✅ Cumulative Layout Shift < 0.1

**Validation**:
- [ ] Lighthouse score > 90
- [ ] No layout shifts during load

#### Test Case 9.2: Memory Usage
**Steps**:
1. Open DevTools Memory profiler
2. Take heap snapshot
3. Keep dashboard open for 5 minutes
4. Take another snapshot

**Expected Results**:
- ✅ No memory leaks
- ✅ Memory usage stable (< 50MB increase)
- ✅ No detached DOM nodes

**Validation**:
- [ ] Memory usage acceptable
- [ ] No leaks detected

---

## Automated Testing

### Unit Tests (To Be Implemented)

```typescript
// Example test structure

describe('StatsCard', () => {
  it('renders with correct data', () => {});
  it('shows loading state', () => {});
  it('displays trend indicator', () => {});
});

describe('useDashboardStats', () => {
  it('fetches all stats in parallel', () => {});
  it('combines data correctly', () => {});
  it('handles errors gracefully', () => {});
});
```

### Integration Tests (To Be Implemented)

```typescript
describe('Dashboard Page', () => {
  it('loads all data on mount', () => {});
  it('refetches on interval', () => {});
  it('handles API errors', () => {});
});
```

### E2E Tests (To Be Implemented)

```typescript
// Playwright test example
test('dashboard displays all sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Dashboard Overview');
  // ... more assertions
});
```

---

## Bug Reporting Template

If you find issues during testing, report using this template:

```markdown
**Bug Title**: [Brief description]

**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:

**Actual Behavior**:

**Screenshots**: [If applicable]

**Environment**:
- Browser: 
- OS: 
- Screen size: 

**Console Errors**: [If any]
```

---

## Sign-off Checklist

Before marking Phase 2 as complete, verify:

- [ ] All manual test cases passed
- [ ] No critical or high severity bugs
- [ ] Performance metrics meet targets
- [ ] Responsive design works on all breakpoints
- [ ] Error handling is user-friendly
- [ ] Real-time updates working
- [ ] Navigation links functional
- [ ] Data accuracy verified against API
- [ ] No console errors or warnings
- [ ] Code reviewed and approved

---

## Next Steps After Testing

1. Fix any identified bugs
2. Implement automated tests
3. Performance optimization if needed
4. Update documentation with findings
5. Deploy to staging environment
6. Proceed to Phase 3

---

**Prepared by**: AI Agent  
**Review Required**: Yes  
**Approved by**: [Pending]

