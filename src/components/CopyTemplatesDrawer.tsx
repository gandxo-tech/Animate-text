import React, { useState } from 'react';
import { X, Check, Tag, MapPin, Zap } from 'lucide-react';
import { COPY_TEMPLATES } from '../data/copywritingBank';
import { CopyTemplate } from '../types';

interface CopyTemplatesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CopyTemplate) => void;
}

export function CopyTemplatesDrawer({
  isOpen,
  onClose,
  onSelectTemplate,
}: CopyTemplatesDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(COPY_TEMPLATES.map(t => t.category)))];

  const filteredTemplates = selectedCategory === 'all'
    ? COPY_TEMPLATES
    : COPY_TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#101015] border border-neutral-800 rounded-xl sm:rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-[#101015] gap-3">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#e8c98d]" />
              <span>Banque de Modèles & Formules</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 sm:mt-1">
              Des accroches prêtes à l'emploi pour vos portfolios, promos WhatsApp, boutiques et vidéos TikTok / Reels.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category selector */}
        <div className="px-3 sm:px-6 py-2.5 border-b border-neutral-800/80 bg-[#14141c] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#e8c98d] text-neutral-950 font-semibold shadow-sm'
                  : 'bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat === 'all' ? 'Tous les modèles' : cat}
            </button>
          ))}
        </div>

        {/* Template List */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 flex-1">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="bg-[#14141e] border border-neutral-800/90 hover:border-[#e8c98d]/50 rounded-xl p-3.5 sm:p-5 transition-all group flex flex-col justify-between gap-3 sm:gap-4"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-400">
                    <span className="text-[#e8c98d] font-semibold">{template.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{template.eventName}</span>
                    {template.pricingExample && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-emerald-400">{template.pricingExample}</span>
                      </>
                    )}
                  </div>
                  {template.localContext && (
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#e8c98d]" />
                      <span>{template.localContext}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-[#e8c98d] transition-colors mb-2">
                  {template.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed bg-[#0c0c10] p-3 rounded-lg border border-neutral-800/60 font-sans">
                  « {template.hookText} »
                </p>

                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-400">
                  <Tag className="w-3 h-3 text-[#e8c98d] shrink-0" />
                  <span>{template.ruleApplied}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1.5 border-t border-neutral-800/50">
                <button
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-950 bg-[#e8c98d] hover:bg-[#d8b97d] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Utiliser ce Modèle</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
