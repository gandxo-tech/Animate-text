import React, { useState } from 'react';
import {
  Type,
  Layout,
  Palette,
  Sliders,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Wand2,
  Disc,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
} from 'lucide-react';
import { StudioSettings, FontFamilyId, CursorStyle, CopyTemplate } from '../types';
import { COLOR_THEMES, COPY_TEMPLATES } from '../data/copywritingBank';
import { ASPECT_RATIOS } from '../utils/canvasRenderer';
import { CopyAnalysis } from '../utils/textFormatter';

interface ControlsPanelProps {
  settings: StudioSettings;
  onChange: (updated: Partial<StudioSettings>) => void;
  analysis: CopyAnalysis;
  onAutoFixTypography: () => void;
  onOpenWizard: () => void;
  onOpenTemplates: () => void;
  onOpenRules: () => void;
  onSelectTemplate: (template: CopyTemplate) => void;
}

export function ControlsPanel({
  settings,
  onChange,
  analysis,
  onAutoFixTypography,
  onOpenWizard,
  onOpenTemplates,
  onOpenRules,
  onSelectTemplate,
}: ControlsPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'portfolio' | 'ecommerce' | 'quotes'>('all');

  const fontOptions: { id: FontFamilyId; label: string; sub: string }[] = [
    { id: 'Plus Jakarta Sans', label: 'Plus Jakarta', sub: 'Moderne & Pro' },
    { id: 'Bricolage Grotesque', label: 'Bricolage', sub: 'Dynamique' },
    { id: 'Playfair Display', label: 'Playfair', sub: 'Luxe & Élégant' },
    { id: 'Outfit', label: 'Outfit', sub: 'Minimaliste' },
    { id: 'Space Mono', label: 'Space Mono', sub: 'Machine à Écrire' },
  ];

  const speedOptions = [
    { label: 'Rapide (35ms)', value: 35 },
    { label: 'Normale (65ms)', value: 65 },
    { label: 'Détendue (100ms)', value: 100 },
    { label: 'Cinématographique (140ms)', value: 140 },
  ];

  const cursorOptions: { id: CursorStyle; label: string }[] = [
    { id: 'bar', label: 'Barre (|)' },
    { id: 'block', label: 'Bloc (█)' },
    { id: 'underscore', label: 'Tiret (_)' },
    { id: 'glow', label: 'Lueur (●)' },
  ];

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(settings.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleClearText = () => {
    onChange({ text: '' });
  };

  // Filter templates for quick access bar
  const displayedTemplates = COPY_TEMPLATES.filter(tmpl => {
    if (activeCategoryFilter === 'portfolio') return tmpl.category === 'Portfolio & Créateurs';
    if (activeCategoryFilter === 'ecommerce') return tmpl.category !== 'Portfolio & Créateurs' && tmpl.category !== 'Citations & Motivation';
    if (activeCategoryFilter === 'quotes') return tmpl.category === 'Citations & Motivation' || tmpl.category === 'Formation & Coaching';
    return true;
  });

  return (
    <div className="w-full h-full overflow-y-auto p-3 sm:p-5 md:p-6 space-y-5 text-sm text-neutral-300">
      {/* Beginner-friendly Onboarding Hint */}
      <div className="bg-[#12121a] border border-[#e8c98d]/25 rounded-xl p-3 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#e8c98d] shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-white">Créez votre vidéo en 3 étapes :</span>
          <p className="text-neutral-400 mt-0.5 text-[11px] leading-relaxed">
            1. Choisissez un modèle ou tapez votre texte · 2. Ajustez le format et la couleur · 3. Téléchargez la vidéo prête à poster !
          </p>
        </div>
      </div>

      {/* 1. Zone de Texte Principal */}
      <div className="space-y-2 bg-[#0e0e14] p-3 sm:p-4 rounded-xl border border-neutral-800/80">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#e8c98d]" />
            <span>1. Votre Message</span>
          </label>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={handleCopyText}
              title="Copier le texte"
              className="p-1 hover:text-white text-neutral-400 rounded transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleClearText}
              title="Effacer le texte"
              className="p-1 hover:text-red-400 text-neutral-400 rounded transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onAutoFixTypography}
              title="Ajouter automatiquement les espaces insécables avant : ; ! ? % et « »"
              className="px-2 py-0.5 bg-neutral-800 text-[#e8c98d] hover:bg-neutral-700 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <Wand2 className="w-3 h-3" />
              <span>Typo FR</span>
            </button>
          </div>
        </div>

        <textarea
          value={settings.text}
          onChange={e => onChange({ text: e.target.value })}
          rows={4}
          placeholder="Écrivez le message que vous voulez animer en vidéo…"
          className="w-full p-3 bg-[#151520] border border-neutral-800 rounded-lg text-white placeholder-neutral-500 text-sm leading-relaxed focus:outline-none focus:border-[#e8c98d] transition-colors resize-y font-sans"
        />

        <div className="flex items-center justify-between text-[11px] text-neutral-400 px-0.5">
          <span>
            {analysis.wordCount} mots · ~{analysis.readingTimeSec}s de vidéo
          </span>
          <button
            onClick={onOpenRules}
            className="text-[#e8c98d] hover:underline cursor-pointer"
          >
            Score d’impact : {analysis.score}/100
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-2 border-t border-neutral-800/60 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-400 font-medium">Modèles prêts à l’emploi :</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${activeCategoryFilter === 'all' ? 'text-[#e8c98d] font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                Tous
              </button>
              <button
                onClick={() => setActiveCategoryFilter('portfolio')}
                className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${activeCategoryFilter === 'portfolio' ? 'text-[#e8c98d] font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                Portfolios
              </button>
              <button
                onClick={() => setActiveCategoryFilter('ecommerce')}
                className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${activeCategoryFilter === 'ecommerce' ? 'text-[#e8c98d] font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                Vente
              </button>
              <button
                onClick={() => setActiveCategoryFilter('quotes')}
                className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${activeCategoryFilter === 'quotes' ? 'text-[#e8c98d] font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                Citations
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            {displayedTemplates.slice(0, 8).map(tmpl => {
              const isCurrent = settings.text === tmpl.hookText;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => onSelectTemplate(tmpl)}
                  title={tmpl.hookText}
                  className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-[#e8c98d] text-neutral-950 border-[#e8c98d] font-semibold shadow-sm'
                      : 'bg-[#14141e] text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  {tmpl.eventName}
                </button>
              );
            })}
            <button
              onClick={onOpenTemplates}
              className="px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap bg-neutral-800/80 text-[#e8c98d] border border-neutral-700 hover:bg-neutral-800 font-medium cursor-pointer"
            >
              + Plus de modèles
            </button>
          </div>
        </div>
      </div>

      {/* 2. Format & Réseau Social */}
      <div className="space-y-2 bg-[#0e0e14] p-3 sm:p-4 rounded-xl border border-neutral-800/80">
        <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-[#e8c98d]" />
          <span>2. Format & Réseaux Sociaux</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ASPECT_RATIOS.map(ratio => (
            <button
              key={ratio.id}
              onClick={() => onChange({ aspectRatio: ratio.id })}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                settings.aspectRatio === ratio.id
                  ? 'border-[#e8c98d] bg-[#e8c98d]/10 text-white font-semibold shadow-sm'
                  : 'border-neutral-800 bg-[#14141e] text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              <div className="text-xs font-bold">{ratio.label}</div>
              <div className="text-[10px] text-neutral-500 truncate mt-0.5">{ratio.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Ambiance & Couleurs */}
      <div className="space-y-2 bg-[#0e0e14] p-3 sm:p-4 rounded-xl border border-neutral-800/80">
        <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[#e8c98d]" />
          <span>3. Palette de Couleurs</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COLOR_THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => onChange({ themeId: theme.id })}
              className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                settings.themeId === theme.id
                  ? 'border-[#e8c98d] bg-[#e8c98d]/10 text-white font-semibold'
                  : 'border-neutral-800 bg-[#14141e] text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-black/40 shrink-0 shadow-sm"
                style={{ backgroundColor: theme.textColor }}
              />
              <span className="text-xs truncate">{theme.name.split('(')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Typographie & Taille */}
      <div className="space-y-3 bg-[#0e0e14] p-3 sm:p-4 rounded-xl border border-neutral-800/80">
        <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-[#e8c98d]" />
          <span>4. Style de Police & Taille</span>
        </label>

        {/* Polices */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {fontOptions.map(font => (
            <button
              key={font.id}
              onClick={() => onChange({ fontFamily: font.id })}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                settings.fontFamily === font.id
                  ? 'border-[#e8c98d] bg-[#e8c98d]/10 text-white'
                  : 'border-neutral-800 bg-[#14141e] text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="text-xs font-semibold truncate" style={{ fontFamily: font.id }}>
                {font.label}
              </div>
              <div className="text-[10px] text-neutral-500 truncate">{font.sub}</div>
            </button>
          ))}
        </div>

        {/* Taille du texte & Alignement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-400">Taille du texte</span>
              <span className="font-mono text-[#e8c98d]">{settings.fontSize}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="76"
              value={settings.fontSize}
              onChange={e => onChange({ fontSize: parseInt(e.target.value) })}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#e8c98d]"
            />
          </div>

          <div>
            <span className="block text-xs text-neutral-400 mb-1">Alignement</span>
            <div className="flex items-center gap-1 bg-[#14141e] p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => onChange({ textAlign: 'left' })}
                className={`flex-1 py-1 rounded text-xs flex items-center justify-center transition-colors cursor-pointer ${
                  settings.textAlign === 'left' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChange({ textAlign: 'center' })}
                className={`flex-1 py-1 rounded text-xs flex items-center justify-center transition-colors cursor-pointer ${
                  settings.textAlign === 'center' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChange({ textAlign: 'right' })}
                className={`flex-1 py-1 rounded text-xs flex items-center justify-center transition-colors cursor-pointer ${
                  settings.textAlign === 'right' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accordéon Réglages Avancés (Vitesse, Halo, Signature) */}
      <div className="bg-[#0e0e14] rounded-xl border border-neutral-800/80 overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-3.5 flex items-center justify-between text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-[#e8c98d]" />
            <span>Options Avancées (Vitesse, Halo, Signature…)</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="p-3 sm:p-4 border-t border-neutral-800/80 space-y-4 text-xs">
            {/* Vitesse */}
            <div>
              <span className="block text-neutral-400 mb-1.5 font-medium">Vitesse d’écriture</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {speedOptions.map(s => (
                  <button
                    key={s.value}
                    onClick={() => onChange({ typingSpeed: s.value })}
                    className={`p-2 rounded-lg border text-[11px] transition-all cursor-pointer ${
                      settings.typingSpeed === s.value
                        ? 'border-[#e8c98d] bg-[#e8c98d]/10 text-white font-semibold'
                        : 'border-neutral-800 bg-[#14141e] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {s.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Curseur */}
            <div>
              <span className="block text-neutral-400 mb-1.5 font-medium">Style du curseur</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {cursorOptions.map(c => (
                  <button
                    key={c.id}
                    onClick={() => onChange({ cursorStyle: c.id })}
                    className={`p-1.5 rounded-lg border text-[11px] transition-all cursor-pointer text-center ${
                      settings.cursorStyle === c.id
                        ? 'border-[#e8c98d] bg-[#e8c98d]/10 text-white font-semibold'
                        : 'border-neutral-800 bg-[#14141e] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Halo Lumineux */}
            <div className="space-y-2 pt-2 border-t border-neutral-800/60">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 font-medium">Lueur & Halo lumineux</span>
                <span className="font-mono text-[#e8c98d]">{settings.haloIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.haloIntensity}
                onChange={e => onChange({ haloIntensity: parseInt(e.target.value) })}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#e8c98d]"
              />
            </div>

            {/* Signature & Watermark */}
            <div className="space-y-2 pt-2 border-t border-neutral-800/60">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  En-tête supérieur (ex. PORTFOLIO 2026, OFFRE SPÉCIALE)
                </label>
                <input
                  type="text"
                  value={settings.headerTag}
                  onChange={e => onChange({ headerTag: e.target.value })}
                  placeholder="Ex. PORTFOLIO 2026 · GANDXO"
                  className="w-full px-3 py-2 bg-[#14141e] border border-neutral-800 rounded-lg text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#e8c98d]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Signature inférieure (ex. GANDXO · JUST CODE IT, @mon_compte)
                </label>
                <input
                  type="text"
                  value={settings.footerSignature}
                  onChange={e => onChange({ footerSignature: e.target.value })}
                  placeholder="Ex. GANDXO · JUST CODE IT"
                  className="w-full px-3 py-2 bg-[#14141e] border border-neutral-800 rounded-lg text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#e8c98d]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
