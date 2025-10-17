'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserDetail } from '@/hooks/useUserDetail';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import { useTokenHistory, useUpdateToken } from '@/hooks/useTokenManagement';
import { useUserJobs } from '@/hooks/useUserJobs';
import { useUserConversations } from '@/hooks/useUserConversations';
import { useSchools } from '@/hooks/useSchools';
import type { UpdateUserRequest, UpdateTokenRequest, UserType, FederationStatus } from '@/types/user';

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

// Status Badge
const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserRequest>({});
  const [tokenForm, setTokenForm] = useState<UpdateTokenRequest>({ amount: 0, reason: '' });
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'tokens' | 'jobs' | 'conversations'>('info');

  const { data: userDetail, isLoading, error } = useUserDetail(userId);
  const { data: tokenData } = useTokenHistory(userId);
  const { data: jobsData } = useUserJobs(userId, { page: 1, limit: 10 });
  const { data: conversationsData } = useUserConversations(userId, { page: 1, limit: 10 });
  const { data: schoolsData } = useSchools({ page: 1, limit: 100 });

  const updateUserMutation = useUpdateUser();
  const updateTokenMutation = useUpdateToken();

  const handleEditToggle = () => {
    if (!isEditing && userDetail) {
      setEditForm({
        username: userDetail.user.username,
        is_active: userDetail.user.is_active,
        user_type: userDetail.user.user_type,
        federation_status: userDetail.user.federation_status,
        profile: userDetail.user.profile || undefined,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveUser = async () => {
    try {
      await updateUserMutation.mutateAsync({ userId, data: editForm });
      setIsEditing(false);
      alert('User updated successfully!');
    } catch (err) {
      alert('Failed to update user: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleUpdateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenForm.amount || !tokenForm.reason) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await updateTokenMutation.mutateAsync({ userId, data: tokenForm });
      setTokenForm({ amount: 0, reason: '' });
      setShowTokenForm(false);
      alert('Token balance updated successfully!');
    } catch (err) {
      alert('Failed to update token: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (isLoading) return <div className="p-6"><LoadingSkeleton /></div>;
  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">Error loading user: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    </div>
  );
  if (!userDetail) return <div className="p-6"><p>User not found</p></div>;

  const user = userDetail.user;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center"
          >
            ← Back to Users
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
          <p className="mt-1 text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit User
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveUser}
                disabled={updateUserMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
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

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {(['info', 'tokens', 'jobs', 'conversations'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.username || ''}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{user.username}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                {isEditing ? (
                  <select
                    value={editForm.user_type || user.user_type}
                    onChange={(e) => setEditForm({ ...editForm, user_type: e.target.value as UserType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">{user.user_type}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                {isEditing ? (
                  <select
                    value={editForm.is_active === undefined ? user.is_active.toString() : editForm.is_active.toString()}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                ) : (
                  <StatusBadge isActive={user.is_active} />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Token Balance</label>
                <p className="text-sm text-gray-900 font-semibold">{user.token_balance.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auth Provider</label>
                <p className="text-sm text-gray-900">{user.auth_provider}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Firebase UID</label>
                <p className="text-sm text-gray-900">{user.firebase_uid || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Federation Status</label>
                {isEditing ? (
                  <select
                    value={editForm.federation_status || user.federation_status || ''}
                    onChange={(e) => setEditForm({ ...editForm, federation_status: e.target.value as FederationStatus })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="failed">Failed</option>
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">{user.federation_status || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                <p className="text-sm text-gray-900">
                  {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                <p className="text-sm text-gray-900">{new Date(user.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* School Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">School Information</h2>
            {user.profile?.school ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  {isEditing ? (
                    <select
                      value={editForm.profile?.school_id || user.profile.school_id || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        profile: {
                          ...editForm.profile,
                          school_id: parseInt(e.target.value),
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a school</option>
                      {schoolsData?.schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900">{user.profile.school.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School ID</label>
                  <p className="text-sm text-gray-900">{user.profile.school.id}</p>
                </div>
                {user.profile.school.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-sm text-gray-900">{user.profile.school.address}</p>
                  </div>
                )}
                {user.profile.school.city && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <p className="text-sm text-gray-900">{user.profile.school.city}</p>
                  </div>
                )}
                {user.profile.school.province && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                    <p className="text-sm text-gray-900">{user.profile.school.province}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                  <p className="text-sm text-gray-900">{new Date(user.profile.school.created_at).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No school assigned</p>
            )}
          </div>

          {/* Statistics Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">Total Jobs</p>
                <p className="text-2xl font-bold text-blue-900">{userDetail.statistics.jobs.length || 0}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium">Total Conversations</p>
                <p className="text-2xl font-bold text-green-900">{userDetail.statistics.conversations || 0}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-600 font-medium">Token Balance</p>
                <p className="text-2xl font-bold text-purple-900">{user.token_balance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tokens' && (
        <div className="space-y-6">
          {/* Current Balance */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Token Balance</h2>
              <button
                onClick={() => setShowTokenForm(!showTokenForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {showTokenForm ? 'Cancel' : 'Update Balance'}
              </button>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <p className="text-sm opacity-90">Current Balance</p>
              <p className="text-4xl font-bold mt-2">{tokenData?.currentBalance.toLocaleString() || user.token_balance.toLocaleString()}</p>
            </div>

            {/* Update Token Form */}
            {showTokenForm && (
              <form onSubmit={handleUpdateToken} className="mt-6 space-y-4 border-t pt-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (positive to add, negative to subtract)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={tokenForm.amount}
                    onChange={(e) => setTokenForm({ ...tokenForm, amount: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    id="reason"
                    value={tokenForm.reason}
                    onChange={(e) => setTokenForm({ ...tokenForm, reason: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={updateTokenMutation.isPending}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {updateTokenMutation.isPending ? 'Updating...' : 'Update Token Balance'}
                </button>
              </form>
            )}
          </div>

          {/* Token History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Token History</h2>
            {tokenData?.history && tokenData.history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tokenData.history.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.activity_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={transaction.activity_data.amount > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {transaction.activity_data.amount > 0 ? '+' : ''}{transaction.activity_data.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.activity_data.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {transaction.activity_data.newBalance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No token history available</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Jobs</h2>
            {jobsData?.jobs && jobsData.jobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assessment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobsData.jobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {job.job_id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {job.assessment_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.status === 'completed' ? 'bg-green-100 text-green-800' :
                            job.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            job.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(job.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.completed_at ? new Date(job.completed_at).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {job.status === 'completed' && (
                            <Link
                              href={`/jobs/${job.id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View Results
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No jobs found for this user</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'conversations' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Conversations</h2>
            {conversationsData?.conversations && conversationsData.conversations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Context Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Messages</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {conversationsData.conversations.map((conversation) => (
                      <tr key={conversation.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {conversation.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {conversation.context_type || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            conversation.status === 'active' ? 'bg-green-100 text-green-800' :
                            conversation.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {conversation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {conversation.messageCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(conversation.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            href={`/users/${userId}/conversations/${conversation.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Chats
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No conversations found for this user</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}