'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useUsers } from '@/hooks/useUsers';
import { useSchools } from '@/hooks/useSchools';
import type { UserFilters, UserType } from '@/types/user';

// Loading Skeleton Component
const TableSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="border-b border-gray-200">
        <div className="px-6 py-4 flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
      </div>
    ))}
  </div>
);

// Status Badge Component
const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

// User Type Badge Component
const UserTypeBadge = ({ userType }: { userType: UserType }) => {
  const colors = {
    user: 'bg-blue-100 text-blue-800',
    admin: 'bg-purple-100 text-purple-800',
    superadmin: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[userType]}`}>
      {userType}
    </span>
  );
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 20,
    search: '',
    user_type: undefined,
    is_active: undefined,
    auth_provider: undefined,
    school_id: undefined,
  });

  const [searchInput, setSearchInput] = useState('');
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  const { data, isLoading, error, refetch } = useUsers(filters);
  const { data: schoolsData } = useSchools({ page: 1, limit: 100 });

  // Debug logging - log users data whenever it changes
  useEffect(() => {
    if (data?.users) {
      console.log('=== USERS LIST DATA ===');
      console.log('Total users:', data.users.length);
      console.log('Users with school:', data.users.filter(u => u.profile?.school).length);
      console.log('Users without school:', data.users.filter(u => !u.profile?.school).length);

      // Log first 3 users for inspection
      data.users.slice(0, 3).forEach((user, idx) => {
        console.log(`User ${idx + 1}:`, {
          username: user.username,
          email: user.email,
          hasProfile: !!user.profile,
          schoolId: user.profile?.school_id,
          hasSchoolObject: !!user.profile?.school,
          schoolName: user.profile?.school?.name,
        });
      });
      console.log('========================');
    }
  }, [data]);

  // Force refresh function - invalidate cache and refetch
  const handleForceRefresh = async () => {
    console.log('🔄 Force refreshing users list...');
    // Invalidate all related queries
    await queryClient.invalidateQueries({ queryKey: ['users'] });
    await queryClient.invalidateQueries({ queryKey: ['schools'] });
    // Refetch
    await refetch();
    alert('Users list refreshed! Check console for debug info.');
  };

  // Debounced search
  const handleSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setFilters(prev => ({ ...prev, search: value, page: 1 }));
      }, 500);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    handleSearch(value);
  };

  const handleFilterChange = (key: keyof UserFilters, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      page: 1,
      limit: 20,
      search: '',
      user_type: undefined,
      is_active: undefined,
      auth_provider: undefined,
      school_id: undefined,
    });
  };

  return (
    <div className="p-6">
      {/* Header with Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage users, view details, and update token balances
          </p>
        </div>
        <div className="flex gap-2">
          {/* Force Refresh Button */}
          <button
            onClick={handleForceRefresh}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            title="Force refresh users list and clear cache"
          >
            🔄 Refresh
          </button>
          {/* Debug Panel Toggle */}
          {process.env.NODE_ENV !== 'production' && (
            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              title="Toggle debug panel"
            >
              🐛 Debug
            </button>
          )}
        </div>
      </div>

      {/* Debug Panel - Development Only */}
      {process.env.NODE_ENV !== 'production' && showDebugPanel && data?.users && (
        <div className="mb-6 bg-gray-900 text-white rounded-lg p-4 font-mono text-xs overflow-auto max-h-96">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-yellow-400">🐛 DEBUG PANEL - USERS LIST</h3>
            <button
              onClick={() => setShowDebugPanel(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-green-400">Total Users:</span> {data.users.length}
            </div>
            <div>
              <span className="text-green-400">Users with School:</span> {data.users.filter(u => u.profile?.school).length} ✅
            </div>
            <div>
              <span className="text-green-400">Users without School:</span> {data.users.filter(u => !u.profile?.school).length} ❌
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <span className="text-yellow-400">Sample Users (First 5):</span>
              <div className="mt-2 space-y-2">
                {data.users.slice(0, 5).map((user, idx) => (
                  <div key={user.id} className="text-xs border-l-2 border-blue-500 pl-2">
                    <div><span className="text-blue-400">#{idx + 1}</span> {user.username}</div>
                    <div className="text-gray-400">Email: {user.email}</div>
                    <div>Profile: {user.profile ? '✅ YES' : '❌ NO'}</div>
                    <div>School ID: {user.profile?.school_id || 'null'}</div>
                    <div>School Object: {user.profile?.school ? '✅ YES' : '❌ NO'}</div>
                    {user.profile?.school && (
                      <div className="text-green-400">School: {user.profile.school.name} (ID: {user.profile.school.id})</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search by email or username..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* User Type Filter */}
          <div>
            <label htmlFor="user_type" className="block text-sm font-medium text-gray-700 mb-1">
              User Type
            </label>
            <select
              id="user_type"
              value={filters.user_type || ''}
              onChange={(e) => handleFilterChange('user_type', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="is_active"
              value={filters.is_active === undefined ? '' : filters.is_active.toString()}
              onChange={(e) => handleFilterChange('is_active', e.target.value === '' ? undefined : e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Auth Provider Filter */}
          <div>
            <label htmlFor="auth_provider" className="block text-sm font-medium text-gray-700 mb-1">
              Auth Provider
            </label>
            <select
              id="auth_provider"
              value={filters.auth_provider || ''}
              onChange={(e) => handleFilterChange('auth_provider', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Providers</option>
              <option value="local">Local</option>
              <option value="google">Google</option>
              <option value="firebase">Firebase</option>
            </select>
          </div>

          {/* School Filter */}
          <div>
            <label htmlFor="school_id" className="block text-sm font-medium text-gray-700 mb-1">
              School
            </label>
            <select
              id="school_id"
              value={filters.school_id || ''}
              onChange={(e) => handleFilterChange('school_id', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Schools</option>
              {schoolsData?.schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800">
            Error loading users: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8}>
                    <TableSkeleton />
                  </td>
                </tr>
              ) : data?.users && data.users.length > 0 ? (
                data.users.map((user) => {
                  // Debug log for each user in table
                  const schoolInfo = user.profile?.school;
                  if (process.env.NODE_ENV !== 'production') {
                    console.log(`Table Row - ${user.username}:`, {
                      hasProfile: !!user.profile,
                      schoolId: user.profile?.school_id,
                      hasSchoolObject: !!schoolInfo,
                      schoolName: schoolInfo?.name,
                    });
                  }

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/users/${user.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          {user.username}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <UserTypeBadge userType={user.user_type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge isActive={user.is_active} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {schoolInfo ? (
                          <span className="inline-flex items-center">
                            <span className="text-green-600 mr-1">✓</span>
                            {schoolInfo.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.token_balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={filters.page === data.pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((filters.page! - 1) * filters.limit!) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(filters.page! * filters.limit!, data.pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{data.pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(filters.page! - 1)}
                    disabled={filters.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, data.pagination.totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          filters.page === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(filters.page! + 1)}
                    disabled={filters.page === data.pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

