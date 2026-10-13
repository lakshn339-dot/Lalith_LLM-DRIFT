/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId =
  | 'dashboard'
  | 'setup'
  | 'prompts'
  | 'drift'
  | 'subgroup'
  | 'safety'
  | 'fairness'
  | 'factuality'
  | 'changepoint'
  | 'history'
  | 'reports'
  | 'architecture';

export interface Experiment {
  id: string;
  name: string;
  model: string;
  modelVersion: string;
  rounds: number;
  createdAt: string;
  status: 'Completed' | 'Running' | 'Queued' | 'Failed';
  overallDriftScore: number;
  detectedChangePoint: string;
  subgroupsAffected: string;
  safetyDrift: number;
  fairnessDrift: number;
  factualityDrift: number;
  dataset: string;
  description?: string;
}

export interface RoundEvaluation {
  round: string; // R1 - R10
  roundNumber: number;
  driftScore: number;
  safetyViolationRate: number; // 0 - 25%
  unsafeResponseRate: number;
  refusalRate: number;
  fairnessDisparity: number; // 0.00 - 0.50
  demographicParityDiff: number;
  equalizedDiff: number;
  factualErrorRate: number; // 0 - 25%
  hallucinationRate: number;
  factualityScore: number;
  changePointProbability: number; // 0.0 - 1.0
  isChangePoint?: boolean;
  period: 'baseline' | 'change_point' | 'post_drift';
}

export interface SubgroupRoundData {
  round: string;
  groupA: number; // Gender / Identity
  groupB: number; // Sociolect & Dialect
  groupC: number; // Disability & Age (highest drift)
  groupD: number; // Cultural & Religious
  groupE: number; // ESL / Non-native English
}

export interface SubgroupSummary {
  id: string;
  name: string;
  category: string;
  baselineDisparity: number;
  postDriftDisparity: number;
  driftScore: number;
  percentageChange: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  sampleCount: number;
  description: string;
}

export interface PromptItem {
  id: string;
  category: 'Safety' | 'Fairness' | 'Factuality' | 'General Behavior';
  language: string;
  targetDimension: string;
  subgroup: string;
  version: string;
  status: 'Active' | 'Under Review' | 'Archived';
  promptText: string;
  expectedInvariant: string;
  updatedAt: string;
}

export interface DimensionMetric {
  dimension: 'Safety' | 'Fairness' | 'Factuality';
  currentValue: number;
  previousValue: number;
  percentageChange: number;
  unit: string;
  status: 'Alert' | 'Warning' | 'Stable';
  changePoint: string;
}

export interface ChangePointAnalysis {
  detectedRound: string;
  confidenceScore: number;
  method: string;
  pvalue: number;
  baselineRounds: string;
  postDriftRounds: string;
  attributionRanking: {
    dimension: string;
    contributionPercentage: number;
    subgroupDisproportion: string;
  }[];
}

export interface BackendStatus {
  connected: boolean;
  isMockMode: boolean;
  apiUrl: string;
  latencyMs: number;
  version: string;
}
