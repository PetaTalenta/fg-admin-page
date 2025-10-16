# Phase 3: User Management - Testing Guide

**Version:** 1.0  
**Date:** 2025-10-15  
**Phase:** Phase 3 - User Management Page

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Test Environment Setup](#test-environment-setup)
3. [User List Page Tests](#user-list-page-tests)
4. [User Detail Page Tests](#user-detail-page-tests)
5. [Job Results Detail Tests](#job-results-detail-tests)
6. [Conversation Chats Detail Tests](#conversation-chats-detail-tests)
7. [Integration Tests](#integration-tests)
8. [Performance Tests](#performance-tests)
9. [Responsive Design Tests](#responsive-design-tests)
10. [Error Handling Tests](#error-handling-tests)

---

## Prerequisites

### Required Access
- Admin credentials for FutureGuide Admin Dashboard
- Access to API endpoint: `https://api.futureguide.id/api`
- Valid JWT token for authentication

### Test Data Requirements
- At least 25 users in the database (to test pagination)
- Users with different types: user, admin, superadmin
- Users with different statuses: active, inactive
- Users with different auth providers: local, google, firebase
- At least one user with:
  - Token transaction history
  - Completed jobs
  - Active conversations

### Browser Requirements
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Test Environment Setup

### 1. Start Development Server

```bash
cd /home/rayin/Desktop/fg-admin-page
npm run dev
```

### 2. Verify Environment Variables

Check `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.futureguide.id/api
NEXT_PUBLIC_JWT_TOKEN=<your-jwt-token>
```

### 3. Login to Admin Dashboard

Navigate to: `http://localhost:3000`

---

## User List Page Tests

**URL:** `http://localhost:3000/users`

### Test 1: Page Load
**Steps:**
1. Navigate to `/users`
2. Wait for page to load

**Expected Results:**
- ✅ Page loads without errors
- ✅ User table displays with 7 columns
- ✅ At least 1 user is displayed
- ✅ Pagination controls visible (if > 20 users)
- ✅ Filter controls visible
- ✅ Search bar visible

### Test 2: Search Functionality
**Steps:**
1. Type a username in search bar
2. Wait 500ms (debounce)
3. Observe results

**Expected Results:**
- ✅ Results filter to matching users
- ✅ Search is case-insensitive
- ✅ Searches both username and email
- ✅ "No users found" message if no matches
- ✅ Pagination resets to page 1

**Test Cases:**
- Search by full username
- Search by partial username
- Search by email
- Search by partial email
- Search with special characters
- Clear search (empty string)

### Test 3: User Type Filter
**Steps:**
1. Select "User" from User Type dropdown
2. Observe results
3. Repeat for "Admin" and "Superadmin"

**Expected Results:**
- ✅ Only users of selected type displayed
- ✅ Pagination resets to page 1
- ✅ "All Types" shows all users

### Test 4: Status Filter
**Steps:**
1. Select "Active" from Status dropdown
2. Observe results
3. Select "Inactive"

**Expected Results:**
- ✅ Only users with selected status displayed
- ✅ Status badges match filter
- ✅ "All Status" shows all users

### Test 5: Auth Provider Filter
**Steps:**
1. Select "Local" from Auth Provider dropdown
2. Observe results
3. Repeat for "Google" and "Firebase"

**Expected Results:**
- ✅ Only users with selected provider displayed
- ✅ "All Providers" shows all users

### Test 6: Combined Filters
**Steps:**
1. Apply multiple filters simultaneously
2. Add search query

**Expected Results:**
- ✅ All filters work together (AND logic)
- ✅ Results match all criteria
- ✅ Clear Filters button resets all

### Test 7: Clear Filters
**Steps:**
1. Apply multiple filters
2. Click "Clear Filters" button

**Expected Results:**
- ✅ All filters reset to default
- ✅ Search input cleared
- ✅ All users displayed
- ✅ Pagination resets to page 1

### Test 8: Pagination
**Steps:**
1. Navigate to page 2
2. Navigate to page 3
3. Click "Previous"
4. Click "Next"

**Expected Results:**
- ✅ 20 users per page
- ✅ Page numbers update correctly
- ✅ "Previous" disabled on page 1
- ✅ "Next" disabled on last page
- ✅ Showing X to Y of Z results is accurate

### Test 9: Row Click Navigation
**Steps:**
1. Click on any user row (username link)

**Expected Results:**
- ✅ Navigates to user detail page
- ✅ URL is `/users/[user-id]`
- ✅ Correct user detail displayed

### Test 10: Loading States
**Steps:**
1. Refresh page
2. Observe loading skeleton

**Expected Results:**
- ✅ Skeleton loader displays while loading
- ✅ Smooth transition to actual data
- ✅ No layout shift

---

## User Detail Page Tests

**URL:** `http://localhost:3000/users/[id]`

### Test 11: Page Load
**Steps:**
1. Navigate to a user detail page
2. Wait for page to load

**Expected Results:**
- ✅ User information displays correctly
- ✅ All tabs visible: Info, Tokens, Jobs, Conversations
- ✅ Statistics cards show correct data
- ✅ Back button visible
- ✅ Edit User button visible

### Test 12: User Info Display
**Steps:**
1. Verify all user fields displayed

**Expected Results:**
- ✅ Username, Email, User Type, Status
- ✅ Token Balance, Auth Provider
- ✅ Firebase UID, Federation Status
- ✅ Last Login, Created At
- ✅ All dates formatted correctly

### Test 13: Edit Mode
**Steps:**
1. Click "Edit User" button
2. Modify username
3. Change user_type
4. Change is_active
5. Change federation_status
6. Click "Save Changes"

**Expected Results:**
- ✅ Form fields become editable
- ✅ Save and Cancel buttons appear
- ✅ Changes save successfully
- ✅ Success message displays
- ✅ Page refreshes with new data
- ✅ Edit mode exits

### Test 14: Edit Mode Cancel
**Steps:**
1. Click "Edit User"
2. Make changes
3. Click "Cancel"

**Expected Results:**
- ✅ Changes discarded
- ✅ Original values restored
- ✅ Edit mode exits

### Test 15: Statistics Cards
**Steps:**
1. Verify statistics cards

**Expected Results:**
- ✅ Total Jobs count is accurate
- ✅ Total Conversations count is accurate
- ✅ Token Balance matches user data

### Test 16: Tokens Tab
**Steps:**
1. Click "Tokens" tab
2. Observe token balance and history

**Expected Results:**
- ✅ Current balance displayed prominently
- ✅ Token history table visible
- ✅ "Update Balance" button visible
- ✅ History shows: date, activity, amount, reason, new balance

### Test 17: Update Token Balance (Add)
**Steps:**
1. Click "Update Balance"
2. Enter positive amount (e.g., 1000)
3. Enter reason
4. Click "Update Token Balance"

**Expected Results:**
- ✅ Form validates (amount and reason required)
- ✅ Token balance updates
- ✅ Success message displays
- ✅ Token history refreshes
- ✅ New transaction appears in history
- ✅ Form resets and hides

### Test 18: Update Token Balance (Subtract)
**Steps:**
1. Click "Update Balance"
2. Enter negative amount (e.g., -500)
3. Enter reason
4. Click "Update Token Balance"

**Expected Results:**
- ✅ Token balance decreases
- ✅ Transaction shows negative amount in red
- ✅ New balance is correct

### Test 19: Jobs Tab
**Steps:**
1. Click "Jobs" tab
2. Observe user's jobs

**Expected Results:**
- ✅ Jobs table displays
- ✅ Columns: Job ID, Assessment, Status, Created At, Completed At, Actions
- ✅ Status badges color-coded
- ✅ "View Results" link for completed jobs
- ✅ "No jobs found" message if empty

### Test 20: Conversations Tab
**Steps:**
1. Click "Conversations" tab
2. Observe user's conversations

**Expected Results:**
- ✅ Conversations table displays
- ✅ Columns: Title, Context Type, Status, Messages, Created At, Actions
- ✅ Status badges color-coded
- ✅ "View Chats" link for all conversations
- ✅ "No conversations found" message if empty

### Test 21: Tab Navigation
**Steps:**
1. Click through all tabs
2. Return to Info tab

**Expected Results:**
- ✅ Tab content switches correctly
- ✅ Active tab highlighted
- ✅ Data persists when switching back
- ✅ No unnecessary API calls

---

## Job Results Detail Tests

**URL:** `http://localhost:3000/users/[id]/jobs/[jobId]`

### Test 22: Page Load
**Steps:**
1. From user detail Jobs tab, click "View Results"
2. Wait for page to load

**Expected Results:**
- ✅ Job information card displays
- ✅ Test data section visible
- ✅ Test result section visible
- ✅ Raw responses section visible
- ✅ Result metadata visible
- ✅ Back button visible

### Test 23: Job Information
**Steps:**
1. Verify job info card

**Expected Results:**
- ✅ Job ID displayed
- ✅ Status badge correct
- ✅ Assessment name displayed
- ✅ Completed at timestamp correct

### Test 24: Structured Data Display
**Steps:**
1. Observe test_data and test_result sections

**Expected Results:**
- ✅ Data displayed in readable format
- ✅ Nested objects formatted correctly
- ✅ Key-value pairs aligned

### Test 25: JSON Viewer
**Steps:**
1. Click "Expand" on JSON viewer
2. Click "Copy" button
3. Click "Collapse"

**Expected Results:**
- ✅ JSON expands with syntax highlighting
- ✅ Copy button copies to clipboard
- ✅ "Copied!" message appears briefly
- ✅ JSON collapses correctly

### Test 26: Download Results
**Steps:**
1. Click "Download Results as JSON"

**Expected Results:**
- ✅ File downloads
- ✅ Filename: `job-results-[job-id].json`
- ✅ File contains complete job results
- ✅ JSON is valid and formatted

### Test 27: Back Navigation
**Steps:**
1. Click "Back to User Detail"

**Expected Results:**
- ✅ Returns to user detail page
- ✅ Jobs tab is active
- ✅ User data still loaded

---

## Conversation Chats Detail Tests

**URL:** `http://localhost:3000/users/[id]/conversations/[convId]`

### Test 28: Page Load
**Steps:**
1. From user detail Conversations tab, click "View Chats"
2. Wait for page to load

**Expected Results:**
- ✅ Conversation info card displays
- ✅ Messages display in bubble layout
- ✅ Pagination controls visible (if > 50 messages)
- ✅ Scroll to bottom button visible
- ✅ Back button visible

### Test 29: Conversation Information
**Steps:**
1. Verify conversation info card

**Expected Results:**
- ✅ Conversation ID displayed
- ✅ Status displayed
- ✅ Context type displayed
- ✅ Total messages count correct

### Test 30: Message Bubbles
**Steps:**
1. Observe message layout

**Expected Results:**
- ✅ User messages on right, blue background
- ✅ Assistant messages on left, gray background
- ✅ Sender type labeled
- ✅ Timestamp displayed
- ✅ Content readable and formatted

### Test 31: Message Metadata
**Steps:**
1. Find assistant message with usage data

**Expected Results:**
- ✅ Model used displayed
- ✅ Total tokens displayed
- ✅ Metadata separated from content

### Test 32: Copy Message
**Steps:**
1. Click "Copy" on any message

**Expected Results:**
- ✅ Message content copied to clipboard
- ✅ "Copied!" message appears
- ✅ Button text reverts after 2 seconds

### Test 33: Pagination
**Steps:**
1. If > 50 messages, click "Next"
2. Click "Previous"

**Expected Results:**
- ✅ 50 messages per page
- ✅ Pagination controls work correctly
- ✅ Message count accurate

### Test 34: Scroll to Bottom
**Steps:**
1. Scroll to top of page
2. Click scroll to bottom button

**Expected Results:**
- ✅ Page scrolls smoothly to bottom
- ✅ Button always visible (fixed position)

---

## Integration Tests

### Test 35: Full User Management Flow
**Steps:**
1. Search for a user
2. Click to view detail
3. Edit user information
4. Update token balance
5. View user's jobs
6. View job results
7. View user's conversations
8. View conversation chats
9. Return to user list

**Expected Results:**
- ✅ All navigation works smoothly
- ✅ Data persists correctly
- ✅ No errors in console
- ✅ All updates reflected immediately

### Test 36: Multiple Tab Workflow
**Steps:**
1. Open user detail in new tab
2. Edit user in first tab
3. Refresh second tab

**Expected Results:**
- ✅ Changes visible in second tab after refresh
- ✅ No data conflicts

---

## Performance Tests

### Test 37: Page Load Time
**Steps:**
1. Clear browser cache
2. Navigate to users list
3. Measure load time

**Expected Results:**
- ✅ Initial load < 3 seconds
- ✅ Subsequent loads < 1 second (cached)

### Test 38: Search Debounce
**Steps:**
1. Type quickly in search bar
2. Observe network requests

**Expected Results:**
- ✅ Only one request after 500ms
- ✅ No requests while typing

### Test 39: Cache Effectiveness
**Steps:**
1. View user detail
2. Navigate away
3. Return to same user detail within 5 minutes

**Expected Results:**
- ✅ Data loads instantly from cache
- ✅ No loading skeleton
- ✅ Background refresh after staleTime

---

## Responsive Design Tests

### Test 40: Mobile View (< 768px)
**Steps:**
1. Resize browser to mobile width
2. Test all pages

**Expected Results:**
- ✅ Tables scroll horizontally
- ✅ Filters stack vertically
- ✅ Buttons remain accessible
- ✅ Text readable without zoom
- ✅ Navigation works correctly

### Test 41: Tablet View (768px - 1024px)
**Steps:**
1. Resize browser to tablet width
2. Test all pages

**Expected Results:**
- ✅ Layout adapts appropriately
- ✅ All features accessible
- ✅ No horizontal scroll (except tables)

### Test 42: Desktop View (> 1024px)
**Steps:**
1. Test on full desktop width

**Expected Results:**
- ✅ Optimal layout utilization
- ✅ Multi-column layouts work
- ✅ No excessive whitespace

---

## Error Handling Tests

### Test 43: Network Error
**Steps:**
1. Disconnect internet
2. Try to load users list

**Expected Results:**
- ✅ Error message displays
- ✅ User-friendly error text
- ✅ No app crash

### Test 44: Invalid User ID
**Steps:**
1. Navigate to `/users/invalid-id`

**Expected Results:**
- ✅ Error message displays
- ✅ "User not found" or similar message
- ✅ Back button still works

### Test 45: API Error (500)
**Steps:**
1. Simulate API error (if possible)

**Expected Results:**
- ✅ Error message displays
- ✅ App remains functional
- ✅ Can retry or navigate away

### Test 46: Validation Errors
**Steps:**
1. Try to update token with empty amount
2. Try to update token with empty reason

**Expected Results:**
- ✅ Form validation prevents submission
- ✅ Error messages display
- ✅ Fields highlighted

---

## Test Checklist Summary

### User List Page
- [ ] Page load
- [ ] Search functionality
- [ ] User type filter
- [ ] Status filter
- [ ] Auth provider filter
- [ ] Combined filters
- [ ] Clear filters
- [ ] Pagination
- [ ] Row click navigation
- [ ] Loading states

### User Detail Page
- [ ] Page load
- [ ] User info display
- [ ] Edit mode
- [ ] Edit mode cancel
- [ ] Statistics cards
- [ ] Tokens tab
- [ ] Update token (add)
- [ ] Update token (subtract)
- [ ] Jobs tab
- [ ] Conversations tab
- [ ] Tab navigation

### Job Results Detail
- [ ] Page load
- [ ] Job information
- [ ] Structured data display
- [ ] JSON viewer
- [ ] Download results
- [ ] Back navigation

### Conversation Chats Detail
- [ ] Page load
- [ ] Conversation information
- [ ] Message bubbles
- [ ] Message metadata
- [ ] Copy message
- [ ] Pagination
- [ ] Scroll to bottom

### Integration & Performance
- [ ] Full user management flow
- [ ] Multiple tab workflow
- [ ] Page load time
- [ ] Search debounce
- [ ] Cache effectiveness

### Responsive Design
- [ ] Mobile view
- [ ] Tablet view
- [ ] Desktop view

### Error Handling
- [ ] Network error
- [ ] Invalid user ID
- [ ] API error
- [ ] Validation errors

---

## Reporting Issues

When reporting issues, include:
1. Test number and name
2. Steps to reproduce
3. Expected vs actual result
4. Browser and version
5. Screenshots/console errors
6. Network tab (if API related)

---

## Conclusion

Complete all tests in this guide before marking Phase 3 as production-ready. Document any issues found and ensure they are resolved before deployment.

**Testing Status:** ⏳ PENDING MANUAL TESTING

