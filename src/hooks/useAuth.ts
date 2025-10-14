'use client';

import { useAuth as useAuthContext } from '@/lib/auth-context';

// Re-export useAuth from auth-context for backward compatibility
export const useAuth = useAuthContext;
