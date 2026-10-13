/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Server,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Code,
} from 'lucide-react';
import { checkBackendHealth, API_BASE_URL } from '../../services/api';
import { BackendStatus } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMockMode: boolean;
  onToggleMockMode: () => void;
  backendStatus: BackendStatus;
  onRefreshBackendStatus: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isMockMode,
  onToggleMockMode,
  backendStatus,
  onRefreshBackendStatus,
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestPing = async () => {
    setTesting(true);
    setTestResult(null);
    const status = await checkBackendHealth();
    onRefreshBackendStatus();
    setTesting(false);
    if (status.connected) {
      setTestResult('Successfully connected to Python backend service!');
    } else {
      setTestResult(
        'Backend unreachable on ' +
          status.apiUrl +
          '. Operating seamlessly in illustrative Demo Data mode.'
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-5 text-xs text-slate-700">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Backend Integration &amp; Research Environment Settings
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* API Endpoint Configuration */}
        <div className="space-y-2">
          <label className="font-semibold text-slate-800 block">
            Python Backend REST API Base URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={API_BASE_URL}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800"
            />
            <button
              onClick={handleTestPing}
              disabled={testing}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              Test Ping
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Configured via <code className="font-mono text-slate-700">VITE_API_BASE_URL</code> in environment variables.
          </p>
          {testResult && (
            <div
              className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                backendStatus.connected
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {backendStatus.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{testResult}</span>
            </div>
          )}
        </div>

        {/* Data Mode Switch */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900 block text-xs">
                Data Mode: {isMockMode ? 'Illustrative Demo Data' : 'Live Python Backend'}
              </span>
              <p className="text-[11px] text-slate-500">
                Switch between simulated experimental benchmarks and real Python backend responses.
              </p>
            </div>
            <button
              onClick={onToggleMockMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isMockMode
                  ? 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isMockMode ? 'Using Demo Data' : 'Using Live API'}
            </button>
          </div>
        </div>

        {/* Python Backend Startup Instructions */}
        <div className="space-y-1.5">
          <span className="font-semibold text-slate-800 block text-xs">
            Connecting Your Existing Python Backend
          </span>
          <div className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] space-y-1 overflow-x-auto">
            <p className="text-slate-400"># In your existing Python repository directory:</p>
            <p className="text-cyan-300">source .venv/bin/activate</p>
            <p className="text-cyan-300">uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload</p>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
