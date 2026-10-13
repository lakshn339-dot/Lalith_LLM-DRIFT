/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  PlusCircle,
  CheckSquare,
  Square,
  CheckCircle2,
  Loader2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Experiment, PageId } from '../types';
import { createExperiment, runEvaluation } from '../services/api';

interface ExperimentSetupPageProps {
  onExperimentCreated: (newExp: Experiment) => void;
  onNavigate: (page: PageId) => void;
}

export const ExperimentSetupPage: React.FC<ExperimentSetupPageProps> = ({
  onExperimentCreated,
  onNavigate,
}) => {
  const [name, setName] = useState('Checkpoint 5 Continuous Alignment Audit');
  const [model, setModel] = useState('LLM Model v1.0');
  const [modelVersion, setModelVersion] = useState('v1.0.5-preview (70B)');
  const [rounds, setRounds] = useState(10);
  const [dataset, setDataset] = useState('Multi-Benchmark Longitudinal Suite (N=50k)');
  const [languages, setLanguages] = useState('English (US), English (AAVE), English (UK)');
  const [subgroups, setSubgroups] = useState('Group A (Gender), Group B (Dialect), Group C (Disability), Group D (Culture), Group E (ESL)');
  const [description, setDescription] = useState('Continuous longitudinal evaluation across 10 rounds to benchmark drift attribution post-checkpoint fine-tuning.');

  // Dimensions
  const [evalSafety, setEvalSafety] = useState(true);
  const [evalFairness, setEvalFairness] = useState(true);
  const [evalFactuality, setEvalFactuality] = useState(true);
  const [evalBehavioralDrift, setEvalBehavioralDrift] = useState(true);

  // Execution state
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionRound, setExecutionRound] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [createdExperiment, setCreatedExperiment] = useState<Experiment | null>(null);

  const handleReset = () => {
    setName('');
    setModel('LLM Model v1.0');
    setModelVersion('v1.0.5');
    setRounds(10);
    setDescription('');
    setCreatedExperiment(null);
    setLogs([]);
  };

  const handleCreateAndRun = async () => {
    setIsExecuting(true);
    setExecutionRound(1);
    setLogs(['[System] Initializing model inference worker containers...']);

    // Call API
    const res = await createExperiment({
      name,
      model,
      modelVersion,
      rounds: Number(rounds),
      dataset,
      description,
    });

    const exp = res.data;
    setCreatedExperiment(exp);

    // Simulate round-by-round execution
    for (let r = 1; r <= 10; r++) {
      setExecutionRound(r);
      await new Promise((resolve) => setTimeout(resolve, 350));
      setLogs((prev) => [
        `[Round R${r}] Evaluated 5,000 prompt queries across Groups A-E ${
          r === 6 ? '--> [ALERT: Potential change point detected via Pettitt test]' : ''
        }`,
        ...prev.slice(0, 5),
      ]);
    }

    setIsExecuting(false);
    onExperimentCreated(exp);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700">
            <FlaskConical className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              New Longitudinal Experiment Setup
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure models, prompt sets, evaluation intervals, and demographic strata for automated drift attribution.
            </p>
          </div>
        </div>
      </div>

      {/* Main Setup Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
            Experiment Configuration Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Experiment Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium text-slate-800"
                placeholder="e.g. Checkpoint 5 Continuous Alignment Audit"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Model Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Model Version / Checkpoint <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={modelVersion}
                onChange={(e) => setModelVersion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Evaluation Rounds (Sequential) <span className="text-rose-500">*</span>
              </label>
              <select
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800 font-mono"
              >
                <option value={5}>5 Rounds (R1–R5)</option>
                <option value={8}>8 Rounds (R1–R8)</option>
                <option value={10}>10 Rounds (R1–R10 - Standard IEEE Suite)</option>
                <option value={15}>15 Rounds (R1–R15)</option>
                <option value={20}>20 Rounds (R1–R20)</option>
              </select>
            </div>
          </div>

          <div className="text-xs space-y-3 pt-2">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Prompt Dataset Suite</label>
              <input
                type="text"
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Target Languages &amp; Dialects</label>
              <input
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Demographic Subgroup Stratification</label>
              <input
                type="text"
                value={subgroups}
                onChange={(e) => setSubgroups(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Experiment Description &amp; Hypotheses</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          {/* Evaluation Dimensions Checkboxes */}
          <div className="pt-3 border-t border-slate-100">
            <label className="font-semibold text-slate-800 block text-xs mb-2">
              Evaluation Dimensions &amp; Invariants
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={evalSafety}
                  onChange={(e) => setEvalSafety(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-0"
                />
                <span className="font-medium text-slate-800">Safety Invariants</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={evalFairness}
                  onChange={(e) => setEvalFairness(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-0"
                />
                <span className="font-medium text-slate-800">Fairness &amp; Parity</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={evalFactuality}
                  onChange={(e) => setEvalFactuality(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-0"
                />
                <span className="font-medium text-slate-800">Factuality Fidelity</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={evalBehavioralDrift}
                  onChange={(e) => setEvalBehavioralDrift(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-0"
                />
                <span className="font-medium text-slate-800">Behavioral Drift (MMD)</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 text-xs font-medium hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Parameters
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateAndRun}
                disabled={isExecuting || !name}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Executing Round R{executionRound} of 10...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Create &amp; Run Evaluation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Execution Console & Status (1 col) */}
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Execution Monitor
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Worker Node #01
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Evaluation Progress</span>
                <span className="font-mono text-cyan-300">
                  {isExecuting
                    ? `${Math.round((executionRound / 10) * 100)}% (R${executionRound}/10)`
                    : createdExperiment
                    ? '100% Completed'
                    : 'Ready to dispatch'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full transition-all duration-300"
                  style={{
                    width: isExecuting
                      ? `${(executionRound / 10) * 100}%`
                      : createdExperiment
                      ? '100%'
                      : '0%',
                  }}
                />
              </div>
            </div>

            {/* Terminal log output */}
            <div className="mt-4 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 min-h-[140px] max-h-[180px] overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log, i) => (
                  <div key={i} className={log.includes('ALERT') ? 'text-rose-400 font-semibold' : ''}>
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic">
                  Awaiting experiment creation dispatch...
                </div>
              )}
            </div>
          </div>

          {createdExperiment && !isExecuting && (
            <div className="mt-4 pt-3 border-t border-slate-800 bg-slate-850 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Evaluation Run Finished Successfully
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Detected Change Point: <strong>Round 6</strong> | Overall Drift: <strong>0.67</strong>
              </p>
              <button
                onClick={() => onNavigate('dashboard')}
                className="mt-2.5 w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium transition-colors"
              >
                Inspect Results on Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
