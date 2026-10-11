export type AspectRatioId = '9:16' | '1:1' | '16:9' | '4:5';

export interface AspectRatioOption {
  id: AspectRatioId;
  label: string;
  sub: string;
  width: number;
  height: number;
}

export type AnimationStyle = 'typewriter' | 'wordByWord' | 'lineFade';

export type CursorStyle = 'bar' | 'block' | 'underscore' | 'glow';

export interface ColorTheme {
  id: string;
  name: string;
  textColor: string;
  accentGlow: string;
  bgFill: string;
  taglineColor: string;
  cursorColor: string;
}

export type FontFamilyId = 'Plus Jakarta Sans' | 'Playfair Display' | 'Bricolage Grotesque' | 'Outfit' | 'Space Mono';

export interface StudioSettings {
  text: string;
  aspectRatio: AspectRatioId;
  fontFamily: FontFamilyId;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: 'center' | 'left' | 'right';
  themeId: string;
  typingSpeed: number; // ms per char or word
  animationStyle: AnimationStyle;
  cursorStyle: CursorStyle;
  showCursor: boolean;
  haloIntensity: number; // 0 to 100
  haloPosition: 'top' | 'center' | 'bottom';
  filmGrain: boolean;
  headerTag: string; // e.g. "BLACK FRIDAY 2026" or "RÉVEILLON 2026"
  footerSignature: string; // e.g. "GANDXO · JUST CODE IT" or "@minuitdore · Cotonou"
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  safeGuidesVisible: boolean; // TikTok/Reels UI safe zone guides
}

export interface CopyTemplate {
  id: string;
  category: string;
  eventName: string;
  title: string;
  hookText: string;
  headerTag: string;
  footerSignature: string;
  suggestedTheme: string;
  pricingExample?: string;
  localContext: string;
  ruleApplied: string;
}
