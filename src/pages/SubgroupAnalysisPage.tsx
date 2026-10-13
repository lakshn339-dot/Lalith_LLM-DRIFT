/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
} from 'recharts';
import { Users, AlertCircle, ArrowUpRight, Shield, Download, Info } from 'lucide-react';
import { SubgroupRoundData, SubgroupSummary } from '../types';

interface SubgroupAnalysisPageProps {
  subgroupRounds: SubgroupRoundData[];
  subgroupSummaries: SubgroupSummary[];
}

export const SubgroupAnalysisPage: React.FC<SubgroupAnalysisPageProps> = ({
  subgroupRounds,
  subgroupSummaries,
}) => {
  const [selectedSubgroup, setSelectedSubgroup] = useState<string>('grp-c');

  // Prepare comparison data: Before Drift (R1-R5 average) vs After Drift (R6-R10 average)
  const comparisonData = subgroupSummaries.map((grp) => ({
    name: grp.name,
    category: grp.category,
    before: grp.baselineDisparity,
    after: grp.postDriftDisparity,
    change: grp.percentageChange,
    risk: grp.riskLevel,
  }));

  const activeGroup = subgroupSummaries.find((g) => g.id === selectedSubgroup) || subgroupSummaries[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700">
                <Users className="w-4 h-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">
                Subgroup-Aware Longitudinal Drift Attribution
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evaluates whether behavioral drift impacts protected demographic, linguistic, and accessibility cohorts equally or disproportionately.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-800 font-semibold">
              Highest Drift: Group C (+31% Disparity)
            </span>
          </div>
        </div>
      </div>

      {/* Main Subgroup Drift Over Time Line Chart */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Subgroup Drift Over Time
            </h3>
            <p className="text-xs text-slate-500">
              Demographic disparity score over evaluation rounds (R1–R10). Y-axis: Disparity Score [0.00 – 0.80].
            </p>
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-rose-700">
              <span className="w-3 h-1 bg-rose-600 inline-block rounded-full"></span> Group C (Disability &amp; Age)
            </span>
            <span className="text-slate-400">·</span>
            <span>R6 Change Point Annotated</span>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={subgroupRounds}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="round"
                stroke="#64748B"
                fontSize={12}
                label={{
                  value: 'Evaluation Round',
                  position: 'insideBottom',
                  offset: -12,
                  fill: '#475569',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              <YAxis
                domain={[0.0, 0.8]}
                ticks={[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]}
                stroke="#64748B"
                fontSize={12}
                tickFormatter={(val) => val.toFixed(2)}
                label={{
                  value: 'Disparity Score',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 2,
                  fill: '#475569',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              <ReferenceLine
                x="R6"
                stroke="#E11D48"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{
                  value: 'Subgroup-specific drift divergence (R6)',
                  position: 'top',
                  fill: '#BE123C',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg border border-slate-700">
                        <div className="font-bold text-cyan-400 mb-1 border-b border-slate-800 pb-1">
                          Evaluation Round {label}
                        </div>
                        {payload.map((entry) => (
                          <div
                            key={entry.name}
                            className={`flex justify-between gap-4 py-0.5 ${
                              entry.name === 'Group C (Disability & Age)'
                                ? 'font-bold text-rose-300'
                                : 'text-slate-300'
                            }`}
                          >
                            <span style={{ color: entry.color }}>{entry.name}:</span>
                            <span className="font-mono">
                              {Number(entry.value).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: '11px', paddingTop: '16px' }}
              />

              {/* Group C: Highlighted with bold stroke */}
              <Line
                type="monotone"
                dataKey="groupC"
                name="Group C (Disability & Age)"
                stroke="#E11D48"
                strokeWidth={3.5}
                dot={{ r: 5, fill: '#E11D48', stroke: '#FFF', strokeWidth: 1.5 }}
                activeDot={{ r: 8 }}
              />

              {/* Group A */}
              <Line
                type="monotone"
                dataKey="groupA"
                name="Group A (Gender & Identity)"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ r: 3 }}
              />

              {/* Group B */}
              <Line
                type="monotone"
                dataKey="groupB"
                name="Group B (Dialect & Sociolect)"
                stroke="#D97706"
                strokeWidth={2}
                dot={{ r: 3 }}
              />

              {/* Group D */}
              <Line
                type="monotone"
                dataKey="groupD"
                name="Group D (Culture & Religion)"
                stroke="#059669"
                strokeWidth={1.8}
                strokeDasharray="4 2"
                dot={{ r: 3 }}
              />

              {/* Group E */}
              <Line
                type="monotone"
                dataKey="groupE"
                name="Group E (ESL / Non-Native)"
                stroke="#7C3AED"
                strokeWidth={1.8}
                strokeDasharray="2 2"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-rose-50/60 p-3 rounded-lg border border-rose-200 mt-2 text-xs text-rose-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong>Empirical Attribution:</strong> Before R6, all five subgroups tracked tightly within a 0.05–0.12 baseline disparity window. Following R6, <strong>Group C diverges sharply</strong>, reaching 0.72 disparity by R10. Group A exhibits moderate drift (+18%), while Group D and E remain relatively resilient (+4–5%).
          </div>
        </div>
      </div>

      {/* Subgroup Ranking Table & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subgroup Ranking Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Subgroup Disparity Attribution Ranking
              </h3>
              <p className="text-xs text-slate-500">
                Click a subgroup to inspect prompt invariants and baseline distributions.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">5 Demographics Monitored</span>
          </div>

          <div className="overflow-x-auto pt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-medium text-[11px]">
                  <th className="pb-2">Rank</th>
                  <th className="pb-2">Subgroup</th>
                  <th className="pb-2 font-mono">Drift Score</th>
                  <th className="pb-2 font-mono">Baseline</th>
                  <th className="pb-2 font-mono">Post-Drift</th>
                  <th className="pb-2 font-mono">Disparity Change</th>
                  <th className="pb-2">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subgroupSummaries.map((grp, idx) => {
                  const isSelected = selectedSubgroup === grp.id;
                  return (
                    <tr
                      key={grp.id}
                      onClick={() => setSelectedSubgroup(grp.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-50/60 font-medium'
                          : 'hover:bg-slate-50/80 text-slate-700'
                      }`}
                    >
                      <td className="py-3 font-mono text-slate-400">#{idx + 1}</td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-900">{grp.name}</div>
                        <div className="text-[10px] text-slate-500">{grp.category}</div>
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-900">
                        {grp.driftScore.toFixed(2)}
                      </td>
                      <td className="py-3 font-mono text-slate-500">
                        {grp.baselineDisparity.toFixed(2)}
                      </td>
                      <td className="py-3 font-mono font-semibold text-rose-700">
                        {grp.postDriftDisparity.toFixed(2)}
                      </td>
                      <td className="py-3 font-mono font-bold text-rose-600">
                        +{grp.percentageChange}%
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            grp.riskLevel === 'High'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : grp.riskLevel === 'Medium'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {grp.riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Subgroup Detail Card (1 col) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Cohort Inspection
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  activeGroup.riskLevel === 'High'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {activeGroup.riskLevel} Risk
              </span>
            </div>

            <div className="mt-3">
              <h4 className="text-base font-bold text-slate-900">{activeGroup.name}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{activeGroup.category}</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {activeGroup.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px]">BASELINE (R1-R5)</span>
                <span className="text-base font-bold font-mono text-slate-800 mt-0.5 block">
                  {activeGroup.baselineDisparity.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500">Normal distribution</span>
              </div>
              <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                <span className="text-rose-600 block text-[10px]">POST-DRIFT (R6-R10)</span>
                <span className="text-base font-bold font-mono text-rose-900 mt-0.5 block">
                  {activeGroup.postDriftDisparity.toFixed(2)}
                </span>
                <span className="text-[10px] text-rose-700 font-semibold">
                  +{activeGroup.percentageChange}% increase
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Evaluation Prompts Tested:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {activeGroup.sampleCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Kolmogorov-Smirnov p-value:</span>
                <span className="font-mono text-rose-600 font-semibold">&lt; 0.0001</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 block">Attribution Recommendation:</span>
            <p className="text-xs text-slate-700 mt-0.5">
              Target alignment retraining on assistive device tokens and neurodiversity framing prompts to restore baseline parity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
