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

// Raw Responses Table Component
const RawResponsesTable = ({ data }: { data: Record<string, Array<{ value: number; questionId: string }>> }) => {
  const [activeTab, setActiveTab] = useState<string>('ocean');
  const tabs = Object.keys(data).filter(key => Array.isArray(data[key]) && data[key].length > 0);

  if (tabs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Responses</h3>
        <p className="text-sm text-gray-500">No raw responses available</p>
      </div>
    );
  }

  const currentData = data[activeTab] || [];

  // Map activeTab to correct prefix for parsing
  const prefixMap: Record<string, string> = {
    ocean: 'OCEAN',
    riasec: 'RIASEC',
    viaIs: 'VIA'
  };
  const prefix = prefixMap[activeTab] || activeTab.toUpperCase();

  // Parse question IDs to extract categories and numbers
  const parseQuestionId = (questionId: string, prefix: string) => {
    if (prefix === 'VIA') {
      // VIA format: VIA_STRENGTHNAME_NUMBER
      const withoutPrefix = questionId.replace(`${prefix}_`, '');
      const parts = withoutPrefix.split('_');
      const number = parseInt(parts[parts.length - 1]);
      const category = parts.slice(0, -1).join('_');
      return { category, number };
    } else {
      // OCEAN/RIASEC format: PREFIX_CATEGORYNUMBER
      const withoutPrefix = questionId.replace(`${prefix}_`, '');
      const category = withoutPrefix.charAt(0);
      const number = parseInt(withoutPrefix.substring(1));
      return { category, number };
    }
  };

  // Group data by number and category
  const groupedData: Record<number, Record<string, number>> = {};
  const categories = new Set<string>();

  currentData.forEach(item => {
    const { category, number } = parseQuestionId(item.questionId, prefix);

    // Skip invalid entries where number is NaN
    if (isNaN(number)) {
      console.warn(`Invalid questionId format: ${item.questionId}`);
      return;
    }

    if (!groupedData[number]) {
      groupedData[number] = {};
    }
    groupedData[number][category] = item.value;
    categories.add(category);
  });

  const categoryOrder: Record<string, string[]> = {
    ocean: ['O', 'C', 'E', 'A', 'N'],
    riasec: ['R', 'I', 'A', 'S', 'E', 'C'],
    viaIs: [
      'CREATIVITY', 'CURIOSITY', 'JUDGEMENT', 'LOVEOFLEARNING', 'PERSPECTIVE',
      'BRAVERY', 'PERSEVERANCE', 'HONESTY', 'ZEST', 'LOVE', 'KINDNESS',
      'SOCIALINTELLIGENCE', 'TEAMWORK', 'FAIRNESS', 'LEADERSHIP', 'FORGIVENESS',
      'HUMILITY', 'PRUDENCE', 'SELFREGULATION', 'APPRECIATIONOFBEAUTY',
      'GRATITUDE', 'HOPE', 'HUMOR', 'SPIRITUALITY'
    ],
    // Add more categories if needed
  };

  const orderedCategories = categoryOrder[activeTab] || Array.from(categories).sort();
  const sortedNumbers = Object.keys(groupedData)
    .map(Number)
    .filter(num => !isNaN(num))
    .sort((a, b) => a - b);

  // Format category names for display
  const formatCategoryName = (category: string, tab: string) => {
    if (tab === 'viaIs') {
      // Shorten VIA strength names for better display
      const shortNames: Record<string, string> = {
        'CREATIVITY': 'Creativity',
        'CURIOSITY': 'Curiosity',
        'JUDGEMENT': 'Judgement',
        'LOVEOFLEARNING': 'Love Learning',
        'PERSPECTIVE': 'Perspective',
        'BRAVERY': 'Bravery',
        'PERSEVERANCE': 'Perseverance',
        'HONESTY': 'Honesty',
        'ZEST': 'Zest',
        'LOVE': 'Love',
        'KINDNESS': 'Kindness',
        'SOCIALINTELLIGENCE': 'Social IQ',
        'TEAMWORK': 'Teamwork',
        'FAIRNESS': 'Fairness',
        'LEADERSHIP': 'Leadership',
        'FORGIVENESS': 'Forgiveness',
        'HUMILITY': 'Humility',
        'PRUDENCE': 'Prudence',
        'SELFREGULATION': 'Self-Reg',
        'APPRECIATIONOFBEAUTY': 'Apprec. Beauty',
        'GRATITUDE': 'Gratitude',
        'HOPE': 'Hope',
        'HUMOR': 'Humor',
        'SPIRITUALITY': 'Spirituality'
      };
      return shortNames[category] || category;
    }
    return category;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Raw Responses</h3>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              {orderedCategories.map(category => (
                <th key={category} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {formatCategoryName(category, activeTab)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedNumbers.map(number => (
              <tr key={number} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {number}
                </td>
                {orderedCategories.map(category => (
                  <td key={category} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {groupedData[number][category] !== undefined ? groupedData[number][category] : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Test Data Table Component
const TestDataTable = ({ data }: { data: Record<string, unknown> }): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>('ocean');

  // Filter out _metadata and get valid tabs
  const tabs = Object.keys(data).filter(key =>
    key !== '_metadata' &&
    typeof data[key] === 'object' &&
    data[key] !== null &&
    Object.keys(data[key] as Record<string, unknown>).length > 0
  );

  if (tabs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Data</h3>
        <p className="text-sm text-gray-500">No test data available</p>
      </div>
    );
  }

  const currentData: Record<string, unknown> = (data[activeTab] as Record<string, unknown>) || {};

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Test Data</h3>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'industryScore' ? 'Industry Score' : tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attribute
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(currentData).map(([key, value]) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                  {key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {typeof value === 'number' ? value.toString() : JSON.stringify(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  );
};

// Career Recommendation Renderer Component
const CareerRecommendationRenderer = ({ recommendations }: { recommendations: Array<Record<string, unknown>> }) => {
  const getProspectColor = (value: string) => {
    switch (value) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-blue-100 text-blue-800';
      case 'super high': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recommendations.map((rec, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            {rec.careerName as string}
          </h4>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            {rec.justification as string}
          </p>
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Related Majors:</h5>
            <ul className="list-disc list-inside space-y-1">
              {(rec.relatedMajors as string[]).map((major, idx) => (
                <li key={idx} className="text-sm text-gray-700">{major}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Career Prospects:</h5>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(rec.careerProspect as Record<string, string>).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProspectColor(value)}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Development Activities Renderer Component
const DevelopmentActivitiesRenderer = ({ activities }: { activities: Record<string, unknown> }) => {
  const extracurricular = activities.extracurricular as string[];
  const bookRecommendations = activities.bookRecommendations as Array<{ title: string; author: string; reason: string }>;

  return (
    <div className="space-y-6">
      {/* Extracurricular Activities */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">Extracurricular Activities</h4>
        <ul className="list-disc list-inside space-y-2">
          {extracurricular.map((activity, index) => (
            <li key={index} className="text-sm text-gray-700">{activity}</li>
          ))}
        </ul>
      </div>

      {/* Book Recommendations */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">Book Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookRecommendations.map((book, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">{book.title}</h5>
              <p className="text-xs text-gray-600 italic mb-3">by {book.author}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{book.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Role Model Renderer Component
const RoleModelRenderer = ({ roleModels }: { roleModels: Array<{ name: string; title: string }> }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {roleModels.map((model, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center">
          <h5 className="text-sm font-semibold text-gray-900 mb-2">{model.name}</h5>
          <p className="text-xs text-gray-600">{model.title}</p>
        </div>
      ))}
    </div>
  );
};

// Test Result Grid Component
const TestResultGrid = ({ data }: { data: Record<string, unknown> }) => {
  const renderValue = (value: unknown) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return <p className="text-sm text-gray-500">No data</p>;

      // Check if array contains objects (like roleModel, careerRecommendation)
      if (typeof value[0] === 'object' && value[0] !== null) {
        return (
          <div className="space-y-3">
            {value.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        );
      }

      // Array of strings
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((item, index) => (
            <li key={index} className="text-sm text-gray-700">{String(item)}</li>
          ))}
        </ul>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      );
    }

    return <p className="text-sm text-gray-700 whitespace-pre-wrap">{String(value)}</p>;
  };

  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Define custom order for sections
  const orderedKeys = ['strengths', 'strengthSummary', 'weaknesses', 'weaknessSummary'];
  const orderedEntries = orderedKeys.map(key => [key, data[key]] as const).filter(([, v]) => v !== undefined);
  const remainingEntries = Object.entries(data).filter(([key]) => !orderedKeys.includes(key) && !['archetype', 'learningStyle', 'riskTolerance', 'shortSummary'].includes(key));
  const allEntries = [...orderedEntries, ...remainingEntries];

  // Check if combined profile section exists
  const hasCombinedProfile = !!(data.archetype && data.learningStyle && data.riskTolerance && data.shortSummary);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Test Result</h3>
      </div>

      <div className="p-6">
        <div className="columns-2 gap-6 space-y-6">
          {hasCombinedProfile && (
            <div className="border border-gray-200 rounded-lg p-4 break-inside-avoid">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                Profile Summary
              </h4>
              <div>
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Archetype</h5>
                  <p className="text-sm text-gray-900">{String(data.archetype)}</p>
                </div>
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Learning Style</h5>
                  <p className="text-sm text-gray-900">{String(data.learningStyle)}</p>
                </div>
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Risk Tolerance</h5>
                  <p className="text-sm text-gray-900">{String(data.riskTolerance)}</p>
                </div>
                <div>
                  <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Short Summary</h5>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{String(data.shortSummary)}</p>
                </div>
              </div>
            </div>
          )}
          {allEntries.map(([key, value]) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4 break-inside-avoid">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                {formatLabel(key)}
              </h4>
              <div className={key === 'careerRecommendation' || key === 'developmentActivities' ? '' : 'max-h-96 overflow-y-auto'}>
                {key === 'careerRecommendation' && Array.isArray(value) ? (
                  <CareerRecommendationRenderer recommendations={value as Array<Record<string, unknown>>} />
                ) : key === 'developmentActivities' && typeof value === 'object' && value !== null ? (
                  <DevelopmentActivitiesRenderer activities={value as Record<string, unknown>} />
                ) : key === 'roleModel' && Array.isArray(value) ? (
                  <RoleModelRenderer roleModels={value as Array<{ name: string; title: string }>} />
                ) : (
                  renderValue(value)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [referrer, setReferrer] = useState<string | null>(null);

  // Collapse/Expand states for sections
  const [isTestDataExpanded, setIsTestDataExpanded] = useState(true);
  const [isTestResultExpanded, setIsTestResultExpanded] = useState(true);
  const [isRawResponsesExpanded, setIsRawResponsesExpanded] = useState(true);

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
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Test Data</h3>
                    <button
                      onClick={() => setIsTestDataExpanded(!isTestDataExpanded)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      {isTestDataExpanded ? 'Collapse' : 'Expand'}
                    </button>
                  </div>
                  {isTestDataExpanded && (
                    <div className="p-6 space-y-4">
                      <TestDataTable data={results.result.test_data as Record<string, unknown>} />
                      <JSONViewer data={results.result.test_data} title="Test Data (Raw JSON)" />
                    </div>
                  )}
                </div>
              )}

              {/* Test Result */}
              {results.result?.test_result && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Test Result</h3>
                    <button
                      onClick={() => setIsTestResultExpanded(!isTestResultExpanded)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      {isTestResultExpanded ? 'Collapse' : 'Expand'}
                    </button>
                  </div>
                  {isTestResultExpanded && (
                    <div className="p-6 space-y-4">
                      <TestResultGrid data={results.result.test_result as Record<string, unknown>} />
                      <JSONViewer data={results.result.test_result} title="Test Result (Raw JSON)" />
                    </div>
                  )}
                </div>
              )}

              {/* Raw Responses */}
              {results.result?.raw_responses && Object.keys(results.result.raw_responses).length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Raw Responses</h3>
                    <button
                      onClick={() => setIsRawResponsesExpanded(!isRawResponsesExpanded)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      {isRawResponsesExpanded ? 'Collapse' : 'Expand'}
                    </button>
                  </div>
                  {isRawResponsesExpanded && (
                    <div className="p-6 space-y-4">
                      <RawResponsesTable data={results.result.raw_responses as Record<string, Array<{ value: number; questionId: string }>>} />
                      <JSONViewer data={results.result.raw_responses} title="Raw Responses (Raw JSON)" />
                    </div>
                  )}
                </div>
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

