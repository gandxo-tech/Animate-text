import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StudioSettings, CopyTemplate } from './types';
import { StudioHeader } from './components/StudioHeader';
import { CanvasPreview } from './components/CanvasPreview';
import { ControlsPanel } from './components/ControlsPanel';
import { CopywritingWizardModal } from './components/CopywritingWizardModal';
import { CopyTemplatesDrawer } from './components/CopyTemplatesDrawer';
import { FrenchRulesDrawer } from './components/FrenchRulesDrawer';
import { drawStudioFrame, ASPECT_RATIOS } from './utils/canvasRenderer';
import { audioEngine } from './utils/audioEngine';
import { formatFrenchTypography, analyzeCopy } from './utils/textFormatter';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const INITIAL_SETTINGS: StudioSettings = {
  text: 'Grâce à Minuit Doré, trouvez votre look complet du Réveillon en un clic. Livré avant le 29 décembre à Cotonou, sans craindre le retard.',
  aspectRatio: '9:16',
  fontFamily: 'Plus Jakarta Sans',
  fontSize: 44,
  lineHeight: 1.5,
  letterSpacing: 0,
  textAlign: 'center',
  themeId: 'gold',
  typingSpeed: 65,
  animationStyle: 'typewriter',
  cursorStyle: 'bar',
  showCursor: true,
  haloIntensity: 65,
  haloPosition: 'top',
  filmGrain: false,
  headerTag: 'RÉVEILLON 2026 · ÉDITION LIMITÉE',
  footerSignature: 'GANDXO  ·  JUST CODE IT',
  soundEnabled: true,
  soundVolume: 0.6,
  safeGuidesVisible: false,
};

export default function App() {
  const [settings, setSettings] = useState<StudioSettings>(INITIAL_SETTINGS);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatus, setExportStatus] = useState<string>('Prêt.');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  // Active view tab on mobile
  const [mobileTab, setMobileTab] = useState<'preview' | 'controls'>('preview');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const progressRef = useRef<number>(1);

  // Copywriting analysis
  const copyAnalysis = analyzeCopy(settings.text);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleUpdateSettings = (updated: Partial<StudioSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updated };
      if (updated.soundEnabled !== undefined) {
        audioEngine.setMuted(!updated.soundEnabled);
      }
      if (updated.soundVolume !== undefined) {
        audioEngine.setVolume(updated.soundVolume);
      }
      return next;
    });
  };

  // Draw current frame onto canvas
  const renderCurrentState = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ratio = ASPECT_RATIOS.find(r => r.id === settings.aspectRatio) || ASPECT_RATIOS[0];

    if (canvas.width !== ratio.width || canvas.height !== ratio.height) {
      canvas.width = ratio.width;
      canvas.height = ratio.height;
    }

    const totalChars = settings.text.length;
    const currentChars = Math.round(progressRef.current * totalChars);
    const visibleText = settings.text.slice(0, currentChars);

    drawStudioFrame(canvas, visibleText, settings, {
      showCursor: settings.showCursor,
      cursorBlink: currentChars >= totalChars,
      progressRatio: progressRef.current,
    });
  }, [settings]);

  // Sync canvas redraw on settings or progress changes
  useEffect(() => {
    renderCurrentState();
  }, [renderCurrentState]);

  // Animation playback loop
  const stopPlayback = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const startPlayback = useCallback(() => {
    if (isExporting) return;
    stopPlayback();

    isPlayingRef.current = true;
    setIsPlaying(true);

    // If already at end, restart from beginning
    if (progressRef.current >= 0.99) {
      progressRef.current = 0;
      setPlaybackProgress(0);
      renderCurrentState();
    }

    if (settings.soundEnabled) {
      audioEngine.playIntroHit();
    }

    const text = settings.text;
    const totalChars = Math.max(1, text.length);
    let lastCharCount = Math.round(progressRef.current * totalChars);
    let lastTime = performance.now();
    const msPerChar = Math.max(20, settings.typingSpeed);

    const step = (now: number) => {
      if (!isPlayingRef.current) return;

      const elapsed = now - lastTime;
      if (elapsed >= msPerChar) {
        lastTime = now;
        lastCharCount++;

        const newRatio = Math.min(1, lastCharCount / totalChars);
        progressRef.current = newRatio;
        setPlaybackProgress(newRatio);

        // Sound trigger
        if (settings.soundEnabled && lastCharCount <= totalChars) {
          const char = text[lastCharCount - 1] || '';
          audioEngine.playClick(char === ' ' || char === '\n');
        }

        renderCurrentState();

        if (lastCharCount >= totalChars) {
          // Play vintage bell chime at end of sentence
          if (settings.soundEnabled) {
            audioEngine.playBell();
          }

          // Hold final frame for 1.5 seconds then stop
          setTimeout(() => {
            if (isPlayingRef.current) {
              stopPlayback();
            }
          }, 1500);
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, [isExporting, renderCurrentState, settings, stopPlayback]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const handleReset = () => {
    stopPlayback();
    progressRef.current = 0;
    setPlaybackProgress(0);
    renderCurrentState();
  };

  const handleScrub = (ratio: number) => {
    stopPlayback();
    progressRef.current = ratio;
    setPlaybackProgress(ratio);
    renderCurrentState();
  };

  // Auto fix French typography (non-breaking spaces, quotes)
  const handleAutoFixTypography = () => {
    const formatted = formatFrenchTypography(settings.text);
    handleUpdateSettings({ text: formatted });
    showNotification('Typographie française appliquée avec espaces insécables.');
  };

  // Video Export Engine
  const handleExportVideo = async () => {
    if (isExporting) return;
    if (!settings.text.trim()) {
      showNotification('Veuillez entrer un texte avant d’exporter.', 'error');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || !canvas.captureStream) {
      showNotification('Votre navigateur ne prend pas en charge la capture canvas.', 'error');
      return;
    }

    stopPlayback();
    setIsExporting(true);
    setExportProgress(0);
    setExportStatus('Initialisation des flux audio et vidéo…');

    try {
      const FPS = 24;
      const canvasStream = canvas.captureStream(FPS);

      // Create composite stream with audio if sound is enabled
      const compositeStream = new MediaStream();
      canvasStream.getVideoTracks().forEach(track => compositeStream.addTrack(track));

      if (settings.soundEnabled) {
        const audioTrack = audioEngine.getAudioTrack();
        if (audioTrack) {
          compositeStream.addTrack(audioTrack);
        }
      }

      // Check supported formats
      const preferredMimes = [
        'video/mp4;codecs=avc1,mp4a.40.2',
        'video/mp4',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ];
      const mime = preferredMimes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
      const isMp4 = mime.includes('mp4');

      const recorder = new MediaRecorder(compositeStream, {
        mimeType: mime,
        videoBitsPerSecond: 8000000, // 8 Mbps high quality
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const stoppedPromise = new Promise<void>((resolve, reject) => {
        recorder.onstop = () => resolve();
        recorder.onerror = e => reject(e);
      });

      recorder.start();

      const text = settings.text;
      const totalChars = Math.max(1, text.length);
      const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

      if (settings.soundEnabled) {
        audioEngine.playIntroHit();
      }

      setExportStatus('Enregistrement de la typographie image par image…');

      // Animate frame by frame
      for (let i = 0; i <= totalChars; i++) {
        const ratio = i / totalChars;
        progressRef.current = ratio;
        setPlaybackProgress(ratio);
        renderCurrentState();

        if (settings.soundEnabled && i > 0 && i <= totalChars) {
          const char = text[i - 1];
          audioEngine.playClick(char === ' ' || char === '\n');
        }

        setExportProgress((i / totalChars) * 85);
        await sleep(Math.max(25, settings.typingSpeed));
      }

      // Hold final frame for 1.8 seconds with typewriter chime
      if (settings.soundEnabled) {
        audioEngine.playBell();
      }
      setExportStatus('Finalisation du plan final et encodage…');

      for (let holdFrame = 0; holdFrame < 15; holdFrame++) {
        renderCurrentState();
        setExportProgress(85 + (holdFrame / 15) * 12);
        await sleep(100);
      }

      recorder.stop();
      await stoppedPromise;
      compositeStream.getTracks().forEach(t => t.stop());

      setExportProgress(100);
      setExportStatus('Téléchargement du fichier…');

      const blob = new Blob(chunks, { type: mime });
      const ext = isMp4 ? 'mp4' : 'webm';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeSlug = settings.text.slice(0, 20).toLowerCase().replace(/[^a-z0-9]/g, '-');
      a.href = url;
      a.download = `gandxo-${safeSlug || 'typing'}-${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 60000);
      showNotification(`Vidéo exportée avec succès (${ext.toUpperCase()}) !`);
    } catch (err: unknown) {
      console.error('Export error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Échec de l’export';
      showNotification(`Erreur d'export : ${errorMsg}`, 'error');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
      setExportStatus('Prêt.');
    }
  };

  // High-Resolution Snapshot PNG
  const handleTakeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `gandxo-snapshot-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showNotification('Capture HD téléchargée au format PNG.');
    } catch {
      showNotification('Impossible de capturer l’image.', 'error');
    }
  };

  const handleApplyTemplate = (template: CopyTemplate) => {
    handleUpdateSettings({
      text: template.hookText,
      headerTag: template.headerTag,
      footerSignature: template.footerSignature,
      themeId: template.suggestedTheme,
    });
    showNotification(`Modèle appliqué : « ${template.title} »`);
  };

  const handleApplyWizard = (phrase: string, headerTag: string, footerSig: string) => {
    handleUpdateSettings({
      text: phrase,
      headerTag,
      footerSignature: footerSig,
    });
    showNotification('Phrase-promesse injectée dans le studio !');
  };

  return (
    <div className="min-h-screen bg-[#08080b] text-neutral-100 flex flex-col font-sans">
      {/* Top Bar Contract (1 Brand wordmark, 3-4 nav links, 1 primary action) */}
      <StudioHeader
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onExportClick={handleExportVideo}
        isExporting={isExporting}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-medium shadow-xl backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-neutral-900/90 border-[#e8c98d]/40 text-[#e8c98d]'
                : 'bg-red-950/90 border-red-800 text-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#e8c98d] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Mobile Sub-Navigation Tabs */}
      <div className="md:hidden flex items-center justify-around border-b border-neutral-800 bg-[#0e0e13] px-4 py-2 text-xs">
        <button
          onClick={() => setMobileTab('preview')}
          className={`px-4 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            mobileTab === 'preview' ? 'bg-[#e8c98d] text-neutral-950 font-bold' : 'text-neutral-400'
          }`}
        >
          Aperçu Vidéo
        </button>
        <button
          onClick={() => setMobileTab('controls')}
          className={`px-4 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            mobileTab === 'controls' ? 'bg-[#e8c98d] text-neutral-950 font-bold' : 'text-neutral-400'
          }`}
        >
          Réglages & Texte
        </button>
      </div>

      {/* Main Studio Split Layout */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
        {/* Left Column: Studio Controls Panel */}
        <section
          className={`md:col-span-6 lg:col-span-5 border-r border-neutral-800/80 bg-[#0c0c10] overflow-y-auto ${
            mobileTab === 'controls' ? 'block' : 'hidden md:block'
          }`}
        >
          <ControlsPanel
            settings={settings}
            onChange={handleUpdateSettings}
            analysis={copyAnalysis}
            onAutoFixTypography={handleAutoFixTypography}
            onOpenWizard={() => setIsWizardOpen(true)}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
            onOpenRules={() => setIsRulesOpen(true)}
            onSelectTemplate={handleApplyTemplate}
          />
        </section>

        {/* Right Column: Canvas Live Viewport */}
        <section
          className={`md:col-span-6 lg:col-span-7 bg-[#060609] flex flex-col items-center justify-center relative overflow-hidden ${
            mobileTab === 'preview' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <CanvasPreview
            canvasRef={canvasRef}
            settings={settings}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onReset={handleReset}
            playbackProgress={playbackProgress}
            onScrub={handleScrub}
            isExporting={isExporting}
            exportProgress={exportProgress}
            exportStatus={exportStatus}
            onToggleSound={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            onToggleSafeGuides={() => handleUpdateSettings({ safeGuidesVisible: !settings.safeGuidesVisible })}
            onTakeSnapshot={handleTakeSnapshot}
          />
        </section>
      </main>

      {/* Modals & Guides */}
      <CopywritingWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onApply={handleApplyWizard}
        currentSettings={settings}
      />

      <CopyTemplatesDrawer
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleApplyTemplate}
      />

      <FrenchRulesDrawer
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        analysis={copyAnalysis}
        onAutoFixTypography={handleAutoFixTypography}
      />
    </div>
  );
}
