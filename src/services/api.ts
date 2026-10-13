/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Experiment,
  RoundEvaluation,
  SubgroupRoundData,
  SubgroupSummary,
  PromptItem,
  ChangePointAnalysis,
  BackendStatus,
} from '../types';
import {
  CURRENT_EXPERIMENT,
  ROUND_EVALUATIONS,
  SUBGROUP_ROUNDS_DATA,
  SUBGROUP_SUMMARIES,
  PROMPTS_BANK,
  EXPERIMENTS_HISTORY,
  CHANGE_POINT_ANALYSIS,
} from '../data/mockData';

// Centralized API configuration from environment or default
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000';

let mockFallbackEnabled = true;

export const setMockFallback = (enabled: boolean) => {
  mockFallbackEnabled = enabled;
};

export const isMockFallbackActive = () => mockFallbackEnabled;

export interface ApiResponse<T> {
  data: T;
  isMock: boolean;
  status: number;
  message?: string;
}

/**
 * Robust fetch wrapper with timeout, fallback, and status checking
 */
async function fetchWithFallback<T>(
  endpoint: string,
  options?: RequestInit,
  mockDataGenerator?: () => T
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return {
      data: json,
      isMock: false,
      status: response.status,
    };
  } catch (error) {
    if (mockFallbackEnabled && mockDataGenerator) {
      // Simulate slight network settling latency for realism
      await new Promise((resolve) => setTimeout(resolve, 150));
      return {
        data: mockDataGenerator(),
        isMock: true,
        status: 200,
        message: 'Backend connection unavailable — loaded illustrative research demo data',
      };
    }
    throw error;
  }
}

// -------------------------------------------------------------
// Required API Methods
// -------------------------------------------------------------

export async function checkBackendHealth(): Promise<BackendStatus> {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    const elapsed = Math.round(performance.now() - start);

    if (res.ok) {
      return {
        connected: true,
        isMockMode: false,
        apiUrl: API_BASE_URL,
        latencyMs: elapsed,
        version: 'v1.4.2-py',
      };
    }
  } catch {
    // Expected when running in frontend sandbox without python service running on 8000
  }

  return {
    connected: false,
    isMockMode: true,
    apiUrl: API_BASE_URL,
    latencyMs: 0,
    version: 'Demo / Illustrative',
  };
}

export async function getExperiments(): Promise<ApiResponse<Experiment[]>> {
  return fetchWithFallback<Experiment[]>(
    '/api/v1/experiments',
    { method: 'GET' },
    () => [...EXPERIMENTS_HISTORY]
  );
}

export async function getExperiment(id: string): Promise<ApiResponse<Experiment>> {
  return fetchWithFallback<Experiment>(
    `/api/v1/experiments/${id}`,
    { method: 'GET' },
    () => {
      const found = EXPERIMENTS_HISTORY.find((e) => e.id === id);
      return found || CURRENT_EXPERIMENT;
    }
  );
}

export async function createExperiment(payload: Partial<Experiment>): Promise<ApiResponse<Experiment>> {
  return fetchWithFallback<Experiment>(
    '/api/v1/experiments',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    () => {
      const newExp: Experiment = {
        id: `EXP-${Date.now().toString().slice(-6)}`,
        name: payload.name || 'Custom Longitudinal Evaluation',
        model: payload.model || 'LLM Model v1.0',
        modelVersion: payload.modelVersion || 'v1.0.4',
        rounds: payload.rounds || 10,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
        status: 'Completed',
        overallDriftScore: 0.65,
        detectedChangePoint: 'Round 6',
        subgroupsAffected: '3 / 5',
        safetyDrift: 11.8,
        fairnessDrift: 8.3,
        factualityDrift: 9.9,
        dataset: payload.dataset || 'Custom Evaluator Suite',
        description: payload.description,
      };
      EXPERIMENTS_HISTORY.unshift(newExp);
      return newExp;
    }
  );
}

export async function runEvaluation(experimentId: string): Promise<ApiResponse<{ status: string; roundsCompleted: number }>> {
  return fetchWithFallback(
    `/api/v1/experiments/${experimentId}/evaluate`,
    { method: 'POST' },
    () => ({
      status: 'Completed',
      roundsCompleted: 10,
    })
  );
}

export async function getDriftResults(experimentId?: string): Promise<ApiResponse<RoundEvaluation[]>> {
  return fetchWithFallback<RoundEvaluation[]>(
    `/api/v1/experiments/${experimentId || CURRENT_EXPERIMENT.id}/drift`,
    { method: 'GET' },
    () => [...ROUND_EVALUATIONS]
  );
}

export async function getSubgroupResults(experimentId?: string): Promise<
  ApiResponse<{
    rounds: SubgroupRoundData[];
    summaries: SubgroupSummary[];
  }>
> {
  return fetchWithFallback(
    `/api/v1/experiments/${experimentId || CURRENT_EXPERIMENT.id}/subgroups`,
    { method: 'GET' },
    () => ({
      rounds: [...SUBGROUP_ROUNDS_DATA],
      summaries: [...SUBGROUP_SUMMARIES],
    })
  );
}

export async function getSafetyResults(experimentId?: string): Promise<
  ApiResponse<{
    rounds: RoundEvaluation[];
    beforeDriftViolation: number;
    afterDriftViolation: number;
    absoluteChange: number;
    relativeChange: number;
  }>
> {
  return fetchWithFallback(
    `/api/v1/experiments/${experimentId || CURRENT_EXPERIMENT.id}/safety`,
    { method: 'GET' },
    () => ({
      rounds: [...ROUND_EVALUATIONS],
      beforeDriftViolation: 3.5,
      afterDriftViolation: 15.9,
      absoluteChange: 12.4,
      relativeChange: 354.2,
    })
  );
}

export async function getFairnessResults(experimentId?: string): Promise<
  ApiResponse<{
    rounds: RoundEvaluation[];
    subgroups: SubgroupSummary[];
  }>
> {
  return fetchWithFallback(
    `/api/v1/experiments/${experimentId || CURRENT_EXPERIMENT.id}/fairness`,
    { method: 'GET' },
    () => ({
      rounds: [...ROUND_EVALUATIONS],
      subgroups: [...SUBGROUP_SUMMARIES],
    })
  );
}

export async function getFactualityResults(experimentId?: string): Promise<
  ApiResponse<{
    rounds: RoundEvaluation[];
    beforeDriftError: number;
    afterDriftError: number;
    absoluteChange: number;
    relativeChange: number;
  }>
> {
  return fetchWithFallback(
    `/api/v1/experiments/${experimentId || CURRENT_EXPERIMENT.id}/factuality`,
    { method: 'GET' },
    () => ({
      rounds: [...ROUND_EVALUATIONS],
      beforeDriftError: 4.6,
      afterDriftError: 16.0,
      absoluteChange: 11.4,
      relativeChange: 247.8,
    })
  );
}

export async function getChangePoints(experimentId?: string): Promise<ApiResponse<ChangePointAnalysis>> {
  return fetchWithFallback<ChangePointAnalysis>(
    `/api/v1/experiments/${experimentId || CURRENT_EXPERIMENT.id}/change-points`,
    { method: 'GET' },
    () => ({ ...CHANGE_POINT_ANALYSIS })
  );
}

export async function getPromptBank(): Promise<ApiResponse<PromptItem[]>> {
  return fetchWithFallback<PromptItem[]>(
    '/api/v1/prompts',
    { method: 'GET' },
    () => [...PROMPTS_BANK]
  );
}

export async function savePrompt(prompt: PromptItem): Promise<ApiResponse<PromptItem>> {
  return fetchWithFallback<PromptItem>(
    '/api/v1/prompts',
    {
      method: 'POST',
      body: JSON.stringify(prompt),
    },
    () => {
      const idx = PROMPTS_BANK.findIndex((p) => p.id === prompt.id);
      if (idx >= 0) {
        PROMPTS_BANK[idx] = prompt;
      } else {
        PROMPTS_BANK.unshift(prompt);
      }
      return prompt;
    }
  );
}

export async function deletePrompt(id: string): Promise<ApiResponse<{ success: boolean }>> {
  return fetchWithFallback(
    `/api/v1/prompts/${id}`,
    { method: 'DELETE' },
    () => {
      const idx = PROMPTS_BANK.findIndex((p) => p.id === id);
      if (idx >= 0) {
        PROMPTS_BANK.splice(idx, 1);
      }
      return { success: true };
    }
  );
}
