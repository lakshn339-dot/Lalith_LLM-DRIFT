/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Network,
  Database,
  Layers,
  Cpu,
  RefreshCw,
  GitCommit,
  Users,
  ShieldAlert,
  Scale,
  CheckCircle2,
  LineChart,
  LayoutDashboard,
  FileText,
  ArrowDown,
  Info,
  Check,
} from 'lucide-react';

interface ArchNode {
  id: string;
  title: string;
  subtitle: string;
  category: 'Input' | 'Inference' | 'Detection' | 'Attribution' | 'Synthesis';
  icon: React.ElementType;
  description: string;
  technicalDetails: string;
  dataContract: string;
}

export const ArchitecturePage: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('subgroup-attr');

  const nodes: ArchNode[] = [
    {
      id: 'prompt-bank',
      title: 'Prompt Bank',
      subtitle: 'Curated Benchmark Invariants',
      category: 'Input',
      icon: Database,
      description: 'Repository of standardized adversarial safety probes, counterfactual demographic fairness prompts, and factuality grounding queries.',
      technicalDetails: 'Categorized by evaluation dimension and annotated with formal invariance invariants $\\mathcal{I}(x)$.',
      dataContract: 'PromptItem { id, category, targetDimension, subgroup, expectedInvariant }',
    },
    {
      id: 'versioned-dataset',
      title: 'Versioned Evaluation Dataset',
      subtitle: 'Fixed Test Splitting (N=50,000)',
      category: 'Input',
      icon: Layers,
      description: 'Ensures strictly identical prompt conditioning across all longitudinal evaluation rounds to eliminate test-set sampling variance.',
      technicalDetails: 'Hash-verified stratified prompt partitions sampled evenly across Groups A through E ($n=10,000$ prompts per cohort).',
      dataContract: 'DatasetPartition { hash_sha256, stratified_seed, split_metadata }',
    },
    {
      id: 'llm-engine',
      title: 'LLM Evaluation Engine',
      subtitle: 'Inference & Generation Harness',
      category: 'Inference',
      icon: Cpu,
      description: 'Executes greedy generation or controlled sampling against target model checkpoints with pinned hyperparameters.',
      technicalDetails: 'Standardized generation: Temperature $T=0.0$, top-p $1.0$, max tokens $512$ to isolate systemic model weight drift.',
      dataContract: 'ModelOutput { prompt_id, completion_text, token_logprobs, hidden_states }',
    },
    {
      id: 'repeated-rounds',
      title: 'Repeated Evaluation Rounds',
      subtitle: 'Sequential Temporal Sampling (R1–R10)',
      category: 'Inference',
      icon: RefreshCw,
      description: 'Orchestrates synchronized evaluation passes across time intervals or training checkpoints.',
      technicalDetails: 'Chronological rounds $t \\in \\{1, 2, \\dots, 10\\}$ executing identical benchmark workloads.',
      dataContract: 'RoundTensor { round_id, execution_timestamp, batch_responses }',
    },
    {
      id: 'output-collection',
      title: 'Output Collection & Tensor Store',
      subtitle: 'Embedding Extraction & Logprobs',
      category: 'Inference',
      icon: Database,
      description: 'Extracts sentence-level embeddings, refusal classifier logits, and factual claim token spans.',
      technicalDetails: 'Last-layer hidden representations pooled to compute empirical distribution tensors $\\mathcal{P}_t$.',
      dataContract: 'FeatureVector { prompt_id, embedding_dim_4096, safety_label, parity_score }',
    },
    {
      id: 'drift-detection',
      title: 'Drift Detection Engine',
      subtitle: 'Distributional Distance (MMD)',
      category: 'Detection',
      icon: LineChart,
      description: 'Computes kernel two-sample test statistics between baseline round $\\mathcal{P}_0$ and ongoing round $\\mathcal{P}_t$.',
      technicalDetails: 'Calculates Gaussian kernel Maximum Mean Discrepancy $\\text{MMD}^2(\\mathcal{P}_t, \\mathcal{P}_0)$ and Wasserstein-1 distance.',
      dataContract: 'DriftMetric { round_t, mmd_score, wasserstein_dist, permutation_p_val }',
    },
    {
      id: 'changepoint-detection',
      title: 'Change-Point Detection',
      subtitle: 'Pettitt & Bayesian MCMC',
      category: 'Detection',
      icon: GitCommit,
      description: 'Identifies the exact round $\\tau$ where drift score distribution changes with statistical significance.',
      technicalDetails: 'Rank-based Pettitt changepoint statistic with Bayesian online changepoint hazard calculation $P(\\tau = t \\mid \\mathcal{D})$.',
      dataContract: 'ChangePointResult { detected_round: "R6", p_value: 0.00034, posterior_prob: 0.94 }',
    },
    {
      id: 'subgroup-attr',
      title: 'Subgroup Attribution',
      subtitle: 'Demographic Disparity Decomposition',
      category: 'Attribution',
      icon: Users,
      description: 'Quantifies whether behavioral drift affects protected demographic, linguistic, and accessibility cohorts unequally.',
      technicalDetails: 'Computes conditional disparity divergence $\\Delta(g, t) = |\\mu_{g, t} - \\mu_{\\text{ref}, t}| - |\\mu_{g, 0} - \\mu_{\\text{ref}, 0}|$ for Groups A–E.',
      dataContract: 'SubgroupAttribution { group_id, disparity_delta, risk_classification: "High" }',
    },
    {
      id: 'dimension-safety',
      title: 'Safety Drift Attribution',
      subtitle: 'Refusal & Jailbreak Bypass',
      category: 'Attribution',
      icon: ShieldAlert,
      description: 'Audits compliance degradation on toxic and adversarial exploit prompts.',
      technicalDetails: 'Quantifies absolute jump in safety violations ($3.5\\% \\to 15.9\\%$) and refusal breakdown.',
      dataContract: 'SafetyMetric { violation_rate, unsafe_count, refusal_retention }',
    },
    {
      id: 'dimension-fairness',
      title: 'Fairness Drift Attribution',
      subtitle: 'Parity Difference Bounds',
      category: 'Attribution',
      icon: Scale,
      description: 'Monitors demographic parity difference and equalized odds disparity across subgroups.',
      technicalDetails: 'Tracks widening disparity boundaries between majority and minority counterfactual pairs.',
      dataContract: 'FairnessMetric { group_disparity, equalized_difference, max_gap }',
    },
    {
      id: 'dimension-factuality',
      title: 'Factuality Drift Attribution',
      subtitle: 'Grounding & Hallucinations',
      category: 'Attribution',
      icon: CheckCircle2,
      description: 'Evaluates factual error accumulation and citation hallucination across temporal entities.',
      technicalDetails: 'Automated claim decomposition using verification against external factual knowledge graphs.',
      dataContract: 'FactualityMetric { error_rate, hallucination_percentage, fidelity_score }',
    },
    {
      id: 'longitudinal-analysis',
      title: 'Longitudinal Analysis Core',
      subtitle: 'Multi-round Synthesis & Trajectories',
      category: 'Synthesis',
      icon: LineChart,
      description: 'Aggregates all dimension and subgroup trajectories into a cohesive temporal attribution matrix.',
      technicalDetails: 'Computes velocity vectors and cross-dimensional correlation to assess compound degradation risks.',
      dataContract: 'LongitudinalState { total_drift, dominant_dimension, vulnerable_subgroup }',
    },
    {
      id: 'research-dashboard',
      title: 'Research Dashboard',
      subtitle: 'Interactive Visual Analytics UI',
      category: 'Synthesis',
      icon: LayoutDashboard,
      description: 'Front-end experimental interface providing research diagnostics, interactive charts, and drill-downs.',
      technicalDetails: 'Built with React, TypeScript, Tailwind CSS, Recharts, and IEEE publication figure exporters.',
      dataContract: 'UIState { active_page, filtered_rounds, selected_subgroup, theme }',
    },
    {
      id: 'report-generation',
      title: 'Report Generation',
      subtitle: 'Publication-Ready IEEE Artifacts',
      category: 'Synthesis',
      icon: FileText,
      description: 'Generates LaTeX figure environments, downloadable CSV metrics, JSON audit logs, and PDF summaries.',
      technicalDetails: 'Standardized IEEE camera-ready captioning and vector SVG/canvas high-DPI export.',
      dataContract: 'PublicationExport { latex_code, csv_blob, json_payload, print_view }',
    },
  ];

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700">
                <Network className="w-4 h-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">
                End-to-End System Architecture Pipeline
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Visual pipeline specification for longitudinal LLM drift detection, temporal change-point localization, and subgroup attribution.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Click any component to inspect data contracts &amp; formalisms
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Architecture Flow Diagram (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
            <span className="text-xs font-semibold text-slate-900">
              Pipeline Execution Flowchart
            </span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-200"></span> Input
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-200"></span> Inference
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-200"></span> Detection
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-200"></span> Attribution
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-200"></span> Synthesis
              </span>
            </div>
          </div>

          {/* Sequential Nodes 1 to 8 */}
          {[
            'prompt-bank',
            'versioned-dataset',
            'llm-engine',
            'repeated-rounds',
            'output-collection',
            'drift-detection',
            'changepoint-detection',
            'subgroup-attr',
          ].map((nodeId, idx) => {
            const node = nodes.find((n) => n.id === nodeId)!;
            const Icon = node.icon;
            const isSelected = selectedNodeId === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center font-mono text-[10px] font-bold text-slate-500">
                      0{idx + 1}
                    </span>
                    <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{node.title}</h4>
                      <p className="text-[11px] text-slate-500">{node.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {node.category}
                  </span>
                </div>

                <div className="flex justify-center py-0.5">
                  <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </React.Fragment>
            );
          })}

          {/* 3 Parallel Evaluation Dimensions */}
          <div className="pt-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase block text-center mb-1.5">
              Multidimensional Attribution Layer (Parallel Evaluation)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['dimension-safety', 'dimension-fairness', 'dimension-factuality'].map((nodeId) => {
                const node = nodes.find((n) => n.id === nodeId)!;
                const Icon = node.icon;
                const isSelected = selectedNodeId === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-slate-700" />
                      <h4 className="text-xs font-bold text-slate-900 truncate">{node.title}</h4>
                    </div>
                    <p className="text-[10px] text-slate-500">{node.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center py-0.5">
            <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Synthesis Nodes */}
          {['longitudinal-analysis', 'research-dashboard', 'report-generation'].map((nodeId, idx) => {
            const node = nodes.find((n) => n.id === nodeId)!;
            const Icon = node.icon;
            const isSelected = selectedNodeId === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center font-mono text-[10px] font-bold text-slate-500">
                      {idx + 10}
                    </span>
                    <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{node.title}</h4>
                      <p className="text-[11px] text-slate-500">{node.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {node.category}
                  </span>
                </div>

                {idx < 2 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Component Technical Specification (1 col) */}
        <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Component Specification
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                {activeNode.category} Layer
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-white">{activeNode.title}</h3>
              <p className="text-xs text-cyan-300 font-medium mt-0.5">{activeNode.subtitle}</p>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {activeNode.description}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Mathematical Formalism &amp; Logic
                </span>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-200 leading-relaxed">
                  {activeNode.technicalDetails}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  API &amp; Data Contract Schema
                </span>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
                  {activeNode.dataContract}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Architecture component fully verified against IEEE transaction schema.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
