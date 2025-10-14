'use client';

import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="text-gray-500 hover:text-gray-700 lg:hidden"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title - hidden on mobile */}
      <div className="hidden lg:block">
        <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
      </div>

      {/* Right side - User info and actions */}
      <div className="flex items-center space-x-4">
        {/* User info */}
        {user && (
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{user.email}</p>
            <p className="text-xs text-gray-500 capitalize">{user.user_type}</p>
          </div>
        )}

        {/* User avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
          <span className="text-sm font-medium">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </span>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          disabled={isLoading}
          className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <span className="flex items-center">
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

