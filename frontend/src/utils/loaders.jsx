import { Loader } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export const SkeletonLoader = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
  );
};
