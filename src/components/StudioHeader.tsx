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
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-neutral-800/80 bg-[#08080b]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a href="/" className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-[#e8c98d] rounded-sm transform rotate-45 inline-block"></span>
        <span className="font-['Bricolage_Grotesque',sans-serif]">GANDXO TYPE STUDIO</span>
      </a>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
        <button
          onClick={onOpenTemplates}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left"
        >
          <BookOpen className="w-4 h-4 text-[#e8c98d]" />
          <span>Banque de Formules</span>
        </button>
        <button
          onClick={onOpenWizard}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left"
        >
          <Sparkles className="w-4 h-4 text-[#e8c98d]" />
          <span>Formule 10 Min</span>
        </button>
        <button
          onClick={onOpenRules}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left"
        >
          <HelpCircle className="w-4 h-4 text-[#e8c98d]" />
          <span>7 Règles d’Écriture</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onExportClick}
          disabled={isExporting}
          className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-[#e8c98d] hover:bg-[#d8b97d] transition-all rounded-lg whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(232,201,141,0.25)] disabled:opacity-50"
        >
          <Video className="w-3.5 h-3.5" />
          <span>{isExporting ? 'Génération en cours…' : 'Exporter la Vidéo'}</span>
        </button>
      </div>
    </header>
  );
}
