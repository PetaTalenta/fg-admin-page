# Phase 1 Testing Guide: Foundation, Authentication & Layout

## Testing Overview

Panduan testing komprehensif untuk Phase 1: Foundation, Authentication & Layout. Testing dilakukan secara bertahap mulai dari unit tests, integration tests, E2E tests, hingga manual testing. Semua tests harus pass sebelum phase dianggap complete.

### Testing Objectives
- Memastikan authentication flow berfungsi dengan benar
- Validasi route protection dan middleware
- Menguji responsivitas layout components
- Verifikasi type safety dan error handling
- Mengukur performance dan user experience

### Testing Environment Setup

#### Prerequisites
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan API base URL dan test credentials

# Setup test database (jika menggunakan local DB)
# Configure test environment variables
```

#### Test Commands
```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- src/components/auth/LoginForm.test.tsx

# Run tests in watch mode
npm run test:watch
```

#### Test Configuration
- **Framework**: Jest + React Testing Library
- **E2E**: Playwright
- **Mocking**: MSW (Mock Service Worker) untuk API mocking
- **Coverage Target**: 80% minimum untuk Phase 1 components

---

## Unit Tests

Unit tests fokus pada testing individual components, hooks, dan utilities secara isolated.

### Authentication Components

#### LoginForm Component
```typescript
// src/components/auth/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginForm from './LoginForm'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('LoginForm', () => {
  it('renders login form with email and password fields', () => {
    render(<LoginForm />, { wrapper: createWrapper() })

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm />, { wrapper: createWrapper() })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('shows error message on login failure', async () => {
    // Mock API error response
    render(<LoginForm />, { wrapper: createWrapper() })

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid@email.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('navigates to dashboard on successful login', async () => {
    // Mock successful login
    const mockRouter = { push: jest.fn() }
    jest.mock('next/navigation', () => ({
      useRouter: () => mockRouter
    }))

    render(<LoginForm />, { wrapper: createWrapper() })

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'admin@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })
})
```

#### Layout Components

#### Sidebar Component
```typescript
// src/components/layout/Sidebar.test.tsx
describe('Sidebar', () => {
  it('renders navigation menu items', () => {
    render(<Sidebar />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Jobs')).toBeInTheDocument()
    expect(screen.getByText('Chatbot')).toBeInTheDocument()
  })

  it('highlights active menu item', () => {
    render(<Sidebar />)

    // Mock current path as /dashboard
    const dashboardLink = screen.getByText('Dashboard')
    expect(dashboardLink).toHaveClass('bg-blue-100') // active class
  })

  it('navigates to correct route on menu click', () => {
    const mockRouter = { push: jest.fn() }
    jest.mock('next/navigation', () => ({
      useRouter: () => mockRouter
    }))

    render(<Sidebar />)

    fireEvent.click(screen.getByText('Users'))
    expect(mockRouter.push).toHaveBeenCalledWith('/users')
  })
})
```

#### Header Component
```typescript
// src/components/layout/Header.test.tsx
describe('Header', () => {
  it('displays user information', () => {
    render(<Header />)

    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('admin@example.com')).toBeInTheDocument()
  })

  it('shows logout button', () => {
    render(<Header />)

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('calls logout function on logout click', () => {
    const mockLogout = jest.fn()
    // Mock useAuth hook
    jest.mock('@/hooks/useAuth', () => ({
      useAuth: () => ({ logout: mockLogout })
    }))

    render(<Header />)

    fireEvent.click(screen.getByRole('button', { name: /logout/i }))
    expect(mockLogout).toHaveBeenCalled()
  })
})
```

### Custom Hooks

#### useAuth Hook
```typescript
// src/hooks/useAuth.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from './useAuth'

describe('useAuth', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    return ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  it('returns initial loading state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.user).toBeNull()
  })

  it('handles successful login', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper()
    })

    act(() => {
      result.current.login.mutate({
        email: 'admin@example.com',
        password: 'password123'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.user).toBeDefined()
    })
  })

  it('handles login error', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper()
    })

    act(() => {
      result.current.login.mutate({
        email: 'invalid@email.com',
        password: 'wrong'
      })
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBeDefined()
    })
  })
})
```

### Utility Functions

#### Utils Functions
```typescript
// src/lib/utils.test.ts
import { formatDate, formatNumber, validateEmail } from './utils'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-10-14T10:30:00Z')
    expect(formatDate(date)).toBe('14 Oct 2025, 10:30')
  })

  it('handles invalid date', () => {
    expect(formatDate(null)).toBe('Invalid Date')
  })
})

describe('formatNumber', () => {
  it('formats number with commas', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('formats decimal numbers', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56')
  })
})

describe('validateEmail', () => {
  it('validates correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })

  it('rejects invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false)
    expect(validateEmail('')).toBe(false)
  })
})
```

---

## Integration Tests

Integration tests fokus pada testing interaksi antara multiple components dan API calls.

### API Client Integration
```typescript
// src/lib/api-client.integration.test.ts
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { apiClient } from './api-client'

const server = setupServer(
  rest.post('https://api.futureguide.id/api/admin/auth/login', (req, res, ctx) => {
    return res(ctx.json({
      user: { id: 1, email: 'admin@example.com' },
      token: 'mock-jwt-token'
    }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('API Client Integration', () => {
  it('makes authenticated request with token', async () => {
    localStorage.setItem('auth-token', 'mock-jwt-token')

    const response = await apiClient.get('/admin/users')

    expect(response.config.headers.Authorization).toBe('Bearer mock-jwt-token')
  })

  it('handles authentication error', async () => {
    server.use(
      rest.get('https://api.futureguide.id/api/admin/users', (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }))
      })
    )

    await expect(apiClient.get('/admin/users')).rejects.toThrow('Unauthorized')
  })

  it('retries on network error', async () => {
    let attemptCount = 0
    server.use(
      rest.get('https://api.futureguide.id/api/admin/users', (req, res, ctx) => {
        attemptCount++
        if (attemptCount < 3) {
          return res(ctx.status(500))
        }
        return res(ctx.json({ users: [] }))
      })
    )

    const response = await apiClient.get('/admin/users')
    expect(attemptCount).toBe(3)
    expect(response.data).toEqual({ users: [] })
  })
})
```

### Authentication Flow Integration
```typescript
// src/hooks/useAuth.integration.test.ts
describe('Authentication Flow Integration', () => {
  it('completes full login flow', async () => {
    // Mock API responses
    server.use(
      rest.post('/admin/auth/login', (req, res, ctx) => {
        return res(ctx.json({
          user: { id: 1, email: 'admin@example.com', user_type: 'admin' },
          token: 'jwt-token-123'
        }))
      }),
      rest.get('/admin/auth/verify', (req, res, ctx) => {
        return res(ctx.json({
          id: 1, email: 'admin@example.com', user_type: 'admin'
        }))
      })
    )

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper()
    })

    // Initial loading
    expect(result.current.isLoading).toBe(true)

    // Wait for verification
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Perform login
    act(() => {
      result.current.login.mutate({
        email: 'admin@example.com',
        password: 'password123'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.user?.email).toBe('admin@example.com')
    })

    // Check token stored
    expect(localStorage.getItem('auth-token')).toBe('jwt-token-123')
  })
})
```

### Middleware Integration
```typescript
// src/middleware.integration.test.ts
import { NextRequest } from 'next/server'
import middleware from './middleware'

describe('Middleware Integration', () => {
  it('allows access to public routes', () => {
    const req = new NextRequest(new URL('http://localhost:3000/login'))
    const res = middleware(req)

    expect(res).toBeUndefined() // No redirect
  })

  it('redirects to login for protected routes without auth', () => {
    const req = new NextRequest(new URL('http://localhost:3000/dashboard'))
    const res = middleware(req)

    expect(res?.status).toBe(302)
    expect(res?.headers.get('Location')).toBe('/login')
  })

  it('allows access to protected routes with valid token', () => {
    const req = new NextRequest(new URL('http://localhost:3000/dashboard'))
    req.cookies.set('auth-token', 'valid-jwt-token')

    // Mock token verification
    const res = middleware(req)

    expect(res).toBeUndefined() // No redirect
  })
})
```

---

## E2E Tests

E2E tests menggunakan Playwright untuk testing full user journeys.

### Authentication E2E
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('successful login flow', async ({ page }) => {
    // Mock API responses
    await page.route('**/admin/auth/login', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 1, email: 'admin@example.com', user_type: 'admin' },
          token: 'jwt-token-123'
        })
      })
    })

    await page.goto('/login')

    // Fill login form
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')

    // Check token stored
    const token = await page.evaluate(() => localStorage.getItem('auth-token'))
    expect(token).toBe('jwt-token-123')
  })

  test('login with invalid credentials', async ({ page }) => {
    await page.route('**/admin/auth/login', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' })
      })
    })

    await page.goto('/login')

    await page.fill('input[type="email"]', 'wrong@email.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible()

    // Should stay on login page
    await expect(page).toHaveURL('/login')
  })

  test('protected route redirects to login', async ({ page }) => {
    await page.goto('/dashboard')

    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })
})
```

### Layout E2E
```typescript
// e2e/layout.spec.ts
test.describe('Layout', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('sidebar navigation works', async ({ page }) => {
    // Check sidebar is visible
    await expect(page.locator('nav')).toBeVisible()

    // Click Users menu
    await page.click('text=Users')
    await expect(page).toHaveURL('/users')

    // Click Jobs menu
    await page.click('text=Jobs')
    await expect(page).toHaveURL('/jobs')

    // Click Dashboard menu
    await page.click('text=Dashboard')
    await expect(page).toHaveURL('/dashboard')
  })

  test('header shows user info', async ({ page }) => {
    await expect(page.locator('text=Admin User')).toBeVisible()
    await expect(page.locator('text=admin@example.com')).toBeVisible()
  })

  test('logout functionality', async ({ page }) => {
    await page.click('button:has-text("Logout")')
    await expect(page).toHaveURL('/login')
  })

  test('responsive layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Sidebar should be collapsed or hidden
    await expect(page.locator('nav')).not.toBeVisible()

    // Click hamburger menu (assuming it exists)
    await page.click('[data-testid="hamburger-menu"]')
    await expect(page.locator('nav')).toBeVisible()
  })
})
```

---

## Manual Testing Checklist

### Authentication
- [ ] Login dengan email dan password valid
- [ ] Error handling untuk invalid credentials
- [ ] Loading states saat login process
- [ ] Token persistence setelah page refresh
- [ ] Auto token refresh untuk expired tokens
- [ ] Logout clears token dan redirects ke login

### Route Protection
- [ ] Protected routes memblokir akses tanpa auth
- [ ] Public routes (login) accessible tanpa auth
- [ ] Direct navigation ke protected routes redirects ke login
- [ ] Middleware handles edge cases (malformed tokens, etc.)

### Layout & Navigation
- [ ] Sidebar navigation berfungsi di desktop dan mobile
- [ ] Header menampilkan user info dan logout button
- [ ] Active menu highlighting berfungsi
- [ ] Responsive design di berbagai screen sizes (320px - 1920px)
- [ ] Layout maintains consistency across pages

### Error Handling
- [ ] Network errors show user-friendly messages
- [ ] Form validation errors display correctly
- [ ] API errors don't crash the application
- [ ] Error boundaries catch unexpected errors

### Performance
- [ ] Initial page load < 3 seconds
- [ ] Navigation between pages < 1 second
- [ ] No memory leaks (check with dev tools)
- [ ] Lighthouse performance score > 90

### Accessibility
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG standards
- [ ] Focus management untuk modals dan forms

### Browser Compatibility
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

---

## Test Results Summary

### Expected Results
- **Unit Tests**: 25+ tests passing
- **Integration Tests**: 10+ tests passing
- **E2E Tests**: 8+ tests passing
- **Coverage**: >80% untuk Phase 1 code
- **Manual Tests**: 20+ items checked

### Reporting
```bash
# Generate coverage report
npm run test:coverage

# Generate HTML report
npm run test:report

# Run accessibility tests
npm run test:a11y
```

### Continuous Integration
- Tests run on every push to main branch
- PR requires all tests passing
- Coverage reports uploaded to CI
- Failed tests block deployment

---

## Troubleshooting

### Common Test Issues

#### MSW Setup Issues
```typescript
// Fix: Ensure MSW is started before tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
```

#### Playwright Configuration
```javascript
// playwright.config.js
export default {
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
}
```

#### Mock Data Consistency
- Use consistent mock data across all tests
- Store mock data in separate files for reusability
- Update mocks when API contracts change

### Performance Testing
```bash
# Run performance tests
npm run test:performance

# Lighthouse CI
npm run lighthouse
```

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-14  
**Test Environment**: Node.js 18+, Next.js 15, TypeScript 5.0+  
**Coverage Target**: 80% minimum
