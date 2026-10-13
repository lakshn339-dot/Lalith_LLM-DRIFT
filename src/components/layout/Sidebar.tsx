/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  LineChart,
  Users,
  ShieldAlert,
  Scale,
  CheckCircle2,
  GitCommit,
  FileText,
  Network,
  History,
  Activity,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PageId } from '../../types';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isBackendConnected: boolean;
  isMockMode: boolean;
  onToggleMockMode: () => void;
  activeExperimentName: string;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isBackendConnected,
  isMockMode,
  onToggleMockMode,
  activeExperimentName,
}) => {
  const navGroups: NavGroup[] = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Experiments',
      items: [
        { id: 'setup', label: 'Experiment Setup', icon: FlaskConical },
        { id: 'history', label: 'Experiment History', icon: History },
        { id: 'prompts', label: 'Prompt Bank', icon: BookOpen },
      ],
    },
    {
      group: 'Longitudinal Analysis',
      items: [
        { id: 'drift', label: 'Drift Analysis', icon: LineChart },
        { id: 'subgroup', label: 'Subgroup Analysis', icon: Users, badge: 'Group C' },
        { id: 'changepoint', label: 'Change Points', icon: GitCommit, badge: 'R6' },
      ],
    },
    {
      group: 'Evaluation Dimensions',
      items: [
        { id: 'safety', label: 'Safety', icon: ShieldAlert },
        { id: 'fairness', label: 'Fairness', icon: Scale },
        { id: 'factuality', label: 'Factuality', icon: CheckCircle2 },
      ],
    },
    {
      group: 'Documentation & System',
      items: [
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'architecture', label: 'Architecture', icon: Network },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col h-screen shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-semibold shadow-inner">
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              <span>LLM Drift Attribution</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">Subgroup-Aware Framework</p>
          </div>
        </div>
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {navGroups.map((group) => (
          <div key={group.group}>
            <div className="px-3 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {group.group}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectPage(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 font-semibold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          isActive
                            ? 'bg-cyan-400/20 text-cyan-200'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Telemetry & Status Section */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 space-y-2.5 text-xs">
        {/* System & API status */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            Backend API:
          </span>
          <button
            onClick={onToggleMockMode}
            title="Click to toggle between real backend API and mock dataset"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendConnected ? 'bg-emerald-400' : isMockMode ? 'bg-amber-400' : 'bg-rose-400'
              }`}
            />
            <span className="font-mono text-[11px] text-slate-300">
              {isBackendConnected ? 'Connected (Py)' : isMockMode ? 'Demo Data' : 'Offline'}
            </span>
          </button>
        </div>

        {/* Model Version */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Model Version:
          </span>
          <span className="font-mono text-[11px] text-slate-300">v1.0.4 (70B)</span>
        </div>

        {/* Current Experiment Card */}
        <div className="bg-slate-900/90 rounded-md p-2 border border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
            <span>ACTIVE EXPERIMENT</span>
            <span className="text-cyan-400 font-mono">10 Rounds</span>
          </div>
          <p className="text-xs font-medium text-slate-200 truncate" title={activeExperimentName}>
            {activeExperimentName}
          </p>
        </div>
      </div>
    </aside>
  );
};
