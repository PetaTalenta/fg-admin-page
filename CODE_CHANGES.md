# Code Changes: Raw Responses Fix

## 1. `src/hooks/useJobResults.ts`

```typescript
// ADDED: Complete API response interface
interface JobResultsApiResponse {
  success: boolean;
  message: string;
  data: JobResultsResponse;
}

// CHANGED: Type definition and data extraction
export const useJobResults = (jobId: string | undefined) => {
  return useQuery({
    queryKey: ['jobResults', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('Job ID is required');
      // BEFORE: api.get<{ data: JobResultsResponse }>
      // AFTER:
      const response = await api.get<JobResultsApiResponse>(`/admin/jobs/${jobId}/results`);
      // BEFORE: return response.data;
      // AFTER:
      return (response as JobResultsApiResponse).data;
    },
    enabled: !!jobId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
```

---

## 2. `src/hooks/useJobDetail.ts`

```typescript
// ADDED: Complete API response interface
interface JobDetailApiResponse {
  success: boolean;
  message: string;
  data: Job;
}

// CHANGED: Type definition and data extraction
export const useJobDetail = (jobId: string | null) => {
  return useQuery({
    queryKey: ['jobDetail', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('Job ID is required');
      // BEFORE: api.get<{ data: Job }>
      // AFTER:
      const response = await api.get<JobDetailApiResponse>(`/admin/jobs/${jobId}`);
      // BEFORE: return response.data;
      // AFTER:
      return (response as JobDetailApiResponse).data;
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
```

---

## 3. `src/hooks/useJobs.ts`

```typescript
// ADDED: Complete API response interface
interface JobsApiResponse {
  success: boolean;
  message: string;
  data: JobsListResponse;
}

// CHANGED: Type definition and data extraction
return useQuery({
  queryKey: ['jobs', filters],
  queryFn: async () => {
    // BEFORE: api.get<{ data: JobsListResponse }>
    // AFTER:
    const response = await api.get<JobsApiResponse>(url);
    // BEFORE: return response.data;
    // AFTER:
    return (response as JobsApiResponse).data;
  },
  staleTime: 2 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
});
```

---

## 4. `src/hooks/useJobStats.ts`

```typescript
// ADDED: Complete API response interface
interface JobStatsApiResponse {
  success: boolean;
  message: string;
  data: JobStats;
}

// CHANGED: Type definition and data extraction
export const useJobStats = () => {
  return useQuery({
    queryKey: ['jobStats'],
    queryFn: async () => {
      // BEFORE: api.get<{ data: JobStats }>
      // AFTER:
      const response = await api.get<JobStatsApiResponse>('/admin/jobs/stats');
      // BEFORE: return response.data;
      // AFTER:
      return (response as JobStatsApiResponse).data;
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 10 * 1000,
  });
};
```

---

## 5. `src/hooks/useConversationChats.ts`

```typescript
// ADDED: Complete API response interface
interface ConversationChatsApiResponse {
  success: boolean;
  message: string;
  data: ConversationChatsResponse;
}

// CHANGED: Type definition and data extraction
export const useConversationChats = (
  conversationId: string | undefined,
  filters: ConversationChatsFilters = {}
) => {
  return useQuery({
    queryKey: ['conversationChats', conversationId, filters],
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID is required');
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      // BEFORE: api.get<{ data: ConversationChatsResponse }>
      // AFTER:
      const response = await api.get<ConversationChatsApiResponse>(
        `/admin/conversations/${conversationId}/chats?${params.toString()}`
      );
      // BEFORE: return response.data;
      // AFTER:
      return (response as ConversationChatsApiResponse).data;
    },
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};
```

---

## Summary of Changes

| Hook | Interface Added | Type Updated | Data Extraction |
|------|-----------------|--------------|-----------------|
| useJobResults | ✅ | ✅ | ✅ |
| useJobDetail | ✅ | ✅ | ✅ |
| useJobs | ✅ | ✅ | ✅ |
| useJobStats | ✅ | ✅ | ✅ |
| useConversationChats | ✅ | ✅ | ✅ |

**Total Changes**: 5 files, ~50 lines modified  
**Pattern**: Consistent across all hooks  
**Risk**: Low (isolated to data extraction layer)

