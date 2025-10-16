'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useChatbotStats } from '@/hooks/useChatbotStats';
import { useModels } from '@/hooks/useModels';
import { useConversations } from '@/hooks/useConversations';
import type { ConversationStatus, ContextType } from '@/types/chatbot';
import { formatDate, formatNumber } from '@/lib/utils';

// Stats Card Component
function StatsCard({ title, value, subtitle, icon, trend }: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: string;
  trend?: { value: string; isPositive: boolean };
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      {trend && (
        <div className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}
        </div>
      )}
    </div>
  );
}

// Model Usage Chart Component
function ModelUsageChart({ models }: { models: Array<{ model: string; usageCount: number; totalTokens: number; avgProcessingTimeMs: number; isFreeModel: boolean }> }) {
  const maxUsage = Math.max(...models.map(m => m.usageCount));
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Model Usage Distribution</h2>
      <div className="space-y-4">
        {models.map((model, index) => {
          const percentage = (model.usageCount / maxUsage) * 100;
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 truncate flex-1 mr-2">
                  {model.model}
                </span>
                <span className="text-sm text-gray-600">{model.usageCount} uses</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${model.isFreeModel ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {formatNumber(model.totalTokens)} tokens
                </span>
                <span className="text-xs text-gray-500">
                  {(model.avgProcessingTimeMs / 1000).toFixed(2)}s avg
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Conversations Table Component
function ConversationsTable({ 
  conversations, 
  isLoading 
}: { 
  conversations: Array<{
    id: string;
    title: string;
    status: ConversationStatus;
    messageCount?: number;
    created_at: string;
    user?: { email: string; username?: string };
  }>;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Messages
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {conversations.map((conversation) => (
              <tr key={conversation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {conversation.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{conversation.user?.email || 'N/A'}</div>
                  {conversation.user?.username && (
                    <div className="text-xs text-gray-500">{conversation.user.username}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    conversation.status === 'active' ? 'bg-green-100 text-green-800' :
                    conversation.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {conversation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {conversation.messageCount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(conversation.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link 
                    href={`/chatbot/conversations/${conversation.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ConversationStatus | ''>('');
  const [contextType, setContextType] = useState<ContextType | ''>('');
  const [search, setSearch] = useState('');

  const { data: stats, isLoading: statsLoading } = useChatbotStats();
  const { data: modelsData, isLoading: modelsLoading } = useModels();
  const { data: conversationsData, isLoading: conversationsLoading } = useConversations({
    page,
    limit: 20,
    status: status || undefined,
    context_type: contextType || undefined,
    search: search || undefined,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chatbot Monitoring</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor chatbot performance, conversations, and model usage
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Conversations"
          value={statsLoading ? '...' : formatNumber(stats?.overview.totalConversations || 0)}
          subtitle={`${stats?.overview.activeConversations || 0} active`}
          icon="💬"
        />
        <StatsCard
          title="Total Messages"
          value={statsLoading ? '...' : formatNumber(stats?.overview.totalMessages || 0)}
          subtitle={`Avg ${stats?.overview.avgMessagesPerConversation || '0'} per conversation`}
          icon="📨"
        />
        <StatsCard
          title="Today's Activity"
          value={statsLoading ? '...' : `${stats?.today.conversations || 0} / ${stats?.today.messages || 0}`}
          subtitle="Conversations / Messages"
          icon="📊"
        />
        <StatsCard
          title="Avg Response Time"
          value={statsLoading ? '...' : `${(stats?.performance.avgResponseTimeMs || 0) / 1000}s`}
          subtitle="Average processing time"
          icon="⚡"
        />
        <StatsCard
          title="Total Tokens Used"
          value={statsLoading ? '...' : formatNumber(stats?.tokenUsage.totalTokens || 0)}
          subtitle={`${formatNumber(stats?.tokenUsage.totalPromptTokens || 0)} prompt + ${formatNumber(stats?.tokenUsage.totalCompletionTokens || 0)} completion`}
          icon="🎯"
        />
        <StatsCard
          title="Active Models"
          value={modelsLoading ? '...' : modelsData?.summary.totalModels || 0}
          subtitle={`${modelsData?.summary.freeModelPercentage || '0'}% free models`}
          icon="🤖"
        />
      </div>

      {/* Model Usage Chart */}
      {!modelsLoading && modelsData && (
        <ModelUsageChart models={modelsData.models} />
      )}

      {/* Conversations Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ConversationStatus | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Context Type
              </label>
              <select
                value={contextType}
                onChange={(e) => setContextType(e.target.value as ContextType | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="general">General</option>
                <option value="career_guidance">Career Guidance</option>
                <option value="assessment">Assessment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatus('');
                  setContextType('');
                  setSearch('');
                  setPage(1);
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Conversations Table */}
        <ConversationsTable
          conversations={conversationsData?.conversations || []}
          isLoading={conversationsLoading}
        />

        {/* Pagination */}
        {conversationsData && conversationsData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(conversationsData.pagination.totalPages, p + 1))}
                disabled={page === conversationsData.pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{page}</span> of{' '}
                  <span className="font-medium">{conversationsData.pagination.totalPages}</span>
                  {' '}({conversationsData.pagination.total} total conversations)
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(conversationsData.pagination.totalPages, p + 1))}
                    disabled={page === conversationsData.pagination.totalPages}
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

