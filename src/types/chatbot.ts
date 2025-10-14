// Chatbot Types
export type ConversationStatus = 'active' | 'archived' | 'deleted';
export type ContextType = 'general' | 'career_guidance' | 'assessment' | 'other';
export type SenderType = 'user' | 'assistant';

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  status: ConversationStatus;
  context_type: ContextType;
  created_at: string;
  updated_at: string;
  message_count?: number;
  total_tokens?: number;
}

export interface ConversationWithUser extends Conversation {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: SenderType;
  content: string;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  created_at: string;
}

export interface ChatbotStats {
  overview: {
    totalConversations: number;
    totalMessages: number;
    activeConversations: number;
    avgMessagesPerConversation: number;
  };
  today: {
    conversationsToday: number;
    messagesToday: number;
  };
  performance: {
    avgResponseTimeMs: number;
  };
  tokenUsage: {
    totalTokens: number;
    totalPromptTokens: number;
    totalCompletionTokens: number;
  };
}

export interface ModelUsage {
  model: string;
  usageCount: number;
  totalTokens: number;
  avgProcessingTimeMs: number;
  isFree: boolean;
}

export interface ModelStats {
  summary: {
    totalModels: number;
    freeModels: number;
    paidModels: number;
  };
  models: ModelUsage[];
}

