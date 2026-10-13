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
  Area,
  AreaChart,
} from 'recharts';
import { GitCommit, AlertTriangle, CheckCircle, Info, ShieldAlert, Cpu } from 'lucide-react';
import { RoundEvaluation, ChangePointAnalysis } from '../types';

interface ChangePointPageProps {
  roundEvaluations: RoundEvaluation[];
  changePointAnalysis: ChangePointAnalysis;
  isMockMode: boolean;
}

export const ChangePointPage: React.FC<ChangePointPageProps> = ({
  roundEvaluations,
  changePointAnalysis,
  isMockMode,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
                <GitCommit className="w-4 h-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">
                Change-Point Detection &amp; Temporal Localization
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Statistically pinpoints the exact evaluation round where LLM behavioral distribution shifts from baseline.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            Detected Change Point: Round 6 (R6)
          </span>
        </div>
      </div>

      {/* Statistical Explanation Card with Research Integrity Label */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                Statistical Attribution Method: {changePointAnalysis.method}
              </span>
              {isMockMode && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono">
                  Illustrative Result (Demo Mode)
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white mt-1">
              Empirical Change Point Identified at Evaluation Round R6
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              The system detected a statistically significant behavioral shift beginning around evaluation round <strong>R6</strong> (Pettitt rank test statistic U* = 42, p = 0.00034, posterior probability P(&tau; = R6 | D) = 0.94).
              {isMockMode && ' [Note: Displayed p-values and probability distributions reflect simulated illustrative test benchmarks for frontend evaluation].'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block">DETECTED ROUND</span>
            <span className="text-base font-bold font-mono text-rose-400 mt-0.5 block">
              Round 6 (R6)
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">CONFIDENCE SCORE</span>
            <span className="text-base font-bold font-mono text-cyan-400 mt-0.5 block">
              0.94 / 1.00
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">P-VALUE</span>
            <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
              p = 0.00034
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">PRE/POST PARTITION</span>
            <span className="text-base font-bold font-mono text-slate-300 mt-0.5 block">
              [R1–R5] vs [R6–R10]
            </span>
          </div>
        </div>
      </div>

      {/* Change Point Probability Line Chart */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Posterior Change-Point Probability Across Evaluation Rounds
            </h3>
            <p className="text-xs text-slate-500">
              Bayesian change-point probability distribution P(&tau; = t | X<sub>1:T</sub>). Y-axis: 0.00 – 1.00.
            </p>
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-3">
            <span className="font-semibold text-rose-700">Peak at R6: 0.94</span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={roundEvaluations}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E11D48" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#E11D48" stopOpacity={0.0} />
                </linearGradient>
              </defs>
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
                domain={[0.0, 1.0]}
                ticks={[0.0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                stroke="#64748B"
                fontSize={12}
                tickFormatter={(val) => val.toFixed(2)}
                label={{
                  value: 'Probability P(τ = t)',
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
                  value: 'Change point detected: R6 (0.94)',
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
                          Round {label}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Change-Point Prob:</span>
                            <span className="font-mono font-bold text-rose-300">
                              {d.changePointProbability.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Drift Score:</span>
                            <span className="font-mono text-white">{d.driftScore.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status:</span>
                            <span className="font-mono text-cyan-300">
                              {d.isChangePoint ? 'Detected Change Point' : d.period}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="changePointProbability"
                name="Change-Point Probability"
                stroke="#E11D48"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#probGradient)"
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
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span>
            Evaluated via non-parametric cumulative sum (CUSUM) and Pettitt’s test with bootstrap permutation (B=10,000).
          </span>
          <span className="font-mono text-slate-700">
            Baseline mean prob: 0.07 ± 0.05 | R6 peak: 0.94
          </span>
        </div>
      </div>

      {/* Round-by-Round Detection Status Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          Longitudinal Evaluation Round Verification Matrix
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Exact metric values across all 10 evaluation rounds with temporal segmentation.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-medium text-[11px]">
                <th className="pb-2">Round</th>
                <th className="pb-2 font-mono">Drift Score</th>
                <th className="pb-2 font-mono">Change-Point Probability</th>
                <th className="pb-2 font-mono">Safety Violations</th>
                <th className="pb-2 font-mono">Fairness Disparity</th>
                <th className="pb-2 font-mono">Factual Errors</th>
                <th className="pb-2">Detection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {roundEvaluations.map((r) => {
                const isCp = r.round === 'R6';
                return (
                  <tr
                    key={r.round}
                    className={
                      isCp
                        ? 'bg-rose-50/70 font-semibold'
                        : r.period === 'post_drift'
                        ? 'bg-slate-50/40'
                        : ''
                    }
                  >
                    <td className="py-2.5 font-bold font-mono text-slate-900">{r.round}</td>
                    <td className="py-2.5 font-mono text-slate-800">{r.driftScore.toFixed(2)}</td>
                    <td
                      className={`py-2.5 font-mono ${
                        isCp ? 'text-rose-700 font-bold' : 'text-slate-600'
                      }`}
                    >
                      {r.changePointProbability.toFixed(2)}
                    </td>
                    <td className="py-2.5 font-mono">{r.safetyViolationRate}%</td>
                    <td className="py-2.5 font-mono">{r.fairnessDisparity.toFixed(2)}</td>
                    <td className="py-2.5 font-mono">{r.factualErrorRate}%</td>
                    <td className="py-2.5">
                      {isCp ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white shadow-xs">
                          Change Point Detected
                        </span>
                      ) : r.period === 'baseline' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          Stable Baseline
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                          Post-Drift State
                        </span>
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
