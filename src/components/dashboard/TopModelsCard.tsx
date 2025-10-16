'use client';

import type { ModelStats } from '@/types/chatbot';

interface TopModelsCardProps {
  data: ModelStats;
  isLoading?: boolean;
}

export default function TopModelsCard({ data, isLoading = false }: TopModelsCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Get top 5 models by usage
  const topModels = data.models.slice(0, 5);
  const maxUsage = topModels[0]?.usageCount || 1;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Top Models Used</h3>
        <span className="text-sm text-gray-500">
          {data.summary.totalModels} total models
        </span>
      </div>

      {topModels.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No model usage data</p>
      ) : (
        <div className="space-y-4">
          {topModels.map((model, index) => {
            const percentage = (model.usageCount / maxUsage) * 100;
            const usagePercentage = data.summary.totalUsage > 0 
              ? ((model.usageCount / data.summary.totalUsage) * 100).toFixed(1)
              : '0.0';

            return (
              <div key={model.model}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {index + 1}. {model.model}
                    </span>
                    {model.isFreeModel && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Free
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {model.usageCount}
                    </span>
                    <span className="text-xs text-gray-500 w-12 text-right">
                      {usagePercentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                  <span>{model.totalTokens.toLocaleString()} tokens</span>
                  <span>{model.avgProcessingTimeMs.toFixed(0)}ms avg</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Free Models:</span>
            <span className="ml-2 font-semibold text-gray-900">
              {data.summary.freeModelUsage} ({data.summary.freeModelPercentage})
            </span>
          </div>
          <div>
            <span className="text-gray-500">Paid Models:</span>
            <span className="ml-2 font-semibold text-gray-900">
              {data.summary.paidModelUsage}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

