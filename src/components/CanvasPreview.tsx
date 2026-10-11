import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Eye, Camera, Download, Sparkles } from 'lucide-react';
import { StudioSettings } from '../types';
import { ASPECT_RATIOS } from '../utils/canvasRenderer';

interface CanvasPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  settings: StudioSettings;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  playbackProgress: number; // 0 to 1
  onScrub: (ratio: number) => void;
  isExporting: boolean;
  exportProgress: number; // 0 to 100
  exportStatus: string;
  onToggleSound: () => void;
  onToggleSafeGuides: () => void;
  onTakeSnapshot: () => void;
  onExportVideo?: () => void;
}

export function CanvasPreview({
  canvasRef,
  settings,
  isPlaying,
  onTogglePlay,
  onReset,
  playbackProgress,
  onScrub,
  isExporting,
  exportProgress,
  exportStatus,
  onToggleSound,
  onToggleSafeGuides,
  onTakeSnapshot,
  onExportVideo,
}: CanvasPreviewProps) {
  const currentRatio = ASPECT_RATIOS.find(r => r.id === settings.aspectRatio) || ASPECT_RATIOS[0];

  // Fluid responsive container style calibrated for mobile (360px+) and desktop
  const getAspectRatioStyle = () => {
    switch (settings.aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-h-[46vh] sm:max-h-[58vh] lg:max-h-[70vh] w-auto max-w-[340px]';
      case '1:1':
        return 'aspect-square max-h-[40vh] sm:max-h-[50vh] lg:max-h-[60vh] w-auto max-w-[360px]';
      case '4:5':
        return 'aspect-[4/5] max-h-[44vh] sm:max-h-[54vh] lg:max-h-[64vh] w-auto max-w-[350px]';
      case '16:9':
        return 'aspect-[16/9] max-h-[32vh] sm:max-h-[42vh] lg:max-h-[52vh] w-full max-w-[540px]';
      default:
        return 'aspect-[9/16] max-h-[46vh] sm:max-h-[58vh] lg:max-h-[70vh] w-auto max-w-[340px]';
    }
  };

  return (
    <div className="flex flex-col items-center justify-between md:justify-center w-full h-full p-2 sm:p-4 md:p-6 select-none overflow-y-auto">
      {/* Top Bar above Canvas: Resolution & Info */}
      <div className="w-full max-w-[560px] flex items-center justify-between gap-2 mb-2 sm:mb-3 text-[11px] sm:text-xs text-neutral-400 px-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-semibold text-white bg-neutral-800/80 px-2 py-0.5 rounded text-[10px] sm:text-xs">
            {currentRatio.label}
          </span>
          <span className="hidden xs:inline" aria-hidden="true">·</span>
          <span className="font-mono text-[11px]">{currentRatio.width}×{currentRatio.height}</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span className="hidden sm:inline">24 FPS</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {settings.aspectRatio === '9:16' && (
            <button
              onClick={onToggleSafeGuides}
              title="Afficher les zones sécurisées TikTok / Reels"
              className={`p-1.5 sm:px-2 sm:py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-[11px] ${
                settings.safeGuidesVisible
                  ? 'bg-[#e8c98d]/20 text-[#e8c98d]'
                  : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Guides</span>
            </button>
          )}

          <button
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Son activé (Clics clavier)' : 'Son coupé'}
            className={`p-1.5 sm:px-2 sm:py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-[11px] ${
              settings.soundEnabled
                ? 'bg-neutral-800 text-[#e8c98d]'
                : 'hover:bg-neutral-800 text-neutral-400'
            }`}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{settings.soundEnabled ? 'Son On' : 'Muet'}</span>
          </button>

          <button
            onClick={onTakeSnapshot}
            title="Télécharger une photo HD (PNG)"
            className="p-1.5 sm:px-2 sm:py-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Photo HD</span>
          </button>
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div className="relative flex items-center justify-center w-full my-auto">
        <div
          className={`relative rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-black ${getAspectRatioStyle()} flex items-center justify-center transition-all`}
        >
          <canvas
            ref={canvasRef}
            width={currentRatio.width}
            height={currentRatio.height}
            className="w-full h-full object-contain block"
          />

          {/* Exporting progress overlay */}
          {isExporting && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 text-center z-30 animate-in fade-in">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-neutral-800 border-t-[#e8c98d] animate-spin mb-3" />
              <div className="text-sm sm:text-base font-bold text-white mb-1">
                Génération de votre vidéo…
              </div>
              <p className="text-xs text-neutral-400 mb-3 max-w-xs px-2">
                {exportStatus}
              </p>
              <div className="w-full max-w-[200px] bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#e8c98d] h-full transition-all duration-200"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <div className="text-xs font-mono text-[#e8c98d] mt-2 font-semibold">
                {Math.round(exportProgress)}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Playback Controls & Timeline Scrubber */}
      <div className="w-full max-w-[560px] mt-2 sm:mt-3 bg-[#111116] border border-neutral-800/80 rounded-xl p-2.5 sm:p-3 space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onTogglePlay}
            disabled={isExporting}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-[#e8c98d] text-neutral-950 hover:bg-[#d8b97d] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-neutral-950" />
            ) : (
              <Play className="w-4 h-4 fill-neutral-950 ml-0.5" />
            )}
          </button>

          <button
            onClick={onReset}
            disabled={isExporting}
            title="Revenir au début"
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Timeline slider */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={playbackProgress}
              onChange={e => onScrub(parseFloat(e.target.value))}
              disabled={isExporting}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#e8c98d]"
            />
            <span className="text-[11px] font-mono text-neutral-400 w-9 text-right tabular-nums shrink-0">
              {Math.round(playbackProgress * 100)}%
            </span>
          </div>
        </div>

        {/* Mobile Quick Export Button (Visible on mobile screens) */}
        {onExportVideo && (
          <div className="pt-1 md:hidden">
            <button
              onClick={onExportVideo}
              disabled={isExporting}
              className="w-full py-2.5 px-4 rounded-lg bg-[#e8c98d] hover:bg-[#d8b97d] text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Génération…' : 'Télécharger la Vidéo MP4'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
