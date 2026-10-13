/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  BarChart,
  Bar,
} from 'recharts';
import { ShieldAlert, AlertTriangle, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import { RoundEvaluation } from '../types';

interface SafetyAnalysisPageProps {
  roundEvaluations: RoundEvaluation[];
}

export const SafetyAnalysisPage: React.FC<SafetyAnalysisPageProps> = ({
  roundEvaluations,
}) => {
  // Category breakdown before vs after drift
  const safetyCategories = [
    { category: 'Prompt Injection & Jailbreak', before: 2.8, after: 21.4, delta: '+18.6%' },
    { category: 'Cybersecurity & Exploitation', before: 3.1, after: 17.8, delta: '+14.7%' },
    { category: 'CBRN Dual-Use Hazards', before: 0.8, after: 6.2, delta: '+5.4%' },
    { category: 'Toxic Speech & Harassment', before: 4.2, after: 15.6, delta: '+11.4%' },
    { category: 'System Prompt Extraction', before: 3.4, after: 18.2, delta: '+14.8%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">
                Longitudinal Safety Behavior Drift Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tracks policy compliance, adversarial bypass rates, and refusal degradation over evaluation rounds R1–R10.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
              Drift Status: Significant Safety Erosion
            </span>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards: Before Drift, After Drift, Absolute Change, Relative Change */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Baseline Period (R1–R5)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-800">3.5%</span>
            <span className="text-xs text-slate-400">avg violation</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3 h-3" />
            Within compliance threshold (&lt; 5%)
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Post-Drift Period (R6–R10)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-rose-600">15.9%</span>
            <span className="text-xs text-slate-400">avg violation</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3" />
            Exceeds policy threshold (18.6% peak)
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Absolute Change</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-rose-700">+12.4%</span>
            <span className="text-xs text-slate-400">percentage points</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Absolute jump across 15,000 safety prompts
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Relative Change</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-rose-700">+354.2%</span>
            <span className="text-xs text-slate-400">relative surge</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            4.5x increase in unsafe output completions
          </p>
        </div>
      </div>

      {/* Main Chart: Safety Violation Rate Over Evaluation Rounds */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Safety Behavior Over Evaluation Rounds
            </h3>
            <p className="text-xs text-slate-500">
              Safety Violation Rate (%) on standardized red-teaming and jailbreak benchmark suite.
            </p>
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Baseline Zone (R1–R5)
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Post-Drift Zone (R6–R10)
            </span>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={roundEvaluations}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />

              {/* Baseline Period Shading */}
              <ReferenceArea
                x1="R1"
                x2="R5"
                fill="#F8FAFC"
                fillOpacity={0.7}
                label={{
                  value: 'Baseline Period (Safe Refusal Rates: 93-95%)',
                  position: 'insideTopLeft',
                  fill: '#64748B',
                  fontSize: 11,
                  offset: 10,
                }}
              />

              {/* Post-Drift Shading */}
              <ReferenceArea
                x1="R6"
                x2="R10"
                fill="#FFF1F2"
                fillOpacity={0.4}
                label={{
                  value: 'Post-Drift Period (Safety Erosion: 11-19%)',
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
                label={{
                  value: 'Evaluation Round',
                  position: 'insideBottom',
                  offset: -12,
                  fill: '#475569',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />

              {/* 0 - 25% scale with explicit ticks */}
              <YAxis
                domain={[0, 25]}
                ticks={[0, 5, 10, 15, 20, 25]}
                stroke="#64748B"
                fontSize={12}
                tickFormatter={(val) => `${val}%`}
                label={{
                  value: 'Safety Violation Rate (%)',
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
                  value: 'Detected Change Point: Safety degradation onset (R6)',
                  position: 'top',
                  fill: '#BE123C',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as RoundEvaluation;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg border border-slate-700 min-w-44">
                        <div className="font-bold text-cyan-400 mb-1 border-b border-slate-800 pb-1">
                          Evaluation Round {label}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Safety Violation Rate:</span>
                            <span className="font-mono font-bold text-rose-300">
                              {d.safetyViolationRate}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Unsafe Response Rate:</span>
                            <span className="font-mono text-white">
                              {d.unsafeResponseRate}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Refusal Rate:</span>
                            <span className="font-mono text-emerald-400">
                              {d.refusalRate}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Change Point Prob:</span>
                            <span className="font-mono text-amber-300">
                              {d.changePointProbability}
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
                dataKey="safetyViolationRate"
                name="Safety Violation Rate (%)"
                stroke="#BE123C"
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const isCp = payload.round === 'R6';
                  return (
                    <circle
                      key={payload.round}
                      cx={cx}
                      cy={cy}
                      r={isCp ? 6 : 4}
                      fill={isCp ? '#E11D48' : '#BE123C'}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span>
            Safety policy specification: Refusal invariants evaluated on JailbreakBench and HarmEval benchmark subsets.
          </span>
          <span className="font-mono font-medium text-slate-700">
            Baseline mean: 3.50% ± 0.38% | Post-drift mean: 15.92% ± 2.91%
          </span>
        </div>
      </div>

      {/* Safety Vector Degradation Breakdown */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          Safety Attack Vector Degradation Breakdown
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Comparison of specific safety failure modes before drift (R1–R5) vs after drift (R6–R10).
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-medium text-[11px]">
                <th className="pb-2">Threat Category</th>
                <th className="pb-2 font-mono">Baseline (R1–R5)</th>
                <th className="pb-2 font-mono">Post-Drift (R6–R10)</th>
                <th className="pb-2 font-mono">Absolute Delta</th>
                <th className="pb-2">Impact Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {safetyCategories.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-2.5 font-medium text-slate-900">{row.category}</td>
                  <td className="py-2.5 font-mono text-emerald-700">{row.before}%</td>
                  <td className="py-2.5 font-mono text-rose-700 font-semibold">{row.after}%</td>
                  <td className="py-2.5 font-mono text-rose-600 font-bold">{row.delta}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                      High Drift
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
