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
  ReferenceLine,
  ReferenceArea,
  BarChart,
  Bar,
} from 'recharts';
import { LineChart as LineIcon, Activity, TrendingUp, AlertTriangle, Layers } from 'lucide-react';
import { RoundEvaluation, Experiment } from '../types';

interface DriftAnalysisPageProps {
  roundEvaluations: RoundEvaluation[];
  experiment: Experiment;
}

export const DriftAnalysisPage: React.FC<DriftAnalysisPageProps> = ({
  roundEvaluations,
  experiment,
}) => {
  // Calculate drift velocity (delta from previous round)
  const driftVelocityData = roundEvaluations.map((r, idx) => {
    const prev = idx > 0 ? roundEvaluations[idx - 1].driftScore : r.driftScore;
    const delta = idx > 0 ? Number((r.driftScore - prev).toFixed(3)) : 0;
    return {
      round: r.round,
      driftScore: r.driftScore,
      velocity: delta,
      isChangePoint: r.round === 'R6',
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700">
                <LineIcon className="w-4 h-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">
                Behavioral Drift Metric Formulation &amp; Velocity
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multivariate behavioral distribution shift quantified via Maximum Mean Discrepancy (MMD) on last-layer representations.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
            Composite Drift Score: {experiment.overallDriftScore.toFixed(2)} / 1.00
          </span>
        </div>
      </div>

      {/* Main Drift Score and Drift Velocity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative Drift Score */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Cumulative Behavioral Drift Score S<sub>drift</sub>(t)
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated across all evaluation rounds R1–R10 (Scale: 0.00 – 1.00).
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roundEvaluations} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="round" stroke="#64748B" fontSize={11} />
                <YAxis domain={[0.0, 1.0]} ticks={[0.0, 0.2, 0.4, 0.6, 0.8, 1.0]} stroke="#64748B" fontSize={11} />
                <ReferenceLine x="R6" stroke="#E11D48" strokeDasharray="3 3" label={{ value: 'R6', fill: '#E11D48', fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="driftScore" name="Drift Score" stroke="#0F172A" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drift Velocity (Round-over-Round Acceleration) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Drift Velocity &Delta;S / &Delta;t (Round-over-Round Acceleration)
            </h3>
            <p className="text-xs text-slate-500">
              Round-over-round shift magnitude highlighting velocity surge at R6 (+0.33).
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driftVelocityData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="round" stroke="#64748B" fontSize={11} />
                <YAxis domain={[0.0, 0.4]} ticks={[0.0, 0.1, 0.2, 0.3, 0.4]} stroke="#64748B" fontSize={11} />
                <Tooltip />
                <Bar
                  dataKey="velocity"
                  name="Drift Velocity"
                  fill="#0284C7"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attribution Decomposition Formula Card */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm text-xs">
        <h4 className="font-semibold text-cyan-400 font-mono text-sm mb-1">
          Longitudinal Drift Decomposition Formalism
        </h4>
        <p className="text-slate-300 leading-relaxed mb-3">
          Our framework decomposes total behavioral drift D(M_t, M_0) into dimension-specific and subgroup-specific components:
        </p>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-200 overflow-x-auto">
          {'D(M_t, M_0) = α · MMD²_Safety(P_t, P_0) + β ∑_{g ∈ G} w_g · Δ_Fairness(g, t) + γ · KL(F_t || F_0)'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-slate-300">
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
            <span className="text-rose-400 font-semibold block">Safety Dimension ($\alpha = 0.34$)</span>
            <span>Jailbreak vulnerability and policy refusal compliance degradation.</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
            <span className="text-amber-400 font-semibold block">Fairness Dimension ($\beta = 0.42$)</span>
            <span>Demographic subgroup disparity divergence, dominated by Group C.</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
            <span className="text-cyan-400 font-semibold block">Factuality Dimension ($\gamma = 0.24$)</span>
            <span>Hallucination frequency and temporal grounding fidelity loss.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
