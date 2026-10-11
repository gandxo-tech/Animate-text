import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { CopyAnalysis } from '../utils/textFormatter';

interface FrenchRulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: CopyAnalysis;
  onAutoFixTypography: () => void;
}

export function FrenchRulesDrawer({
  isOpen,
  onClose,
  analysis,
  onAutoFixTypography,
}: FrenchRulesDrawerProps) {
  if (!isOpen) return null;

  const rules = [
    {
      num: '1',
      title: 'Le bénéfice avant la caractéristique',
      desc: 'Formule : [caractéristique] : [ce que ça change pour vous]. Exemple : « Enceinte 40 W étanche : 18 h de fête sans recharge ».',
    },
    {
      num: '2',
      title: 'Concret plutôt que vague',
      desc: 'Remplacez les adjectifs vagues par des faits précis : « Garantie 12 mois, testé devant le livreur, dès 6 900 FCFA ».',
    },
    {
      num: '3',
      title: 'Phrases courtes (15 à 20 mots max)',
      desc: 'Une seule idée forte par phrase. Sur mobile, un paragraphe ne dépasse jamais 3 lignes.',
    },
    {
      num: '4',
      title: 'Parler au visiteur (« Vous » > « Nous »)',
      desc: 'Comptez les « vous » et les « nous ». « Nous proposons de beaux bijoux » devient « Trouvez la parure qui illuminera votre Réveillon ».',
    },
    {
      num: '5',
      title: 'Des boutons précis (Verbe + Objet)',
      desc: 'Évitez « En savoir plus » ou « Cliquez ici ». Préférez « Trouver mon look », « Commander sur WhatsApp (30 s) ».',
    },
    {
      num: '6',
      title: 'Une urgence vraie (Zéro faux compte à rebours)',
      desc: 'Ne mentez jamais sur les stocks. Affichez la vraie date limite pour être livré à temps.',
    },
    {
      num: '7',
      title: 'Des prix en FCFA clairs et vérifiés',
      desc: 'Affichez l’économie réelle en FCFA (« Vous économisez 7 000 FCFA ») qui parle plus qu’un vague « -15 % ».',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#101015] border border-neutral-800 rounded-xl sm:rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-[#101015] gap-3">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#e8c98d]" />
              <span>Guide des 7 Règles d’Or & Diagnostic</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 sm:mt-1">
              Les principes clés pour un texte qui capte l’attention et déclenche des ventes réelles.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Text Audit */}
        <div className="p-3.5 sm:p-5 border-b border-neutral-800/80 bg-[#151520] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#e8c98d] uppercase tracking-wider text-[11px]">
              Diagnostic de votre texte
            </span>
            <span className="font-mono text-neutral-300">
              Score d’impact : <span className="text-[#e8c98d] font-bold">{analysis.score}/100</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-[#1a1a24] p-2 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[10px]">Longueur</div>
              <div className="font-semibold text-white mt-0.5 text-[11px]">{analysis.wordCount} mots (~{analysis.readingTimeSec}s)</div>
            </div>
            <div className="bg-[#1a1a24] p-2 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[10px]">Ratio Vous / Nous</div>
              <div className="font-semibold text-white mt-0.5 text-[11px]">
                {analysis.vousCount} « vous » · {analysis.nousCount} « nous »
              </div>
            </div>
            <div className="bg-[#1a1a24] p-2 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[10px]">Chiffres réels</div>
              <div className="font-semibold mt-0.5 text-white text-[11px]">
                {analysis.hasConcreteNumbers ? '✅ Présents' : '⚠️ Aucun chiffre'}
              </div>
            </div>
            <div className="bg-[#1a1a24] p-2 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[10px]">Appel à l’action</div>
              <div className="font-semibold mt-0.5 text-white text-[11px]">
                {analysis.hasCallToAction ? '✅ Présent' : '⚠️ Manquant'}
              </div>
            </div>
          </div>

          {analysis.suggestions.length > 0 && (
            <div className="space-y-1 pt-1">
              {analysis.suggestions.map((sug, i) => (
                <div key={i} className="text-[11px] text-amber-300/90 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-1 flex justify-end">
            <button
              onClick={onAutoFixTypography}
              className="text-[11px] px-3 py-1.5 bg-[#e8c98d]/20 hover:bg-[#e8c98d]/30 text-[#e8c98d] font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Corriger automatiquement les espaces insécables</span>
            </button>
          </div>
        </div>

        {/* 7 Rules List */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-3 flex-1">
          <div className="space-y-2.5">
            {rules.map(rule => (
              <div key={rule.num} className="bg-[#151520] border border-neutral-800/80 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#e8c98d] text-neutral-950 font-bold text-[11px] sm:text-xs flex items-center justify-center shrink-0">
                    {rule.num}
                  </span>
                  <h3 className="text-xs sm:text-sm font-semibold text-white">{rule.title}</h3>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed pl-6 sm:pl-7">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Checklist Finale */}
          <div className="mt-4 pt-3 border-t border-neutral-800">
            <h3 className="text-xs sm:text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#e8c98d]" />
              <span>Checklist Finale Avant Publication</span>
            </h3>
            <div className="space-y-1.5 text-[11px] sm:text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="text-[#e8c98d]">✔</span>
                <span>Promesse claire comprise en moins de 3 secondes.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#e8c98d]">✔</span>
                <span>Date de l’événement ou délai de livraison mentionné.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#e8c98d]">✔</span>
                <span>Prix ou économie en FCFA clairement lisible.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#e8c98d]">✔</span>
                <span>Canal de commande local précisé (WhatsApp, MoMo, Wave).</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
