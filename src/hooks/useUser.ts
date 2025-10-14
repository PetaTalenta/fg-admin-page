'use client';

import { useState, useEffect } from 'react';
import { getFromStorage } from '@/lib/utils';
import { USER_KEY } from '@/lib/constants';
import type { AuthUser } from '@/types/auth';

export function useUser() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = getFromStorage<AuthUser | null>(USER_KEY, null);
    setUser(storedUser);
  }, []);

  return user;
}

