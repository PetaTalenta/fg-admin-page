'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useConversationChats } from '@/hooks/useConversationChats';
import type { ChatMessage } from '@/types/chatbot';

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className="bg-gray-200 rounded-lg p-4 max-w-md w-64 h-20"></div>
        </div>
      ))}
    </div>
  </div>
);

// Message Bubble Component
const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.sender_type === 'user';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3xl ${isUser ? 'ml-12' : 'mr-12'}`}>
        <div className={`rounded-lg p-4 ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold opacity-75">
              {isUser ? 'User' : 'Assistant'}
            </span>
            <button
              onClick={handleCopy}
              className={`text-xs px-2 py-1 rounded ${
                isUser 
                  ? 'bg-blue-700 hover:bg-blue-800' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          {message.usage && (
            <div className={`mt-3 pt-3 border-t ${
              isUser ? 'border-blue-500' : 'border-gray-300'
            }`}>
              <div className="flex items-center gap-4 text-xs opacity-75">
                <span>Model: {message.usage.model_used}</span>
                <span>Tokens: {message.usage.total_tokens}</span>
              </div>
            </div>
          )}
          <div className={`mt-2 text-xs opacity-75`}>
            {new Date(message.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ConversationChatsPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.convId as string;
  const userId = params.id as string;

  const [page, setPage] = useState(1);
  const limit = 50;

  const { data, isLoading, error } = useConversationChats(conversationId, { page, limit });

  if (isLoading) return <div className="p-6"><LoadingSkeleton /></div>;
  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">Error loading conversation: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    </div>
  );
  if (!data) return <div className="p-6"><p>Conversation not found</p></div>;

  const { conversation, messages, pagination } = data;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/users/${userId}`)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center"
        >
          ← Back to User Detail
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{conversation.title}</h1>
        <div className="mt-2 flex items-center gap-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            conversation.status === 'active' ? 'bg-green-100 text-green-800' :
            conversation.status === 'archived' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {conversation.status}
          </span>
          <span className="text-sm text-gray-500">
            Context: {conversation.context_type}
          </span>
        </div>
      </div>

      {/* Conversation Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Conversation ID</p>
            <p className="text-sm font-mono text-gray-900 mt-1">{conversation.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-sm text-gray-900 mt-1">{conversation.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Context Type</p>
            <p className="text-sm text-gray-900 mt-1">{conversation.context_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Messages</p>
            <p className="text-sm text-gray-900 mt-1">{pagination.total}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Messages</h2>
        
        {messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">No messages in this conversation</p>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(page * limit, pagination.total)}
              </span>{' '}
              of <span className="font-medium">{pagination.total}</span> messages
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Scroll to Bottom Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Scroll to bottom"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

