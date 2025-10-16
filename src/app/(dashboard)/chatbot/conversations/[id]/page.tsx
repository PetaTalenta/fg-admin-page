'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useConversationDetail } from '@/hooks/useConversationDetail';
import { useConversationChats } from '@/hooks/useConversationChats';
import { formatDate, formatNumber } from '@/lib/utils';

// Message Bubble Component
function MessageBubble({ 
  message 
}: { 
  message: {
    id: string;
    sender_type: 'user' | 'assistant';
    content: string;
    created_at: string;
    usage?: {
      model_used: string;
      total_tokens: number;
    } | null;
  };
}) {
  const isUser = message.sender_type === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3xl ${isUser ? 'ml-12' : 'mr-12'}`}>
        <div className={`rounded-lg p-4 ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        </div>
        <div className={`mt-1 text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
          <span>{formatDate(message.created_at)}</span>
          {message.usage && (
            <span className="ml-2">
              • {message.usage.model_used} • {formatNumber(message.usage.total_tokens)} tokens
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const [page, setPage] = useState(1);

  const { data: conversation, isLoading: conversationLoading } = useConversationDetail(conversationId);
  const { data: chatsData, isLoading: chatsLoading } = useConversationChats(conversationId, {
    page,
    limit: 50,
  });

  if (conversationLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Conversation Not Found</h2>
        <p className="text-gray-600 mb-4">The conversation you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/chatbot" className="text-blue-600 hover:text-blue-800">
          ← Back to Chatbot Monitoring
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/chatbot" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Back to Chatbot Monitoring
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{conversation.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Conversation with {conversation.user.email}
          </p>
        </div>
        <div>
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
            conversation.status === 'active' ? 'bg-green-100 text-green-800' :
            conversation.status === 'archived' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {conversation.status}
          </span>
        </div>
      </div>

      {/* Conversation Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Context Type</p>
            <p className="text-base font-medium text-gray-900 capitalize">
              {conversation.context_type.replace('_', ' ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Messages</p>
            <p className="text-base font-medium text-gray-900">
              {formatNumber(conversation.messageCount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Tokens</p>
            <p className="text-base font-medium text-gray-900">
              {formatNumber(conversation.totalTokens)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Cost</p>
            <p className="text-base font-medium text-gray-900">
              ${conversation.totalCost.toFixed(4)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-base font-medium text-gray-900">
              {formatDate(conversation.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Chat Messages</h2>
          <p className="text-sm text-gray-500 mt-1">
            {chatsData?.pagination.total || 0} messages in this conversation
          </p>
        </div>
        
        <div className="p-6">
          {chatsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : chatsData && chatsData.messages.length > 0 ? (
            <div className="space-y-4">
              {chatsData.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No messages in this conversation yet.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {chatsData && chatsData.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{page}</span> of{' '}
                  <span className="font-medium">{chatsData.pagination.totalPages}</span>
                  {' '}({chatsData.pagination.total} total messages)
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(chatsData.pagination.totalPages, p + 1))}
                  disabled={page === chatsData.pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

