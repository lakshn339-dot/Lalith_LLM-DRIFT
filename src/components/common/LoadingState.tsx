/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2, AlertCircle, RefreshCw, Database } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading longitudinal experimental metrics...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500 min-h-[280px]">
      <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-700">{message}</p>
      <span className="text-xs text-slate-400 mt-1">Aggregating evaluation rounds (R1–R10)</span>
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  showFallbackNotice?: boolean;
}> = ({
  title = 'Backend connection unavailable',
  message = 'Could not reach the Python inference service at VITE_API_BASE_URL. Ensure your backend server is running.',
  onRetry,
  showFallbackNotice = true,
}) => {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-6 my-4 text-left">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-rose-900">{title}</h4>
          <p className="text-xs text-rose-700 mt-1 leading-relaxed">{message}</p>

          {showFallbackNotice && (
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-rose-100">
              <Database className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                To inspect the application during offline development, illustrative mock data is available.
              </span>
            </div>
          )}

          {onRetry && (
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Connection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-slate-200 bg-white">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <Database className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
