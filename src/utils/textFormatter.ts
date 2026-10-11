/**
 * French typographical rules, FCFA formatting & Copywriting analysis.
 */

export function formatFrenchTypography(text: string): string {
  if (!text) return '';

  let formatted = text;

  // Espace insécable avant les signes doubles : ; ! ? %
  formatted = formatted.replace(/\s*([:;!?%])/g, '\u00A0$1');

  // Guillemets français : « texte » avec espaces insécables
  formatted = formatted.replace(/«\s*/g, '«\u00A0');
  formatted = formatted.replace(/\s*»/g, '\u00A0»');

  // Normaliser les espaces consécutives sauf insécables
  formatted = formatted.replace(/[ \t]+/g, ' ');

  return formatted;
}

export function formatFCFA(amount: number): string {
  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted}\u00A0FCFA`;
}

export interface CopyAnalysis {
  wordCount: number;
  charCount: number;
  readingTimeSec: number;
  vousCount: number;
  nousCount: number;
  vagueWordsFound: string[];
  hasConcreteNumbers: boolean;
  hasCallToAction: boolean;
  score: number; // 0 to 100
  suggestions: string[];
}

export function analyzeCopy(text: string): CopyAnalysis {
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const wordCount = words.length;
  const charCount = text.length;
  const readingTimeSec = Math.max(1, Math.round((wordCount / 200) * 60));

  const lower = text.toLowerCase();

  // Compter les occurrences de "vous/votre/vos" vs "nous/notre/nos"
  const vousMatches = lower.match(/\b(vous|votre|vos|toi|ton|ta|tes)\b/g) || [];
  const nousMatches = lower.match(/\b(nous|notre|nos|je|mon|mes|ma)\b/g) || [];
  const vousCount = vousMatches.length;
  const nousCount = nousMatches.length;

  // Détecter les mots vagues à remplacer par du concret (Règle 2)
  const vagueTerms = ['incroyable', 'super', 'top', 'magique', 'exceptionnel', 'meilleur', 'inégalable', 'parfait', 'qualité'];
  const vagueWordsFound: string[] = [];
  vagueTerms.forEach(term => {
    if (new RegExp(`\\b${term}\\b`, 'i').test(lower)) {
      vagueWordsFound.push(term);
    }
  });

  // Détecter les chiffres concrets (FCFA, %, dates, durées)
  const hasConcreteNumbers = /\b\d+(\s*(fcfa|f|h|jours?|mois|%|min|s))?\b/i.test(text);

  // Détecter un verbe d'action ou CTA (Règle 5)
  const hasCallToAction = /\b(commandez|cliquez|écrivez|profitez|validez|réservez|obtenez|contactez|trouvez|whatsapp|momo|wave)\b/i.test(lower);

  const suggestions: string[] = [];

  if (nousCount > vousCount && (nousCount + vousCount) > 2) {
    suggestions.push("Règle 4 : Parlez plus au visiteur (« vous ») qu'à vous-même (« nous »).");
  }

  if (vagueWordsFound.length > 0) {
    suggestions.push(`Règle 2 : Remplacez les mots vagues (« ${vagueWordsFound.slice(0, 2).join(', ')} ») par des faits ou chiffres précis.`);
  }

  if (!hasConcreteNumbers) {
    suggestions.push("Règle 2 : Ajoutez un chiffre concret (ex. prix en FCFA, délai de 24h, garantie 12 mois).");
  }

  if (wordCount > 35) {
    suggestions.push("Règle 3 : Phrases trop longues pour une vidéo courte. Visez 15 à 25 mots percutants.");
  }

  // Calcul d'un score de conversion pédagogique
  let score = 50;
  if (hasConcreteNumbers) score += 20;
  if (vousCount >= nousCount && vousCount > 0) score += 15;
  if (hasCallToAction) score += 15;
  if (vagueWordsFound.length === 0) score += 10;
  if (wordCount >= 8 && wordCount <= 30) score += 10;
  if (score > 100) score = 100;

  return {
    wordCount,
    charCount,
    readingTimeSec,
    vousCount,
    nousCount,
    vagueWordsFound,
    hasConcreteNumbers,
    hasCallToAction,
    score,
    suggestions,
  };
}
