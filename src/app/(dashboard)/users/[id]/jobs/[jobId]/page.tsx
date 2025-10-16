'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJobResults } from '@/hooks/useJobResults';

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

// JSON Viewer Component
const JSONViewer = ({ data, title }: { data: unknown; title: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 bg-gray-900 overflow-x-auto">
          <pre className="text-xs text-green-400 font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Structured Data Display Component
const StructuredDataDisplay = ({ data, title }: { data: unknown; title: string }) => {
  if (!data || typeof data !== 'object') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="border-b border-gray-100 pb-3 last:border-0">
            <p className="text-sm font-medium text-gray-700 mb-1">{key}</p>
            {typeof value === 'object' && value !== null ? (
              <div className="ml-4 space-y-2">
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey} className="flex justify-between">
                    <span className="text-sm text-gray-600">{subKey}:</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {typeof subValue === 'object' ? JSON.stringify(subValue) : String(subValue)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-900">{String(value)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function JobResultsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const userId = params.id as string;

  const { data, isLoading, error } = useJobResults(jobId);

  if (isLoading) return <div className="p-6"><LoadingSkeleton /></div>;
  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">Error loading job results: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    </div>
  );
  if (!data) return <div className="p-6"><p>Job results not found</p></div>;

  const { job, result } = data;

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
        <h1 className="text-2xl font-bold text-gray-900">Job Results</h1>
        <p className="mt-1 text-sm text-gray-500">Assessment: {job.assessment_name}</p>
      </div>

      {/* Job Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Job ID</p>
            <p className="text-sm font-mono text-gray-900 mt-1">{job.job_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
              job.status === 'completed' ? 'bg-green-100 text-green-800' :
              job.status === 'processing' ? 'bg-blue-100 text-blue-800' :
              job.status === 'failed' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {job.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Assessment Name</p>
            <p className="text-sm text-gray-900 mt-1">{job.assessment_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed At</p>
            <p className="text-sm text-gray-900 mt-1">
              {job.completed_at ? new Date(job.completed_at).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Results Data */}
      <div className="space-y-6">
        {/* Test Data */}
        {result.test_data && (
          <div>
            <StructuredDataDisplay data={result.test_data} title="Test Data" />
            <div className="mt-4">
              <JSONViewer data={result.test_data} title="Test Data (JSON)" />
            </div>
          </div>
        )}

        {/* Test Result */}
        {result.test_result && (
          <div>
            <StructuredDataDisplay data={result.test_result} title="Test Result" />
            <div className="mt-4">
              <JSONViewer data={result.test_result} title="Test Result (JSON)" />
            </div>
          </div>
        )}

        {/* Raw Responses */}
        {result.raw_responses && (
          <div>
            <JSONViewer data={result.raw_responses} title="Raw Responses" />
          </div>
        )}

        {/* Result Metadata */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Result Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Result ID</p>
              <p className="text-sm font-mono text-gray-900 mt-1">{result.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="text-sm font-mono text-gray-900 mt-1">{result.user_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Is Public</p>
              <p className="text-sm text-gray-900 mt-1">{result.is_public ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="text-sm text-gray-900 mt-1">{new Date(result.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              const dataStr = JSON.stringify(data, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `job-results-${job.job_id}.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Download Results as JSON
          </button>
        </div>
      </div>
    </div>
  );
}

