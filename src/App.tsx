/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId, Experiment, BackendStatus } from './types';
import {
  CURRENT_EXPERIMENT,
  ROUND_EVALUATIONS,
  SUBGROUP_ROUNDS_DATA,
  SUBGROUP_SUMMARIES,
  PROMPTS_BANK,
  EXPERIMENTS_HISTORY,
  CHANGE_POINT_ANALYSIS,
} from './data/mockData';
import {
  checkBackendHealth,
  setMockFallback,
  isMockFallbackActive,
  getExperiments,
  getDriftResults,
  getSubgroupResults,
  getPromptBank,
} from './services/api';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SettingsModal } from './components/common/SettingsModal';
import { LoadingState } from './components/common/LoadingState';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ExperimentSetupPage } from './pages/ExperimentSetupPage';
import { PromptBankPage } from './pages/PromptBankPage';
import { DriftAnalysisPage } from './pages/DriftAnalysisPage';
import { SubgroupAnalysisPage } from './pages/SubgroupAnalysisPage';
import { SafetyAnalysisPage } from './pages/SafetyAnalysisPage';
import { FairnessAnalysisPage } from './pages/FairnessAnalysisPage';
import { FactualityAnalysisPage } from './pages/FactualityAnalysisPage';
import { ChangePointPage } from './pages/ChangePointPage';
import { ExperimentHistoryPage } from './pages/ExperimentHistoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [currentExperiment, setCurrentExperiment] = useState<Experiment>(CURRENT_EXPERIMENT);
  const [experiments, setExperiments] = useState<Experiment[]>(EXPERIMENTS_HISTORY);
  const [prompts, setPrompts] = useState(PROMPTS_BANK);
  const [isMockMode, setIsMockMode] = useState<boolean>(true);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    connected: false,
    isMockMode: true,
    apiUrl: 'http://localhost:8000',
    latencyMs: 0,
    version: 'Demo Mode',
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initial health probe
  const refreshBackend = async () => {
    const status = await checkBackendHealth();
    setBackendStatus(status);
    setIsMockMode(!status.connected);
  };

  useEffect(() => {
    refreshBackend();
  }, []);

  const handleToggleMockMode = () => {
    const nextMode = !isMockMode;
    setIsMockMode(nextMode);
    setMockFallback(nextMode);
  };

  const handleExperimentCreated = (newExp: Experiment) => {
    setCurrentExperiment(newExp);
    setExperiments((prev) => [newExp, ...prev]);
  };

  const handleSelectExperiment = (exp: Experiment) => {
    setCurrentExperiment(exp);
  };

  const refreshPrompts = async () => {
    const res = await getPromptBank();
    if (res.data) {
      setPrompts(res.data);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        isBackendConnected={backendStatus.connected}
        isMockMode={isMockMode}
        onToggleMockMode={handleToggleMockMode}
        activeExperimentName={currentExperiment.name}
      />

      {/* Main Viewport Stage */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          currentExperiment={currentExperiment}
          isBackendConnected={backendStatus.connected}
          isMockMode={isMockMode}
          onToggleMockMode={handleToggleMockMode}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Scrollable Content Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="max-w-7xl mx-auto pb-12">
            {isLoading ? (
              <LoadingState />
            ) : (
              <>
                {currentPage === 'dashboard' && (
                  <DashboardPage
                    experiment={currentExperiment}
                    roundEvaluations={ROUND_EVALUATIONS}
                    subgroupSummaries={SUBGROUP_SUMMARIES}
                    onNavigate={setCurrentPage}
                  />
                )}

                {currentPage === 'setup' && (
                  <ExperimentSetupPage
                    onExperimentCreated={handleExperimentCreated}
                    onNavigate={setCurrentPage}
                  />
                )}

                {currentPage === 'prompts' && (
                  <PromptBankPage
                    prompts={prompts}
                    onRefresh={refreshPrompts}
                  />
                )}

                {currentPage === 'drift' && (
                  <DriftAnalysisPage
                    roundEvaluations={ROUND_EVALUATIONS}
                    experiment={currentExperiment}
                  />
                )}

                {currentPage === 'subgroup' && (
                  <SubgroupAnalysisPage
                    subgroupRounds={SUBGROUP_ROUNDS_DATA}
                    subgroupSummaries={SUBGROUP_SUMMARIES}
                  />
                )}

                {currentPage === 'safety' && (
                  <SafetyAnalysisPage
                    roundEvaluations={ROUND_EVALUATIONS}
                  />
                )}

                {currentPage === 'fairness' && (
                  <FairnessAnalysisPage
                    roundEvaluations={ROUND_EVALUATIONS}
                    subgroupSummaries={SUBGROUP_SUMMARIES}
                  />
                )}

                {currentPage === 'factuality' && (
                  <FactualityAnalysisPage
                    roundEvaluations={ROUND_EVALUATIONS}
                  />
                )}

                {currentPage === 'changepoint' && (
                  <ChangePointPage
                    roundEvaluations={ROUND_EVALUATIONS}
                    changePointAnalysis={CHANGE_POINT_ANALYSIS}
                    isMockMode={isMockMode}
                  />
                )}

                {currentPage === 'history' && (
                  <ExperimentHistoryPage
                    experiments={experiments}
                    activeExperimentId={currentExperiment.id}
                    onSelectExperiment={handleSelectExperiment}
                    onNavigate={setCurrentPage}
                  />
                )}

                {currentPage === 'reports' && (
                  <ReportsPage
                    experiment={currentExperiment}
                    roundEvaluations={ROUND_EVALUATIONS}
                    subgroupSummaries={SUBGROUP_SUMMARIES}
                    changePointAnalysis={CHANGE_POINT_ANALYSIS}
                    isMockMode={isMockMode}
                  />
                )}

                {currentPage === 'architecture' && (
                  <ArchitecturePage />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isMockMode={isMockMode}
        onToggleMockMode={handleToggleMockMode}
        backendStatus={backendStatus}
        onRefreshBackendStatus={refreshBackend}
      />
    </div>
  );
}
