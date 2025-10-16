'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useUsers } from '@/hooks/useUsers';
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
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 20,
    search: '',
    user_type: undefined,
    is_active: undefined,
    auth_provider: undefined,
  });

  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, error } = useUsers(filters);

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
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage users, view details, and update token balances
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <td colSpan={7}>
                    <TableSkeleton />
                  </td>
                </tr>
              ) : data?.users && data.users.length > 0 ? (
                data.users.map((user) => (
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
                      {user.token_balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
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

