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
  AreaChart,
  Area,
} from 'recharts';
import { CheckCircle2, AlertTriangle, HelpCircle, FileCheck, Brain } from 'lucide-react';
import { RoundEvaluation } from '../types';

interface FactualityAnalysisPageProps {
  roundEvaluations: RoundEvaluation[];
}

export const FactualityAnalysisPage: React.FC<FactualityAnalysisPageProps> = ({
  roundEvaluations,
}) => {
  const latestRound = roundEvaluations[roundEvaluations.length - 1];

  const factualDomains = [
    { domain: 'Biomedical & Clinical Guidelines', before: 3.2, after: 15.4, delta: '+12.2%' },
    { domain: 'Temporal & Current Event Entities', before: 5.6, after: 23.1, delta: '+17.5%' },
    { domain: 'Numerical & Mathematical Derivations', before: 4.1, after: 14.8, delta: '+10.7%' },
    { domain: 'Legal & Regulatory Standards', before: 2.9, after: 12.3, delta: '+9.4%' },
    { domain: 'Scientific Literature Citations', before: 6.7, after: 28.2, delta: '+21.5%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">
                Longitudinal Factuality &amp; Hallucination Drift Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evaluates grounding, temporal knowledge alignment, and hallucination emergence across evaluation rounds R1–R10.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
            Factuality Status: Hallucinations Increased (+10.2%)
          </span>
        </div>
      </div>

      {/* 4 Factuality KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Factual Error Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-rose-600">
              {latestRound.factualErrorRate}%
            </span>
            <span className="text-xs text-slate-400">(vs 4.5% R1)</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">TruthfulQA &amp; FactualDrift suite</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Hallucination Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-rose-600">
              {latestRound.hallucinationRate}%
            </span>
            <span className="text-xs text-rose-600 font-semibold">+13.3% Δ</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Fabricated citations / entities</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Factuality Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-800">
              {latestRound.factualityScore}%
            </span>
            <span className="text-xs text-slate-400">(vs 95.5% R1)</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Normalized factual fidelity</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Factuality Drift</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-rose-600">+10.2%</span>
            <span className="text-xs text-slate-400">attribution score</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Statistically significant shift</span>
        </div>
      </div>

      {/* Main Chart: Factuality Performance Over Time */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Factuality Performance Over Time
            </h3>
            <p className="text-xs text-slate-500">
              Factual Error Rate (%) across evaluation rounds R1–R10. Y-axis: 0% – 25%.
            </p>
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-800 font-medium">
              <span className="w-3 h-0.5 bg-cyan-700 inline-block"></span> Factual Error Rate
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-rose-600 font-medium">Change Point at R6</span>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={roundEvaluations}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />

              <ReferenceArea
                x1="R1"
                x2="R5"
                fill="#F8FAFC"
                fillOpacity={0.7}
                label={{
                  value: 'Baseline Period (Error Rate: 4.3–5.3%)',
                  position: 'insideTopLeft',
                  fill: '#64748B',
                  fontSize: 11,
                  offset: 10,
                }}
              />

              <ReferenceArea
                x1="R6"
                x2="R10"
                fill="#FFF1F2"
                fillOpacity={0.35}
                label={{
                  value: 'Post-Drift Degradation Period',
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

              <YAxis
                domain={[0, 25]}
                ticks={[0, 5, 10, 15, 20, 25]}
                stroke="#64748B"
                fontSize={12}
                tickFormatter={(val) => `${val}%`}
                label={{
                  value: 'Factual Error Rate (%)',
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
                  value: 'Detected Change Point: Factuality degradation onset (R6)',
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
                            <span className="text-slate-400">Factual Error Rate:</span>
                            <span className="font-mono font-bold text-rose-300">
                              {d.factualErrorRate}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Hallucination Rate:</span>
                            <span className="font-mono text-amber-300">
                              {d.hallucinationRate}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Factuality Score:</span>
                            <span className="font-mono text-emerald-400">
                              {d.factualityScore}%
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
                dataKey="factualErrorRate"
                name="Factual Error Rate (%)"
                stroke="#0284C7"
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
                      fill={isCp ? '#E11D48' : '#0284C7'}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 7 }}
              />

              <Line
                type="monotone"
                dataKey="hallucinationRate"
                name="Hallucination Rate (%)"
                stroke="#D97706"
                strokeWidth={2}
                strokeDasharray="4 2"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span>
            TruthfulQA + MedQA + FEVER benchmarks verified with automated claim attribution and grounding invariants.
          </span>
          <span className="font-mono text-slate-700">
            Factual errors grew from 4.5% to 19.8% (Δ = +15.3%)
          </span>
        </div>
      </div>

      {/* Domain Knowledge Degradation Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          Domain Factuality Degradation Comparison
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Error rates before drift onset (R1–R5) compared to post-drift accumulation (R6–R10).
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-medium text-[11px]">
                <th className="pb-2">Knowledge Domain</th>
                <th className="pb-2 font-mono">Baseline Error Rate</th>
                <th className="pb-2 font-mono">Post-Drift Error Rate</th>
                <th className="pb-2 font-mono">Absolute Delta</th>
                <th className="pb-2">Vulnerability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {factualDomains.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-2.5 font-medium text-slate-900">{row.domain}</td>
                  <td className="py-2.5 font-mono text-emerald-700">{row.before}%</td>
                  <td className="py-2.5 font-mono text-rose-700 font-semibold">{row.after}%</td>
                  <td className="py-2.5 font-mono text-rose-600 font-bold">{row.delta}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                      Significant Drift
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
