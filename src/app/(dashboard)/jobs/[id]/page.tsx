'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useJobDetail } from '@/hooks/useJobDetail';
import { useJobResults } from '@/hooks/useJobResults';
import { formatDate } from '@/lib/utils';

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

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [referrer, setReferrer] = useState<string | null>(null);

  useEffect(() => {
    // Detect referrer to determine back button behavior
    if (typeof window !== 'undefined') {
      const ref = document.referrer;
      if (ref.includes('/users/')) {
        setReferrer('user');
      } else if (ref.includes('/jobs')) {
        setReferrer('jobs');
      }
    }
  }, []);

  const { data: job, isLoading: jobLoading } = useJobDetail(jobId);
  const { data: results, isLoading: resultsLoading } = useJobResults(jobId);

  if (jobLoading) {
    return (
      <div className="p-6"><LoadingSkeleton /></div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Job not found</p>
        <Link href="/jobs" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    queue: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, string> = {
    queue: 'Queued',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };

  const handleBackClick = () => {
    if (referrer === 'user' && job?.user_id) {
      router.push(`/users/${job.user_id}`);
    } else {
      router.push('/jobs');
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center text-sm text-gray-600">
        <Link href="/jobs" className="text-blue-600 hover:text-blue-800">
          Jobs
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{job.job_id}</span>
        {job.user_id && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/users/${job.user_id}`} className="text-blue-600 hover:text-blue-800">
              User
            </Link>
          </>
        )}
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={handleBackClick}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
          <p className="mt-1 text-sm text-gray-500">Assessment: {job.assessment_name}</p>
        </div>
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
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusColors[job.status]}`}>
              {statusLabels[job.status]}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Assessment Name</p>
            <p className="text-sm text-gray-900 mt-1">{job.assessment_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">User</p>
            <Link href={`/users/${job.user_id}`} className="text-sm text-blue-600 hover:text-blue-800 mt-1">
              {job.user?.email}
            </Link>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-sm text-gray-900 mt-1">{formatDate(job.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed At</p>
            <p className="text-sm text-gray-900 mt-1">{job.completed_at ? formatDate(job.completed_at) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Retry Count</p>
            <p className="text-sm text-gray-900 mt-1">{job.retry_count}/{job.max_retries}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Priority</p>
            <p className="text-sm text-gray-900 mt-1">{job.priority}</p>
          </div>
          {job.error_message && (
            <div className="md:col-span-2 lg:col-span-4">
              <p className="text-sm text-gray-500">Error Message</p>
              <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                {job.error_message}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section - Handle Different Job Status */}
      {job.status === 'processing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Job Processing</h2>
          <p className="text-sm text-blue-800">
            This job is currently processing. Results will be available once the job is completed.
          </p>
        </div>
      )}

      {job.status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Job Failed</h2>
          <p className="text-sm text-red-800">
            {job.error_message || 'This job failed to complete. Please check the error details above.'}
          </p>
        </div>
      )}

      {job.status === 'queue' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">Job Queued</h2>
          <p className="text-sm text-yellow-800">
            This job is queued and waiting to be processed. Results will be available once processing begins and completes.
          </p>
        </div>
      )}

      {job.status === 'completed' && (
        <div className="space-y-6">
          {/* Results Data */}
          {resultsLoading ? (
            <div className="bg-gray-200 rounded h-64 animate-pulse" />
          ) : results ? (
            <>
              {/* Test Data */}
              {results.result?.test_data && (
                <div>
                  <StructuredDataDisplay data={results.result.test_data} title="Test Data" />
                  <div className="mt-4">
                    <JSONViewer data={results.result.test_data} title="Test Data (JSON)" />
                  </div>
                </div>
              )}

              {/* Test Result */}
              {results.result?.test_result && (
                <div>
                  <StructuredDataDisplay data={results.result.test_result} title="Test Result" />
                  <div className="mt-4">
                    <JSONViewer data={results.result.test_result} title="Test Result (JSON)" />
                  </div>
                </div>
              )}

              {/* Raw Responses */}
              {results.result?.raw_responses ? (
                Object.keys(results.result.raw_responses).length > 0 ? (
                  <div>
                    <JSONViewer data={results.result.raw_responses} title="Raw Responses" />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Raw Responses</h3>
                    <p className="text-sm text-gray-500">No raw responses available</p>
                  </div>
                )
              ) : (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Raw Responses</h3>
                  <p className="text-sm text-gray-500">No raw responses available</p>
                </div>
              )}

              {/* Result Metadata */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Result Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Is Public</p>
                    <p className="text-sm text-gray-900 mt-1">{results.result.is_public ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chatbot ID</p>
                    <p className="text-sm text-gray-900 mt-1">{results.result.chatbot_id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-sm text-gray-900 mt-1">{new Date(results.result.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Updated At</p>
                    <p className="text-sm text-gray-900 mt-1">{new Date(results.result.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(results, null, 2);
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
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">No results available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

