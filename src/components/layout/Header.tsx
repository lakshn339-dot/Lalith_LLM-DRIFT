/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Settings,
  Info,
  Server,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';
import { Experiment } from '../../types';

interface HeaderProps {
  currentExperiment: Experiment;
  isBackendConnected: boolean;
  isMockMode: boolean;
  onToggleMockMode: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentExperiment,
  isBackendConnected,
  isMockMode,
  onToggleMockMode,
  onOpenSettings,
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      {/* Top Banner for Research Integrity / Demo Mode */}
      {isMockMode && (
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-1.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <span className="font-semibold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950 text-[10px] tracking-wide uppercase">
              DEMO DATA
            </span>
            <span className="text-[11px] text-amber-800">
              Illustrative experimental results for research demonstration. Simulated evaluation values represent expected drift dynamics.
            </span>
          </div>
          <button
            onClick={onToggleMockMode}
            className="text-[11px] text-amber-900 font-medium underline hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            Connect to Python Backend ({import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'})
          </button>
        </div>
      )}

      {/* Main Header Row */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Experiment Context */}
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-slate-900">
                LLM Drift Attribution
              </h1>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-slate-600 font-medium">
                {currentExperiment.name}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs border-l border-slate-200 pl-4">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-slate-400">Model:</span>
              <span className="font-medium text-slate-800 font-mono text-[11px]">
                {currentExperiment.model}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-slate-400">Evaluation:</span>
              <span className="font-medium text-slate-800">
                {currentExperiment.rounds} Rounds (R1–R{currentExperiment.rounds})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Status:</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Monitoring
              </span>
            </div>
          </div>
        </div>

        {/* Right: Search, Notifications & Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search metrics, prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-44 lg:w-56"
            />
          </div>

          {/* Notifications Popover Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotification(!showNotification)}
              aria-label="View system notifications"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {showNotification && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-30 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-semibold text-slate-850">Statistical Change Alerts</span>
                  <button
                    onClick={() => setShowNotification(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg">
                    <p className="font-semibold text-rose-900 text-[11px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      Change Point Confirmed at Round 6
                    </p>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      Pettitt test p &lt; 0.001 detected distribution shift affecting Subgroup C (Disability &amp; Age) disparity.
                    </p>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                    <p className="font-medium text-slate-800 text-[11px]">Safety Violation Drift</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Violation rate increased from 3.2% baseline to 18.6% in post-drift rounds.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Modal Trigger */}
          <button
            onClick={onOpenSettings}
            aria-label="Open settings"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
