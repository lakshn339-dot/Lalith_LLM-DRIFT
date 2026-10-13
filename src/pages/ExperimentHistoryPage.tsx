/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { History, Search, ArrowRight, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { Experiment, PageId } from '../types';

interface ExperimentHistoryPageProps {
  experiments: Experiment[];
  activeExperimentId: string;
  onSelectExperiment: (exp: Experiment) => void;
  onNavigate: (page: PageId) => void;
}

export const ExperimentHistoryPage: React.FC<ExperimentHistoryPageProps> = ({
  experiments,
  activeExperimentId,
  onSelectExperiment,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = experiments.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700">
                <History className="w-4 h-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">
                Longitudinal Experiment Run History
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Audit log of completed evaluation rounds, drift detection checkpoints, and subgroup attribution runs.
            </p>
          </div>
          <button
            onClick={() => onNavigate('setup')}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Launch New Experiment
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search experiments by ID, model, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
          {filtered.length} Recorded Runs
        </span>
      </div>

      {/* Experiments History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold text-[11px]">
                <th className="py-3 px-4">Experiment Title &amp; ID</th>
                <th className="py-3 px-4">Model &amp; Checkpoint</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 font-mono">Rounds</th>
                <th className="py-3 px-4 font-mono">Drift Score</th>
                <th className="py-3 px-4">Change Point</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((exp) => {
                const isActive = exp.id === activeExperimentId;
                return (
                  <tr
                    key={exp.id}
                    className={`transition-colors ${
                      isActive ? 'bg-cyan-50/50 font-medium' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{exp.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{exp.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{exp.model}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{exp.modelVersion}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {exp.createdAt}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800 font-medium">
                      {exp.rounds}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {exp.overallDriftScore.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          exp.detectedChangePoint.includes('None')
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {exp.detectedChangePoint}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {exp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isActive ? (
                        <span className="text-[11px] text-cyan-700 font-bold px-2 py-1 bg-cyan-100/60 rounded">
                          Active Run
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectExperiment(exp);
                            onNavigate('dashboard');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 transition-colors"
                        >
                          Load <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
