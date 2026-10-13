/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Scale, Users, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { RoundEvaluation, SubgroupSummary } from '../types';

interface FairnessAnalysisPageProps {
  roundEvaluations: RoundEvaluation[];
  subgroupSummaries: SubgroupSummary[];
}

export const FairnessAnalysisPage: React.FC<FairnessAnalysisPageProps> = ({
  roundEvaluations,
  subgroupSummaries,
}) => {
  // Prepare grouped bar chart data for Before vs After drift
  const barChartData = subgroupSummaries.map((grp) => ({
    name: grp.name,
    category: grp.category,
    before: grp.baselineDisparity,
    after: grp.postDriftDisparity,
    delta: grp.percentageChange,
    risk: grp.riskLevel,
  }));

  const latestRound = roundEvaluations[roundEvaluations.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Scale className="w-4 h-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">
                Longitudinal Fairness &amp; Parity Drift Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Measures demographic parity differences, equalized disparity bounds, and counterfactual subgroup consistency across R1–R10.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            Fairness Status: Disparity Widened
          </span>
        </div>
      </div>

      {/* 4 Fairness Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Overall Group Disparity</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {latestRound.fairnessDisparity.toFixed(2)}
            </span>
            <span className="text-xs text-rose-600 font-semibold">(vs 0.07 R1)</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Max-min disparity ratio</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Demographic Parity Diff</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-700">
              {latestRound.demographicParityDiff.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">Δ = +0.30</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Selection rate deviation</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Equalized Difference</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-700">
              {latestRound.equalizedDiff.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">Δ = +0.32</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">True positive disparity</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Fairness Drift Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-rose-600">+8.7%</span>
            <span className="text-xs text-slate-400">composite</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Normed attribution drift</span>
        </div>
      </div>

      {/* Main Grouped Bar Chart: Before Drift vs After Drift for each subgroup */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Subgroup Disparity: Before Drift vs. After Drift
            </h3>
            <p className="text-xs text-slate-500">
              Disparity Score [0.00 – 0.80] comparing baseline rounds (R1–R5 average) with post-drift rounds (R6–R10 average).
            </p>
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 bg-slate-300 inline-block rounded-xs"></span> Baseline (R1–R5)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-amber-700">
              <span className="w-3 h-3 bg-amber-600 inline-block rounded-xs"></span> Post-Drift (R6–R10)
            </span>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={12}
                label={{
                  value: 'Demographic Subgroups',
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
                y={0.2}
                stroke="#F59E0B"
                strokeDasharray="4 4"
                label={{
                  value: 'Acceptable Fairness Tolerance Bound (0.20)',
                  position: 'right',
                  fill: '#D97706',
                  fontSize: 11,
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg border border-slate-700">
                        <div className="font-bold text-cyan-400 mb-1 border-b border-slate-800 pb-1">
                          {label} — {data.category}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Baseline Disparity:</span>
                            <span className="font-mono text-slate-200">
                              {data.before.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-amber-400">Post-Drift Disparity:</span>
                            <span className="font-mono font-bold text-amber-300">
                              {data.after.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
                            <span className="text-slate-400">Relative Drift Increase:</span>
                            <span className="font-mono font-bold text-rose-400">
                              +{data.delta}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="before" name="Before Drift (R1–R5)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="after" name="After Drift (R6–R10)" fill="#D97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span>
            Tolerance threshold defined at disparity ≤ 0.20 based on Equal Opportunity and Disparate Impact 80% rule.
          </span>
          <span className="font-mono text-rose-600 font-semibold">
            Group C &amp; Group A breached tolerance threshold
          </span>
        </div>
      </div>

      {/* Subgroup Fairness Detailed Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          Subgroup Parity Audit Matrix
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Summary of before/after drift metrics and risk classification across all evaluated cohorts.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-medium text-[11px]">
                <th className="pb-2">Subgroup</th>
                <th className="pb-2">Category Description</th>
                <th className="pb-2 font-mono">Before Drift</th>
                <th className="pb-2 font-mono">After Drift</th>
                <th className="pb-2 font-mono">Change</th>
                <th className="pb-2">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {subgroupSummaries.map((grp) => (
                <tr key={grp.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 font-bold text-slate-900">{grp.name}</td>
                  <td className="py-2.5 text-slate-600">{grp.category}</td>
                  <td className="py-2.5 font-mono text-slate-500">{grp.baselineDisparity.toFixed(2)}</td>
                  <td className="py-2.5 font-mono font-semibold text-amber-700">
                    {grp.postDriftDisparity.toFixed(2)}
                  </td>
                  <td className="py-2.5 font-mono font-bold text-rose-600">
                    +{grp.percentageChange}%
                  </td>
                  <td className="py-2.5">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
