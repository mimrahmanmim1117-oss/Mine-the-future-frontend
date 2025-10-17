import React from 'react';

interface ErrorDisplayProps {
  error: Error | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 my-8">
      <h2 className="text-lg font-bold mb-2">Backend Connection Error</h2>
      <p className="mb-4">{error.message}</p>
      <div className="text-sm">
        <p className="font-semibold">To fix this:</p>
        <ol className="list-decimal list-inside pl-2">
          <li>Open a terminal and navigate to the backend directory.</li>
          <li>Run <code className="bg-red-100 px-1 py-0.5 rounded text-red-900 font-mono">npm install</code> then <code className="bg-red-100 px-1 py-0.5 rounded text-red-900 font-mono">npm start</code>.</li>
        </ol>
      </div>
    </div>
  );
};

export default ErrorDisplay;
