'use client';

import StatsCard from '@/components/dashboard/StatsCard';
import JobTrendChart from '@/components/dashboard/JobTrendChart';
import UserGrowthChart from '@/components/dashboard/UserGrowthChart';
import RecentJobsTable from '@/components/dashboard/RecentJobsTable';
import TopModelsCard from '@/components/dashboard/TopModelsCard';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useJobTrend, useUserGrowth, useRecentJobs, useTopModels } from '@/hooks/useDashboardTrends';

export default function DashboardPage() {
  // Fetch all dashboard data
  const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: jobTrend, isLoading: jobTrendLoading } = useJobTrend();
  const { data: userGrowth, isLoading: userGrowthLoading } = useUserGrowth();
  const { data: recentJobs, isLoading: recentJobsLoading } = useRecentJobs();
  const { data: topModels, isLoading: topModelsLoading } = useTopModels();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to FutureGuide Admin Dashboard
        </p>
      </div>

      {/* Error State */}
      {statsError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
              <p className="mt-1 text-sm text-red-700">Please try refreshing the page.</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Jobs */}
        <StatsCard
          title="Total Jobs"
          value={stats?.jobStats.total ?? '-'}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="blue"
          isLoading={statsLoading}
        />

        {/* Jobs Completed */}
        <StatsCard
          title="Jobs Completed"
          value={stats?.jobStats.completed ?? '-'}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
          isLoading={statsLoading}
        />

        {/* Jobs Failed */}
        <StatsCard
          title="Jobs Failed"
          value={stats?.jobStats.failed ?? '-'}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="red"
          isLoading={statsLoading}
        />

        {/* Success Rate */}
        <StatsCard
          title="Success Rate"
          value={stats ? `${(stats.jobStats.successRate ?? (stats.jobStats.total > 0 ? (stats.jobStats.completed / stats.jobStats.total) * 100 : 0)).toFixed(1)}%` : '-'}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          color="purple"
          isLoading={statsLoading}
        />

        {/* Total Users */}
        <StatsCard
          title="Total Users"
          value={stats?.userStats.totalUsers ?? '-'}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="blue"
          isLoading={statsLoading}
        />

        {/* New Users Today */}
        <StatsCard
          title="New Users Today"
          value={stats?.userStats.newUsersToday ?? '-'}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
          color="green"
          isLoading={statsLoading}
        />

        {/* Active Users Today */}
        <StatsCard
          title="Active Users Today"
          value={stats?.userStats.activeToday ?? '-'}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="orange"
          isLoading={statsLoading}
        />

        {/* Total Conversations */}
        <StatsCard
          title="Total Conversations"
          value={stats?.chatbotStats.totalConversations ?? '-'}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
          color="purple"
          isLoading={statsLoading}
        />

        {/* Total Messages */}
        <StatsCard
          title="Total Messages"
          value={stats?.chatbotStats.totalMessages ?? '-'}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          }
          color="blue"
          isLoading={statsLoading}
        />

        {/* Avg Response Time */}
        <StatsCard
          title="Avg Response Time"
          value={stats ? `${(stats.chatbotStats.avgResponseTime / 1000).toFixed(2)}s` : '-'}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="yellow"
          isLoading={statsLoading}
        />

        {/* Total Tokens Used */}
        <StatsCard
          title="Total Tokens Used"
          value={stats?.tokenStats.totalTokensUsed ?? '-'}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="green"
          isLoading={statsLoading}
        />

        {/* Total Models */}
        <StatsCard
          title="Total Models"
          value={topModels?.summary.totalModels ?? '-'}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
          color="purple"
          isLoading={topModelsLoading}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <JobTrendChart data={jobTrend ?? []} isLoading={jobTrendLoading} />
        <UserGrowthChart data={userGrowth ?? []} isLoading={userGrowthLoading} />
      </div>

      {/* Recent Jobs and Top Models */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentJobsTable jobs={recentJobs ?? []} isLoading={recentJobsLoading} />
        </div>
        <div>
          <TopModelsCard
            data={topModels ?? { summary: { totalModels: 0, totalUsage: 0, freeModelUsage: 0, freeModelPercentage: '0%', paidModelUsage: 0 }, models: [] }}
            isLoading={topModelsLoading}
          />
        </div>
      </div>
    </div>
  );
}

