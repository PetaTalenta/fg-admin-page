'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSchools, useCreateSchool, useDeleteSchool } from '@/hooks/useSchools';
import type { SchoolFilters } from '@/types/school';

// Loading Skeleton Component
const TableSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="border-b border-gray-200">
        <div className="px-6 py-4 flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function SchoolsPage() {
  const [filters, setFilters] = useState<SchoolFilters>({
    page: 1,
    limit: 20,
    search: '',
  });

  const [searchInput, setSearchInput] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    address: '',
    city: '',
    province: '',
  });

  const { data, isLoading, error } = useSchools(filters);
  const createMutation = useCreateSchool();
  const deleteMutation = useDeleteSchool();

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

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      alert('School name is required');
      return;
    }

    try {
      await createMutation.mutateAsync(createForm);
      setCreateForm({ name: '', address: '', city: '', province: '' });
      setShowCreateForm(false);
      alert('School created successfully!');
    } catch (err) {
      alert('Failed to create school: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDeleteSchool = async (schoolId: number) => {
    if (!confirm('Are you sure you want to delete this school?')) return;

    try {
      await deleteMutation.mutateAsync(schoolId);
      alert('School deleted successfully!');
    } catch (err) {
      alert('Failed to delete school: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schools Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all schools in the system</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showCreateForm ? 'Cancel' : '+ Add School'}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New School</h2>
          <form onSubmit={handleCreateSchool} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name *</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={createForm.city}
                  onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <input
                  type="text"
                  value={createForm.province}
                  onChange={(e) => setCreateForm({ ...createForm, province: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create School'}
            </button>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search schools by name..."
          value={searchInput}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-800">Error loading schools: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        )}

        {isLoading ? (
          <TableSkeleton />
        ) : data?.schools && data.schools.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Province</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.schools.map((school) => (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{school.city || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{school.province || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(school.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Link
                        href={`/schools/${school.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteSchool(school.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data.pagination && data.pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(data.pagination.page - 1)}
                    disabled={data.pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(data.pagination.page + 1)}
                    disabled={data.pagination.page === data.pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No schools found
          </div>
        )}
      </div>
    </div>
  );
}

