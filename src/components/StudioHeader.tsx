import React from 'react';
import { Sparkles, Video, BookOpen, HelpCircle } from 'lucide-react';

interface StudioHeaderProps {
  onOpenWizard: () => void;
  onOpenTemplates: () => void;
  onOpenRules: () => void;
  onExportClick: () => void;
  isExporting: boolean;
}

export function StudioHeader({
  onOpenWizard,
  onOpenTemplates,
  onOpenRules,
  onExportClick,
  isExporting,
}: StudioHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 sm:gap-8 px-3 sm:px-6 py-3 sm:py-4 border-b border-neutral-800/80 bg-[#08080b]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Brand Wordmark */}
      <a href="/" className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-[#e8c98d] rounded-sm transform rotate-45 inline-block"></span>
        <span className="font-['Bricolage_Grotesque',sans-serif]">GANDXO STUDIO</span>
      </a>

      {/* Zone 2: Desktop Nav Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
        <button
          onClick={onOpenTemplates}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left"
        >
          <BookOpen className="w-4 h-4 text-[#e8c98d]" />
          <span>Banque de Modèles</span>
        </button>
        <button
          onClick={onOpenWizard}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left"
        >
          <Sparkles className="w-4 h-4 text-[#e8c98d]" />
          <span>Formule 5 Questions</span>
        </button>
        <button
          onClick={onOpenRules}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left"
        >
          <HelpCircle className="w-4 h-4 text-[#e8c98d]" />
          <span>7 Règles d’Or</span>
        </button>
      </nav>

      {/* Zone 3: Actions (Mobile Quick Icons + Export Button) */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Mobile Fast Modals Shortcuts */}
        <div className="flex md:hidden items-center gap-1 text-neutral-300">
          <button
            onClick={onOpenTemplates}
            title="Banque de Modèles"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#e8c98d]" />
          </button>
          <button
            onClick={onOpenWizard}
            title="Formule 5 Questions"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#e8c98d]" />
          </button>
        </div>

        {/* Primary Export CTA */}
        <button
          onClick={onExportClick}
          disabled={isExporting}
          className="px-3 sm:px-4 py-2 text-xs font-semibold text-neutral-950 bg-[#e8c98d] hover:bg-[#d8b97d] transition-all rounded-lg whitespace-nowrap shrink-0 flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(232,201,141,0.25)] disabled:opacity-50"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">{isExporting ? 'Génération…' : 'Exporter la Vidéo'}</span>
          <span className="xs:hidden">{isExporting ? '…' : 'Exporter'}</span>
        </button>
      </div>
    </header>
  );
}
