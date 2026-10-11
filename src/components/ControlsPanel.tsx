import React from 'react';
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
  Check,
  Disc,
} from 'lucide-react';
import { StudioSettings, FontFamilyId, CursorStyle } from '../types';
import { COLOR_THEMES } from '../data/copywritingBank';
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
}

export function ControlsPanel({
  settings,
  onChange,
  analysis,
  onAutoFixTypography,
  onOpenWizard,
  onOpenTemplates,
  onOpenRules,
}: ControlsPanelProps) {
  const fontOptions: { id: FontFamilyId; label: string; sub: string }[] = [
    { id: 'Plus Jakarta Sans', label: 'Plus Jakarta', sub: 'Moderne & Lisible' },
    { id: 'Bricolage Grotesque', label: 'Bricolage', sub: 'Impactant & Punchy' },
    { id: 'Playfair Display', label: 'Playfair', sub: 'Luxe & Éditorial' },
    { id: 'Outfit', label: 'Outfit', sub: 'Géométrique Épuré' },
    { id: 'Space Mono', label: 'Space Mono', sub: 'Machine à Écrire' },
  ];

  const speedOptions = [
    { label: 'Ultra (35ms)', value: 35 },
    { label: 'Normale (65ms)', value: 65 },
    { label: 'Posée (100ms)', value: 100 },
    { label: 'Cinéma (140ms)', value: 140 },
  ];

  const cursorOptions: { id: CursorStyle; label: string }[] = [
    { id: 'bar', label: 'Barre (|)' },
    { id: 'block', label: 'Bloc (█)' },
    { id: 'underscore', label: 'Tiret (_)' },
    { id: 'glow', label: 'Lueur (●)' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-6 space-y-6 text-sm text-neutral-300">
      {/* 1. Zone de Texte Principal */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-4 h-4 text-[#e8c98d]" />
            <span>Votre Texte Typographique</span>
          </label>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400 font-mono">
              {analysis.wordCount} mots · ~{analysis.readingTimeSec}s
            </span>
            <button
              onClick={onAutoFixTypography}
              title="Ajouter automatiquement les espaces insécables avant : ; ! ? % et « »"
              className="text-[#e8c98d] hover:text-[#d8b97d] flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
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
          placeholder="Écrivez le message de votre vidéo…"
          className="w-full p-3.5 bg-[#121218] border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-sm leading-relaxed focus:outline-none focus:border-[#e8c98d] transition-colors resize-y font-sans"
        />

        {/* Quick Help Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTemplates}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e8c98d]" />
              <span>Modèles prêts à l'emploi</span>
            </button>
            <span className="text-neutral-700">·</span>
            <button
              onClick={onOpenWizard}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Formule 5 questions
            </button>
          </div>

          <button
            onClick={onOpenRules}
            className="text-[11px] text-[#e8c98d] hover:underline cursor-pointer"
          >
            Score d’impact : {analysis.score}/100
          </button>
        </div>
      </div>

      {/* 2. Format & Ratio */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Layout className="w-4 h-4 text-[#e8c98d]" />
          <span>Format & Plateforme</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ASPECT_RATIOS.map(ratio => (
            <button
              key={ratio.id}
              onClick={() => onChange({ aspectRatio: ratio.id })}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                settings.aspectRatio === ratio.id
                  ? 'border-[#e8c98d] bg-[#e8c98d]/10 text-white font-semibold shadow-sm'
                  : 'border-neutral-800/80 bg-[#121218] text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              <div className="text-xs font-bold">{ratio.label}</div>
              <div className="text-[10px] text-neutral-500 truncate mt-0.5">{ratio.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Thème & Couleurs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-[#e8c98d]" />
          <span>Palette & Ambiance</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COLOR_THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => onChange({ themeId: theme.id })}
              className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                settings.themeId === theme.id
                  ? 'border-[#e8c98d] bg-[#e8c98d]/10 text-white'
                  : 'border-neutral-800/80 bg-[#121218] text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-black/40 shrink-0 shadow-sm"
                style={{ backgroundColor: theme.textColor }}
              />
              <span className="text-xs truncate">{theme.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Typographie & Mise en Page */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Type className="w-4 h-4 text-[#e8c98d]" />
          <span>Style Typographique</span>
        </label>

        {/* Police */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {fontOptions.map(font => (
            <button
              key={font.id}
              onClick={() => onChange({ fontFamily: font.id })}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                settings.fontFamily === font.id
                  ? 'border-[#e8c98d] bg-[#e8c98d]/10 text-white'
                  : 'border-neutral-800/80 bg-[#121218] text-neutral-400 hover:text-neutral-200'
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
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#e8c98d]"
            />
          </div>

          <div>
            <span className="block text-xs text-neutral-400 mb-1">Alignement</span>
            <div className="flex items-center gap-1 bg-[#121218] p-1 rounded-lg border border-neutral-800">
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

      {/* 5. Vitesse & Curseur */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-[#e8c98d]" />
          <span>Vitesse & Curseur</span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          {speedOptions.map(s => (
            <button
              key={s.value}
              onClick={() => onChange({ typingSpeed: s.value })}
              className={`p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                settings.typingSpeed === s.value
                  ? 'border-[#e8c98d] bg-[#e8c98d]/10 text-white font-semibold'
                  : 'border-neutral-800/80 bg-[#121218] text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {cursorOptions.map(c => (
            <button
              key={c.id}
              onClick={() => onChange({ cursorStyle: c.id })}
              className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer text-center ${
                settings.cursorStyle === c.id
                  ? 'border-[#e8c98d] bg-[#e8c98d]/10 text-white font-semibold'
                  : 'border-neutral-800/80 bg-[#121218] text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Halo Lumineux & Effet Film */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Disc className="w-4 h-4 text-[#e8c98d]" />
          <span>Halo Lumineux & Grain</span>
        </label>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-neutral-400">Intensité du halo</span>
            <span className="font-mono text-[#e8c98d]">{settings.haloIntensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.haloIntensity}
            onChange={e => onChange({ haloIntensity: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#e8c98d]"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-neutral-400">Position du halo</span>
          <div className="flex items-center gap-1 bg-[#121218] p-1 rounded-lg border border-neutral-800 text-xs">
            {(['top', 'center', 'bottom'] as const).map(pos => (
              <button
                key={pos}
                onClick={() => onChange({ haloPosition: pos })}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  settings.haloPosition === pos
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {pos === 'top' ? 'Haut' : pos === 'center' ? 'Centre' : 'Bas'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-neutral-400">Grain argentique cinématographique</span>
          <button
            onClick={() => onChange({ filmGrain: !settings.filmGrain })}
            className={`px-3 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              settings.filmGrain
                ? 'bg-[#e8c98d]/20 text-[#e8c98d] font-semibold'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            {settings.filmGrain ? 'Actif' : 'Désactivé'}
          </button>
        </div>
      </div>

      {/* 7. Personnalisation de Marque */}
      <div className="space-y-3 pt-2 border-t border-neutral-800/80">
        <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#e8c98d]" />
          <span>En-tête & Signature (Watermark)</span>
        </label>

        <div>
          <label className="block text-[11px] text-neutral-400 mb-1">
            En-tête supérieur (ex. Événement, promo)
          </label>
          <input
            type="text"
            value={settings.headerTag}
            onChange={e => onChange({ headerTag: e.target.value })}
            placeholder="Ex. RÉVEILLON 2026 · ÉDITION LIMITÉE"
            className="w-full px-3 py-2 bg-[#121218] border border-neutral-800 rounded-lg text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#e8c98d]"
          />
        </div>

        <div>
          <label className="block text-[11px] text-neutral-400 mb-1">
            Signature inférieure (ex. Marque, contact)
          </label>
          <input
            type="text"
            value={settings.footerSignature}
            onChange={e => onChange({ footerSignature: e.target.value })}
            placeholder="Ex. GANDXO · JUST CODE IT"
            className="w-full px-3 py-2 bg-[#121218] border border-neutral-800 rounded-lg text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#e8c98d]"
          />
        </div>
      </div>
    </div>
  );
}
