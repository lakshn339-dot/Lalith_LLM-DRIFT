/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  Shield,
  Scale,
  Sparkles,
} from 'lucide-react';
import { PromptItem } from '../types';
import { savePrompt, deletePrompt } from '../services/api';

interface PromptBankPageProps {
  prompts: PromptItem[];
  onRefresh: () => void;
}

export const PromptBankPage: React.FC<PromptBankPageProps> = ({ prompts, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePromptModal, setActivePromptModal] = useState<PromptItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editPromptData, setEditPromptData] = useState<Partial<PromptItem>>({});

  // Filter prompts
  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.promptText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.targetDimension.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditPromptData({
      id: `PRM-${Date.now().toString().slice(-4)}`,
      category: 'Safety',
      language: 'English (US)',
      targetDimension: 'Toxicity Invariant',
      subgroup: 'All',
      version: 'v1.0',
      status: 'Active',
      promptText: '',
      expectedInvariant: '',
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setActivePromptModal({} as PromptItem);
  };

  const handleOpenEdit = (p: PromptItem) => {
    setIsEditing(true);
    setEditPromptData({ ...p });
    setActivePromptModal(p);
  };

  const handleSave = async () => {
    if (!editPromptData.promptText || !editPromptData.id) return;
    await savePrompt(editPromptData as PromptItem);
    setActivePromptModal(null);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Delete prompt ${id} from invariant bank?`)) {
      await deletePrompt(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700">
                <BookOpen className="w-4 h-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">
                Evaluation Prompt &amp; Invariant Bank
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Curated benchmark prompts stratified across demographic subgroups and evaluation dimensions.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Evaluation Prompt
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search prompt ID, text, dimension..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          {['All', 'Safety', 'Fairness', 'Factuality', 'General Behavior'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold text-[11px]">
                <th className="py-3 px-4">Prompt ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Dimension</th>
                <th className="py-3 px-4">Subgroup</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPrompts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    {p.id}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.category === 'Safety'
                          ? 'bg-rose-100 text-rose-800'
                          : p.category === 'Fairness'
                          ? 'bg-amber-100 text-amber-800'
                          : p.category === 'Factuality'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {p.targetDimension}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {p.subgroup}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{p.language}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{p.version}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition-colors"
                        title="Edit prompt"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete prompt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Prompt Modal */}
      {activePromptModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                {isEditing ? `Edit Prompt ${editPromptData.id}` : 'Create Evaluation Prompt'}
              </h3>
              <button
                onClick={() => setActivePromptModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Category</label>
                <select
                  value={editPromptData.category}
                  onChange={(e) =>
                    setEditPromptData({
                      ...editPromptData,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Safety">Safety</option>
                  <option value="Fairness">Fairness</option>
                  <option value="Factuality">Factuality</option>
                  <option value="General Behavior">General Behavior</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Target Dimension</label>
                <input
                  type="text"
                  value={editPromptData.targetDimension || ''}
                  onChange={(e) =>
                    setEditPromptData({
                      ...editPromptData,
                      targetDimension: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-800"
                  placeholder="e.g. Jailbreak Invariant"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Subgroup</label>
                <input
                  type="text"
                  value={editPromptData.subgroup || ''}
                  onChange={(e) =>
                    setEditPromptData({
                      ...editPromptData,
                      subgroup: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-800"
                  placeholder="e.g. Group C (Disability)"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Language</label>
                <input
                  type="text"
                  value={editPromptData.language || ''}
                  onChange={(e) =>
                    setEditPromptData({
                      ...editPromptData,
                      language: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-800"
                  placeholder="e.g. English (US)"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Prompt Text Input <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={editPromptData.promptText || ''}
                onChange={(e) =>
                  setEditPromptData({
                    ...editPromptData,
                    promptText: e.target.value,
                  })
                }
                className="w-full p-2 border border-slate-200 rounded-lg text-slate-800 font-mono text-[11px]"
                placeholder="Enter exact benchmark prompt text..."
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Expected Invariant / Evaluation Grounding
              </label>
              <textarea
                rows={2}
                value={editPromptData.expectedInvariant || ''}
                onChange={(e) =>
                  setEditPromptData({
                    ...editPromptData,
                    expectedInvariant: e.target.value,
                  })
                }
                className="w-full p-2 border border-slate-200 rounded-lg text-slate-800 text-[11px]"
                placeholder="Formal condition, refusal boundary, or invariant expectation..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActivePromptModal(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editPromptData.promptText}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-xs"
              >
                Save Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
