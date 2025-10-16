// Chatbot Types
export type ConversationStatus = 'active' | 'archived' | 'deleted';
export type ContextType = 'general' | 'career_guidance' | 'assessment' | 'other';
export type SenderType = 'user' | 'assistant';

export interface Conversation {
  id: string;
  user_id?: string;
  title: string;
  status: ConversationStatus;
  context_type?: ContextType;
  context_data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    username?: string;
  };
  messageCount?: number;
}

export interface ConversationDetail {
  id: string;
  title: string;
  status: ConversationStatus;
  context_type: ContextType;
  messageCount: number;
  totalTokens: number;
  totalCost: number;
  created_at: string;
  user: {
    email: string;
  };
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: SenderType;
  content: string;
  content_type: string;
  metadata?: Record<string, unknown>;
  parent_message_id?: string | null;
  created_at: string;
  usage?: {
    model_used: string;
    total_tokens: number;
  } | null;
}

export interface ConversationChatsResponse {
  conversation: {
    id: string;
    title: string;
    status: ConversationStatus;
    context_type: ContextType;
  };
  messages: ChatMessage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ConversationsListResponse {
  conversations: Conversation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ChatbotStats {
  overview: {
    totalConversations: number;
    totalMessages: number;
    activeConversations: number;
    avgMessagesPerConversation: string;
  };
  today: {
    conversations: number;
    messages: number;
  };
  performance: {
    avgResponseTimeMs: number;
  };
  tokenUsage: {
    totalTokens: number;
  };
  modelUsage: Array<{
    model: string;
    count: number;
    totalTokens: number;
  }>;
}

export interface ModelUsage {
  model: string;
  usageCount: number;
  totalTokens: number;
  avgProcessingTimeMs: number;
  isFreeModel: boolean;
}

export interface ModelStats {
  summary: {
    totalModels: number;
    totalUsage: number;
    freeModelUsage: number;
    freeModelPercentage: string;
    paidModelUsage: number;
  };
  models: ModelUsage[];
}

export interface ConversationFilters {
  page?: number;
  limit?: number;
  status?: ConversationStatus;
  user_id?: string;
  context_type?: ContextType;
  search?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'status';
  sort_order?: 'ASC' | 'DESC';
}

