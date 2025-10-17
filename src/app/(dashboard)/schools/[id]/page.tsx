'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSchoolDetail, useUpdateSchool } from '@/hooks/useSchools';
import type { UpdateSchoolRequest } from '@/types/school';

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

export default function SchoolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = parseInt(params.id as string);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateSchoolRequest>({});

  const { data: schoolDetail, isLoading, error } = useSchoolDetail(schoolId);
  const updateMutation = useUpdateSchool();

  const handleEditToggle = () => {
    if (!isEditing && schoolDetail) {
      setEditForm({
        name: schoolDetail.name,
        address: schoolDetail.address,
        city: schoolDetail.city,
        province: schoolDetail.province,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveSchool = async () => {
    try {
      await updateMutation.mutateAsync({ schoolId, data: editForm });
      setIsEditing(false);
      alert('School updated successfully!');
    } catch (err) {
      alert('Failed to update school: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (isLoading) return <div className="p-6"><LoadingSkeleton /></div>;
  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">Error loading school: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    </div>
  );
  if (!schoolDetail) return <div className="p-6"><p>School not found</p></div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center"
          >
            ← Back to Schools
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{schoolDetail.name}</h1>
          <p className="mt-1 text-sm text-gray-500">School ID: {schoolDetail.id}</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit School
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveSchool}
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* School Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">School Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ) : (
              <p className="text-sm text-gray-900">{schoolDetail.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School ID</label>
            <p className="text-sm text-gray-900">{schoolDetail.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.city || ''}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-900">{schoolDetail.city || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.province || ''}
                onChange={(e) => setEditForm({ ...editForm, province: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-900">{schoolDetail.province || '-'}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            {isEditing ? (
              <textarea
                value={editForm.address || ''}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-900">{schoolDetail.address || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
            <p className="text-sm text-gray-900">{new Date(schoolDetail.created_at).toLocaleString()}</p>
          </div>
          {schoolDetail.userCount !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Associated Users</label>
              <p className="text-sm text-gray-900">{schoolDetail.userCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

