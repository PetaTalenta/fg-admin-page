# Phase 5 Testing Guide: Chatbot Monitoring Page

**Phase:** 5 - Chatbot Monitoring Page  
**Last Updated:** 2025-10-16  
**Status:** Ready for Testing

---

## Overview

This guide provides comprehensive testing procedures for the Chatbot Monitoring system implemented in Phase 5. It covers unit tests, integration tests, E2E tests, and manual testing checklists.

---

## Prerequisites

### Environment Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add admin credentials to .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.futureguide.id/api
```

### Test Credentials
- **Email:** admin@futureguide.id
- **Password:** admin123

---

## 1. Unit Tests

### 1.1 Hook Tests

#### Test: `useChatbotStats`
```typescript
// src/hooks/__tests__/useChatbotStats.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useChatbotStats } from '../useChatbotStats';

describe('useChatbotStats', () => {
  it('should fetch chatbot statistics', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useChatbotStats(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toHaveProperty('overview');
    expect(result.current.data).toHaveProperty('today');
    expect(result.current.data).toHaveProperty('performance');
    expect(result.current.data).toHaveProperty('tokenUsage');
  });

  it('should auto-refresh every 30 seconds', async () => {
    // Test refetchInterval configuration
  });
});
```

#### Test: `useModels`
```typescript
// src/hooks/__tests__/useModels.test.ts
describe('useModels', () => {
  it('should fetch model usage statistics', async () => {
    // Test model data fetching
  });

  it('should include summary and models array', async () => {
    // Test response structure
  });
});
```

#### Test: `useConversations`
```typescript
// src/hooks/__tests__/useConversations.test.ts
describe('useConversations', () => {
  it('should fetch conversations with default filters', async () => {
    // Test default behavior
  });

  it('should apply status filter', async () => {
    // Test status filtering
  });

  it('should apply search filter', async () => {
    // Test search functionality
  });

  it('should handle pagination', async () => {
    // Test pagination
  });
});
```

#### Test: `useConversationDetail`
```typescript
// src/hooks/__tests__/useConversationDetail.test.ts
describe('useConversationDetail', () => {
  it('should fetch conversation detail', async () => {
    // Test detail fetching
  });

  it('should not fetch without conversation ID', async () => {
    // Test enabled condition
  });
});
```

### 1.2 Component Tests

#### Test: StatsCard Component
```typescript
// Test rendering and data display
describe('StatsCard', () => {
  it('should render title and value', () => {
    // Test basic rendering
  });

  it('should display trend indicator when provided', () => {
    // Test trend display
  });

  it('should show subtitle when provided', () => {
    // Test subtitle
  });
});
```

#### Test: ModelUsageChart Component
```typescript
describe('ModelUsageChart', () => {
  it('should render model bars', () => {
    // Test chart rendering
  });

  it('should calculate percentage correctly', () => {
    // Test percentage calculation
  });

  it('should color-code free vs paid models', () => {
    // Test color coding
  });
});
```

#### Test: ConversationsTable Component
```typescript
describe('ConversationsTable', () => {
  it('should render table headers', () => {
    // Test headers
  });

  it('should render conversation rows', () => {
    // Test row rendering
  });

  it('should show loading skeleton', () => {
    // Test loading state
  });

  it('should render status badges correctly', () => {
    // Test status badges
  });
});
```

#### Test: MessageBubble Component
```typescript
describe('MessageBubble', () => {
  it('should render user messages on right', () => {
    // Test user message alignment
  });

  it('should render assistant messages on left', () => {
    // Test assistant message alignment
  });

  it('should display usage info for assistant messages', () => {
    // Test usage display
  });
});
```

---

## 2. Integration Tests

### 2.1 API Integration Tests

#### Test: Chatbot Stats API
```typescript
describe('Chatbot Stats API Integration', () => {
  it('should fetch stats from API', async () => {
    const response = await fetch('/admin/chatbot/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
```

#### Test: Conversations API with Filters
```typescript
describe('Conversations API Integration', () => {
  it('should filter by status', async () => {
    // Test status filter
  });

  it('should search by title', async () => {
    // Test search
  });

  it('should paginate results', async () => {
    // Test pagination
  });
});
```

### 2.2 React Query Cache Tests

```typescript
describe('React Query Caching', () => {
  it('should cache chatbot stats for 3 minutes', async () => {
    // Test staleTime
  });

  it('should auto-refresh stats every 30 seconds', async () => {
    // Test refetchInterval
  });

  it('should invalidate cache on filter change', async () => {
    // Test cache invalidation
  });
});
```

---

## 3. E2E Tests (Playwright)

### 3.1 Chatbot Overview Page

```typescript
// tests/e2e/chatbot-overview.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Chatbot Overview Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@futureguide.id');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
    
    // Navigate to chatbot page
    await page.click('a[href="/chatbot"]');
    await page.waitForURL('/chatbot');
  });

  test('should display statistics cards', async ({ page }) => {
    await expect(page.locator('text=Total Conversations')).toBeVisible();
    await expect(page.locator('text=Total Messages')).toBeVisible();
    await expect(page.locator('text=Today\'s Activity')).toBeVisible();
    await expect(page.locator('text=Avg Response Time')).toBeVisible();
    await expect(page.locator('text=Total Tokens Used')).toBeVisible();
    await expect(page.locator('text=Active Models')).toBeVisible();
  });

  test('should display model usage chart', async ({ page }) => {
    await expect(page.locator('text=Model Usage Distribution')).toBeVisible();
  });

  test('should display conversations table', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("Title")')).toBeVisible();
    await expect(page.locator('th:has-text("User")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
  });

  test('should filter conversations by status', async ({ page }) => {
    await page.selectOption('select[name="status"]', 'active');
    await page.waitForTimeout(500);
    // Verify filtered results
  });

  test('should search conversations', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'Test');
    await page.waitForTimeout(500);
    // Verify search results
  });

  test('should navigate to conversation detail', async ({ page }) => {
    await page.click('a:has-text("View Details")').first();
    await expect(page).toHaveURL(/\/chatbot\/conversations\/.+/);
  });

  test('should paginate conversations', async ({ page }) => {
    const nextButton = page.locator('button:has-text("Next")');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(500);
      // Verify page changed
    }
  });
});
```

### 3.2 Conversation Detail Page

```typescript
// tests/e2e/conversation-detail.spec.ts
test.describe('Conversation Detail Page', () => {
  test('should display conversation info', async ({ page }) => {
    // Navigate to a conversation
    await page.goto('/chatbot');
    await page.click('a:has-text("View Details")').first();
    
    await expect(page.locator('text=Conversation Information')).toBeVisible();
    await expect(page.locator('text=Context Type')).toBeVisible();
    await expect(page.locator('text=Total Messages')).toBeVisible();
    await expect(page.locator('text=Total Tokens')).toBeVisible();
  });

  test('should display chat messages', async ({ page }) => {
    // Navigate to a conversation
    await page.goto('/chatbot');
    await page.click('a:has-text("View Details")').first();
    
    await expect(page.locator('text=Chat Messages')).toBeVisible();
    // Verify message bubbles are displayed
  });

  test('should paginate messages', async ({ page }) => {
    // Test message pagination
  });

  test('should navigate back to chatbot page', async ({ page }) => {
    // Navigate to a conversation
    await page.goto('/chatbot');
    await page.click('a:has-text("View Details")').first();
    
    await page.click('a:has-text("Back to Chatbot Monitoring")');
    await expect(page).toHaveURL('/chatbot');
  });
});
```

---

## 4. Manual Testing Checklist

### 4.1 Chatbot Overview Page

#### Statistics Cards
- [ ] Total Conversations displays correct number
- [ ] Active conversations count is shown
- [ ] Total Messages displays correct number
- [ ] Average messages per conversation is calculated
- [ ] Today's Activity shows conversations and messages
- [ ] Avg Response Time is displayed in seconds
- [ ] Total Tokens Used shows correct number
- [ ] Prompt and completion tokens breakdown is shown
- [ ] Active Models count is correct
- [ ] Free model percentage is displayed
- [ ] All cards have appropriate icons
- [ ] Loading states show "..." while fetching

#### Model Usage Chart
- [ ] Chart displays all models
- [ ] Bar widths represent usage correctly
- [ ] Free models are colored green
- [ ] Paid models are colored blue (if any)
- [ ] Usage count is displayed for each model
- [ ] Total tokens are shown for each model
- [ ] Average processing time is displayed
- [ ] Chart is responsive on mobile

#### Conversations Table
- [ ] Table displays all columns correctly
- [ ] Conversation titles are shown
- [ ] User emails are displayed
- [ ] Usernames are shown when available
- [ ] Status badges are color-coded correctly
  - [ ] Active: green
  - [ ] Archived: gray
  - [ ] Deleted: red
- [ ] Message counts are displayed
- [ ] Created dates are formatted correctly
- [ ] "View Details" links work
- [ ] Table is scrollable on mobile
- [ ] Loading skeleton appears while fetching

#### Filters
- [ ] Search input accepts text
- [ ] Search filters conversations by title
- [ ] Status dropdown has all options
- [ ] Status filter works correctly
- [ ] Context type dropdown has all options
- [ ] Context type filter works correctly
- [ ] Clear Filters button resets all filters
- [ ] Filters persist in URL
- [ ] Multiple filters can be combined

#### Pagination
- [ ] Shows correct page number
- [ ] Shows total pages
- [ ] Shows total conversations count
- [ ] Previous button disabled on first page
- [ ] Next button disabled on last page
- [ ] Previous button navigates correctly
- [ ] Next button navigates correctly
- [ ] Pagination is responsive on mobile

### 4.2 Conversation Detail Page

#### Navigation
- [ ] Back link navigates to chatbot page
- [ ] Breadcrumb shows correct path
- [ ] Page loads without errors
- [ ] 404 page shows for invalid conversation ID

#### Conversation Info Card
- [ ] Title is displayed correctly
- [ ] Status badge shows correct status
- [ ] Status badge is color-coded
- [ ] User email is shown
- [ ] Context type is displayed
- [ ] Context type is capitalized and formatted
- [ ] Total messages count is correct
- [ ] Total tokens count is correct
- [ ] Total cost is displayed with 4 decimals
- [ ] Created date is formatted correctly

#### Chat Messages
- [ ] Messages section header is visible
- [ ] Total message count is displayed
- [ ] User messages appear on right
- [ ] User messages have blue background
- [ ] Assistant messages appear on left
- [ ] Assistant messages have gray background
- [ ] Message content is displayed correctly
- [ ] Long messages wrap properly
- [ ] Timestamps are shown for all messages
- [ ] Model used is shown for assistant messages
- [ ] Token count is shown for assistant messages
- [ ] Messages are ordered chronologically
- [ ] Loading spinner appears while fetching
- [ ] Empty state shows when no messages

#### Message Pagination
- [ ] Shows correct page number
- [ ] Shows total pages
- [ ] Shows total messages count
- [ ] Previous button disabled on first page
- [ ] Next button disabled on last page
- [ ] Previous button navigates correctly
- [ ] Next button navigates correctly
- [ ] 50 messages per page (or less on last page)

### 4.3 Responsive Design

#### Mobile (< 768px)
- [ ] Statistics cards stack vertically
- [ ] Model chart is readable
- [ ] Table scrolls horizontally
- [ ] Filters stack vertically
- [ ] Pagination controls are accessible
- [ ] Message bubbles are readable
- [ ] Navigation works correctly

#### Tablet (768px - 1024px)
- [ ] Statistics cards in 2 columns
- [ ] Model chart is well-sized
- [ ] Table fits without scroll
- [ ] Filters in 2 columns
- [ ] Message bubbles have good width

#### Desktop (> 1024px)
- [ ] Statistics cards in 3 columns
- [ ] Model chart is well-proportioned
- [ ] Table uses full width
- [ ] Filters in 4 columns
- [ ] Message bubbles have max width

### 4.4 Performance

#### Load Times
- [ ] Chatbot page loads in < 2 seconds
- [ ] Conversation detail loads in < 2 seconds
- [ ] Statistics refresh in < 1 second
- [ ] Filter changes apply in < 500ms
- [ ] Pagination changes in < 500ms

#### Auto-refresh
- [ ] Statistics auto-refresh every 30 seconds
- [ ] Auto-refresh doesn't interrupt user interaction
- [ ] Auto-refresh updates data correctly

#### Caching
- [ ] Navigating back uses cached data
- [ ] Cache invalidates after 5 minutes
- [ ] Filter changes invalidate cache

### 4.5 Error Handling

#### Network Errors
- [ ] Shows error message on API failure
- [ ] Retry button works
- [ ] Graceful degradation on timeout

#### Invalid Data
- [ ] Handles missing conversation gracefully
- [ ] Shows 404 page for invalid ID
- [ ] Handles empty conversations list
- [ ] Handles empty messages list

#### Edge Cases
- [ ] Handles very long conversation titles
- [ ] Handles very long messages
- [ ] Handles conversations with 0 messages
- [ ] Handles models with 0 usage

---

## 5. API Testing with curl

### Test Chatbot Stats
```bash
TOKEN="your_admin_token"

curl -X GET "https://api.futureguide.id/api/admin/chatbot/stats" \
  -H "Authorization: Bearer $TOKEN" \
  -s | jq '.'
```

### Test Models
```bash
curl -X GET "https://api.futureguide.id/api/admin/chatbot/models" \
  -H "Authorization: Bearer $TOKEN" \
  -s | jq '.'
```

### Test Conversations with Filters
```bash
curl -X GET "https://api.futureguide.id/api/admin/conversations?page=1&limit=20&status=active" \
  -H "Authorization: Bearer $TOKEN" \
  -s | jq '.'
```

### Test Conversation Detail
```bash
CONV_ID="conversation-id-here"

curl -X GET "https://api.futureguide.id/api/admin/conversations/$CONV_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -s | jq '.'
```

### Test Conversation Chats
```bash
curl -X GET "https://api.futureguide.id/api/admin/conversations/$CONV_ID/chats?page=1&limit=50" \
  -H "Authorization: Bearer $TOKEN" \
  -s | jq '.'
```

---

## 6. Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter key activates buttons and links
- [ ] Escape key closes modals (if any)
- [ ] Arrow keys navigate pagination

### Screen Reader
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Tables have proper headers
- [ ] Status badges are announced correctly

### Color Contrast
- [ ] Text meets WCAG AA standards
- [ ] Status badges are distinguishable
- [ ] Links are clearly visible

---

## 7. Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Conclusion

This testing guide covers all aspects of the Chatbot Monitoring system. Follow the checklists systematically to ensure comprehensive test coverage. Report any issues found during testing with detailed reproduction steps.

**Testing Status:** Ready for QA  
**Estimated Testing Time:** 4-6 hours for complete manual testing

