'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useJobStats } from '@/hooks/useJobStats';
import { useJobs } from '@/hooks/useJobs';
import { JobFilters, JobStatus } from '@/types/job';
import { formatDate } from '@/lib/utils';

const statusColors: Record<JobStatus, string> = {
  queue: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<JobStatus, string> = {
  queue: 'Queued',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export default function JobsPage() {
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    limit: 50,
    sort_by: 'created_at',
    sort_order: 'DESC',
  });

  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userUsername, setUserUsername] = useState<string>('');
  const [assessmentName, setAssessmentName] = useState<string>('');

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      user_email: userEmail || undefined,
      user_username: userUsername || undefined,
      assessment_name: assessmentName || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      page: 1,
    }));
  }, [userEmail, userUsername, assessmentName, dateFrom, dateTo]);

  const { data: stats, isLoading: statsLoading } = useJobStats();
  const { data: jobsData, isLoading: jobsLoading } = useJobs(filters);

  const handleStatusFilter = (status: JobStatus | 'all') => {
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleClearFilters = () => {
    setUserEmail('');
    setUserUsername('');
    setAssessmentName('');
    setDateFrom('');
    setDateTo('');
    setFilters(prev => ({
      ...prev,
      status: undefined,
      user_email: undefined,
      user_username: undefined,
      assessment_name: undefined,
      date_from: undefined,
      date_to: undefined,
      page: 1,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Jobs Monitoring</h1>
        <p className="mt-2 text-gray-600">Monitor and manage all analysis jobs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24 animate-pulse" />
            ))}
          </>
        ) : stats ? (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600">Total Jobs</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{stats.overview.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600">Completed</div>
              <div className="mt-2 text-3xl font-bold text-green-600">{stats.overview.completed}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600">Failed</div>
              <div className="mt-2 text-3xl font-bold text-red-600">{stats.overview.failed}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600">Success Rate</div>
              <div className="mt-2 text-3xl font-bold text-blue-600">{stats.overview.successRate.toFixed(2)}%</div>
            </div>
          </>
        ) : null}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                !filters.status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {(['queue', 'processing', 'completed', 'failed', 'cancelled'] as const).map(status => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filters.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 items-end">
            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                User Email
              </label>
              <input
                type="text"
                id="userEmail"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Filter by user email..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
              />
            </div>
            <div>
              <label htmlFor="userUsername" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="userUsername"
                value={userUsername}
                onChange={(e) => setUserUsername(e.target.value)}
                placeholder="Filter by username..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
              />
            </div>
            <div>
              <label htmlFor="assessmentName" className="block text-sm font-medium text-gray-700 mb-1">
                Assessment Name
              </label>
              <input
                type="text"
                id="assessmentName"
                value={assessmentName}
                onChange={(e) => setAssessmentName(e.target.value)}
                placeholder="Filter by assessment..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
              />
            </div>
          </div>
          
          <div className="flex gap-2 items-end">
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="dateFrom"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="dateTo"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Job ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Username</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assessment</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Completed At</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jobsLoading ? (
                <>
                  {[...Array(10)].map((_, i) => (
                    <tr key={i} className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4 h-12 bg-gray-200 animate-pulse" />
                    </tr>
                  ))}
                </>
              ) : jobsData?.jobs && jobsData.jobs.length > 0 ? (
                jobsData.jobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:underline">
                        {job.job_id.substring(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{job.user?.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{job.user?.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{job.assessment_name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
                        {statusLabels[job.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(job.created_at)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {job.completed_at ? formatDate(job.completed_at) : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No jobs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {jobsData?.pagination && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-600">
              Page {jobsData.pagination.page} of {jobsData.pagination.totalPages} ({jobsData.pagination.total} total)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, filters.page! - 1))}
                disabled={filters.page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(jobsData.pagination.totalPages, filters.page! + 1))}
                disabled={filters.page === jobsData.pagination.totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

