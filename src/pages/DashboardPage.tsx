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
  ReferenceArea,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  GitCommit,
  Users,
  ShieldAlert,
  Scale,
  CheckCircle2,
  ArrowUpRight,
  HelpCircle,
  Maximize2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Experiment, RoundEvaluation, SubgroupSummary, PageId } from '../types';

interface DashboardPageProps {
  experiment: Experiment;
  roundEvaluations: RoundEvaluation[];
  subgroupSummaries: SubgroupSummary[];
  onNavigate: (page: PageId) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  experiment,
  roundEvaluations,
  subgroupSummaries,
  onNavigate,
}) => {
  // Dimension toggles for multi-line chart
  const [visibleDimensions, setVisibleDimensions] = useState({
    safety: true,
    fairness: true,
    factuality: true,
  });

  const toggleDimension = (dim: 'safety' | 'fairness' | 'factuality') => {
    setVisibleDimensions((prev) => ({ ...prev, [dim]: !prev[dim] }));
  };

  // Prepare normalized dimensions data (0.00 - 1.00)
  const dimensionsData = roundEvaluations.map((item) => ({
    round: item.round,
    safetyNormalized: Number((item.safetyViolationRate / 25).toFixed(3)), // 0-25% -> 0.00-1.00
    fairnessNormalized: Number((item.fairnessDisparity / 0.5).toFixed(3)), // 0-0.50 -> 0.00-1.00
    factualityNormalized: Number((item.factualErrorRate / 25).toFixed(3)), // 0-25% -> 0.00-1.00
    rawSafety: item.safetyViolationRate,
    rawFairness: item.fairnessDisparity,
    rawFactuality: item.factualErrorRate,
  }));

  // KPI card configs
  const kpis = [
    {
      label: 'Overall Drift Score',
      value: experiment.overallDriftScore.toFixed(2),
      prevValue: '0.12',
      change: '+458%',
      status: 'Significant Drift',
      statusColor: 'text-rose-700 bg-rose-50 border-rose-200',
      icon: TrendingUp,
      route: 'drift' as PageId,
    },
    {
      label: 'Change Point',
      value: experiment.detectedChangePoint,
      prevValue: 'None (R1-R5)',
      change: 'Detected at R6',
      status: 'p < 0.001 (Pettitt)',
      statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
      icon: GitCommit,
      route: 'changepoint' as PageId,
    },
    {
      label: 'Subgroups Affected',
      value: experiment.subgroupsAffected,
      prevValue: '0 / 5 (Baseline)',
      change: '+60% Disproportion',
      status: 'Group C Dominant',
      statusColor: 'text-rose-700 bg-rose-50 border-rose-200',
      icon: Users,
      route: 'subgroup' as PageId,
    },
    {
      label: 'Safety Drift',
      value: `+${experiment.safetyDrift}%`,
      prevValue: '3.2% (R1)',
      change: '18.6% (R10)',
      status: 'Alert: Violations Up',
      statusColor: 'text-rose-700 bg-rose-50 border-rose-200',
      icon: ShieldAlert,
      route: 'safety' as PageId,
    },
    {
      label: 'Fairness Drift',
      value: `+${experiment.fairnessDrift}%`,
      prevValue: '0.07 (R1)',
      change: '0.42 (R10)',
      status: 'Disparity Widening',
      statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
      icon: Scale,
      route: 'fairness' as PageId,
    },
    {
      label: 'Factuality Drift',
      value: `+${experiment.factualityDrift}%`,
      prevValue: '4.5% (R1)',
      change: '19.8% (R10)',
      status: 'Error Rate Jumps',
      statusColor: 'text-rose-700 bg-rose-50 border-rose-200',
      icon: CheckCircle2,
      route: 'factuality' as PageId,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Research Questions Executive Checklist */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              IEEE Empirical Attribution Summary
            </span>
            <h2 className="text-base font-semibold text-white mt-0.5">
              Longitudinal Drift Attribution Diagnostic Answers
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated answers to core research hypotheses across 10 evaluation rounds ($N=50,000$ prompts).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('reports')}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors"
            >
              Generate Full Paper Report
            </button>
          </div>
        </div>

        {/* 6 Research Answers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-medium">1. Did LLM drift?</span>
            <span className="text-sm font-bold text-rose-400 block mt-1">Yes (Statistically)</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Score: 0.67 / 1.00</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-medium">2. When did it drift?</span>
            <span className="text-sm font-bold text-amber-400 block mt-1">Round 6 (R6)</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">p = 0.00034</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-medium">3. Which subgroup?</span>
            <span className="text-sm font-bold text-rose-400 block mt-1">Group C (+31%)</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Disability &amp; Age</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-medium">4. Did safety change?</span>
            <span className="text-sm font-bold text-rose-400 block mt-1">+12.4% Violations</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">3.2% → 18.6%</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-medium">5. Did fairness change?</span>
            <span className="text-sm font-bold text-amber-400 block mt-1">+8.7% Disparity</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">0.07 → 0.42</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-medium">6. Did factuality change?</span>
            <span className="text-sm font-bold text-rose-400 block mt-1">+10.2% Errors</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">4.5% → 19.8%</span>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              onClick={() => onNavigate(kpi.route)}
              className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:border-cyan-400 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium text-slate-600 truncate">{kpi.label}</span>
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors shrink-0" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono tracking-tight text-slate-900">
                  {kpi.value}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
                <span className="text-slate-400 truncate">Prev: {kpi.prevValue}</span>
                <span className={`px-1.5 py-0.5 rounded font-medium border ${kpi.statusColor}`}>
                  {kpi.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN DRIFT GRAPH: Longitudinal Behavioral Drift */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Longitudinal Behavioral Drift Across Evaluation Rounds
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm font-mono">
                Metric: Drift Score [0.00 – 1.00]
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kernel maximum mean discrepancy (MMD) on behavioral embeddings showing stable baseline (R1–R5) followed by sharp change point at R6.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-0.5 bg-slate-400 inline-block" />
              <span>Baseline (R1–R5)</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-700 font-medium">
              <span className="w-3 h-0.5 bg-rose-600 border-t border-dashed inline-block" />
              <span>Change Point (R6)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-0.5 bg-cyan-700 inline-block" />
              <span>Post-Drift (R7–R10)</span>
            </div>
          </div>
        </div>

        {/* Chart Stage */}
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={roundEvaluations}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />

              {/* Baseline Period Shading: R1 to R5 */}
              <ReferenceArea
                x1="R1"
                x2="R5"
                fill="#F8FAFC"
                fillOpacity={0.8}
                label={{
                  value: 'Baseline Period (R1–R5)',
                  position: 'insideTopLeft',
                  fill: '#64748B',
                  fontSize: 11,
                  offset: 10,
                }}
              />

              {/* Post-Drift Period Shading: R6 to R10 */}
              <ReferenceArea
                x1="R6"
                x2="R10"
                fill="#FFF1F2"
                fillOpacity={0.35}
                label={{
                  value: 'Post-Drift Divergence (R6–R10)',
                  position: 'insideTopRight',
                  fill: '#BE123C',
                  fontSize: 11,
                  offset: 10,
                }}
              />

              <XAxis
                dataKey="round"
                stroke="#64748B"
                fontSize={12}
                tickLine={{ stroke: '#94A3B8' }}
                axisLine={{ stroke: '#CBD5E1' }}
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
                domain={[0.0, 1.0]}
                ticks={[0.0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                stroke="#64748B"
                fontSize={12}
                tickLine={{ stroke: '#94A3B8' }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickFormatter={(val) => val.toFixed(2)}
                label={{
                  value: 'Drift Score',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 2,
                  fill: '#475569',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />

              {/* Vertical Reference Line at R6 */}
              <ReferenceLine
                x="R6"
                stroke="#E11D48"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{
                  value: 'Detected Change Point (R6, p < 0.001)',
                  position: 'top',
                  fill: '#BE123C',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as RoundEvaluation;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg border border-slate-700 min-w-44">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                          <span className="font-bold text-cyan-400 font-mono">
                            Round {label}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              data.isChangePoint
                                ? 'bg-rose-500/30 text-rose-300 font-bold'
                                : data.period === 'baseline'
                                ? 'bg-slate-800 text-slate-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {data.isChangePoint
                              ? 'Change Point'
                              : data.period === 'baseline'
                              ? 'Baseline'
                              : 'Post-Drift'}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Drift Score:</span>
                            <span className="font-mono font-bold text-white">
                              {data.driftScore.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Safety Violations:</span>
                            <span className="font-mono text-rose-300">
                              {data.safetyViolationRate}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Fairness Disparity:</span>
                            <span className="font-mono text-amber-300">
                              {data.fairnessDisparity.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Factual Error Rate:</span>
                            <span className="font-mono text-cyan-300">
                              {data.factualErrorRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line
                type="monotone"
                dataKey="driftScore"
                name="Drift Score"
                stroke="#0F172A"
                strokeWidth={2.5}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const isCp = payload.round === 'R6';
                  return (
                    <circle
                      key={payload.round}
                      cx={cx}
                      cy={cy}
                      r={isCp ? 6 : 4}
                      fill={isCp ? '#E11D48' : '#0F172A'}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 7, stroke: '#0284C7', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Annotation: <strong>Detected Change Point at R6</strong> (Drift score: 0.15 → 0.48, Δ = +220%).
          </span>
          <button
            onClick={() => onNavigate('drift')}
            className="text-cyan-700 hover:text-cyan-800 font-medium inline-flex items-center gap-1"
          >
            Detailed Drift Attribution Analysis <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two-Column Grid: Drift Dimensions & Subgroup Attribution Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Multi-line Drift Dimensions Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Multidimensional Drift Dynamics
                </h3>
                <p className="text-xs text-slate-500">
                  Normalized drift score (0.00–1.00) across Safety, Fairness, and Factuality.
                </p>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
                <button
                  onClick={() => toggleDimension('safety')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    visibleDimensions.safety
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Safety
                </button>
                <button
                  onClick={() => toggleDimension('fairness')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    visibleDimensions.fairness
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Fairness
                </button>
                <button
                  onClick={() => toggleDimension('factuality')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    visibleDimensions.factuality
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Factuality
                </button>
              </div>
            </div>

            <div className="h-64 w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dimensionsData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="round" stroke="#64748B" fontSize={11} />
                  <YAxis
                    domain={[0.0, 1.0]}
                    ticks={[0.0, 0.25, 0.5, 0.75, 1.0]}
                    stroke="#64748B"
                    fontSize={11}
                    tickFormatter={(val) => val.toFixed(2)}
                  />
                  <ReferenceLine x="R6" stroke="#E11D48" strokeDasharray="3 3" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-md border border-slate-700">
                            <div className="font-semibold text-cyan-400 mb-1">Round {label}</div>
                            {payload.map((entry) => (
                              <div key={entry.name} className="flex justify-between gap-4 text-[11px]">
                                <span style={{ color: entry.color }}>{entry.name}:</span>
                                <span className="font-mono text-white">
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
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

                  {visibleDimensions.safety && (
                    <Line
                      type="monotone"
                      dataKey="safetyNormalized"
                      name="Safety Drift"
                      stroke="#E11D48"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  )}
                  {visibleDimensions.fairness && (
                    <Line
                      type="monotone"
                      dataKey="fairnessNormalized"
                      name="Fairness Drift"
                      stroke="#D97706"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  )}
                  {visibleDimensions.factuality && (
                    <Line
                      type="monotone"
                      dataKey="factualityNormalized"
                      name="Factuality Drift"
                      stroke="#0284C7"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            Observation: Safety and fairness drift co-occur simultaneously at R6, while factuality error accumulation accelerates in subsequent rounds R7–R10.
          </p>
        </div>

        {/* RIGHT: Subgroup Attribution Ranking Table */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Subgroup Attribution Ranking
                </h3>
                <p className="text-xs text-slate-500">
                  Demographic subgroups ordered by relative disparity drift severity.
                </p>
              </div>
              <button
                onClick={() => onNavigate('subgroup')}
                className="text-xs text-cyan-700 hover:text-cyan-800 font-medium inline-flex items-center gap-1"
              >
                Deep Dive <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-medium text-[11px]">
                    <th className="pb-2">Rank</th>
                    <th className="pb-2">Subgroup</th>
                    <th className="pb-2 font-mono">Drift Score</th>
                    <th className="pb-2 font-mono">Change</th>
                    <th className="pb-2">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-750">
                  {subgroupSummaries.map((grp, idx) => (
                    <tr
                      key={grp.id}
                      className={grp.riskLevel === 'High' ? 'bg-rose-50/40 font-medium' : ''}
                    >
                      <td className="py-2.5 font-mono text-slate-400">#{idx + 1}</td>
                      <td className="py-2.5">
                        <div className="font-semibold text-slate-900">{grp.name}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                          {grp.category}
                        </div>
                      </td>
                      <td className="py-2.5 font-mono font-semibold text-slate-900">
                        {grp.driftScore.toFixed(2)}
                      </td>
                      <td className="py-2.5 font-mono text-rose-600 font-semibold">
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

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-600 mt-3">
            <strong className="text-slate-800">Key Finding:</strong> Subgroup C (Disability &amp; Neurodiversity) exhibits the highest disproportionate disparity (+31%), confirming that LLM drift is non-uniform across protected demographic axes.
          </div>
        </div>
      </div>
    </div>
  );
};
