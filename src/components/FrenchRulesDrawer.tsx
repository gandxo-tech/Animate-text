import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Clock, Check, HelpCircle } from 'lucide-react';
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
      desc: 'Formule : [caractéristique] : [ce que ça change pour vous]. Exemple : « Enceinte 40 W étanche : 18 h de fête sans recharge » plutôt qu’une liste technique fade.',
    },
    {
      num: '2',
      title: 'Concret plutôt que vague',
      desc: 'Remplacez les adjectifs vagues (« super », « incroyable », « qualité ») par des faits et chiffres réels : « Garantie 12 mois, testé devant le livreur, dès 6 900 FCFA ».',
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
      title: 'Des boutons et actions précis (Verbe + Objet)',
      desc: 'Évitez « En savoir plus » ou « Cliquez ici ». Préférez « Trouver mon masque », « Commander sur WhatsApp (30 s) », « Offrir ce coffret ».',
    },
    {
      num: '6',
      title: 'Une urgence vraie (Zéro faux compte à rebours)',
      desc: 'Ne mentez jamais sur les stocks ni les délais. Affichez la vraie date limite de livraison pour être reçu avant l’événement.',
    },
    {
      num: '7',
      title: 'Des remises et prix en FCFA crédibles',
      desc: 'Sur les petits prix, affichez l’économie en FCFA (« Vous économisez 7 000 FCFA ») qui parle bien plus qu’un vague « -15 % ».',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#101015] border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-[#101015]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#e8c98d]" />
              <span>Guide des 7 Règles d’Écriture & Checklist Finale</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Les principes éprouvés pour rédiger un copywriting événementiel qui génère de vraies ventes en Afrique de l’Ouest.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Text Audit */}
        <div className="p-6 border-b border-neutral-800/80 bg-[#151520] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#e8c98d] uppercase tracking-wider">
              Diagnostic en direct de votre texte actuel
            </span>
            <span className="text-xs font-mono text-neutral-300">
              Score d’impact : <span className="text-[#e8c98d] font-bold">{analysis.score}/100</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#1a1a24] p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400">Longueur</div>
              <div className="font-semibold text-white mt-0.5">{analysis.wordCount} mots ({analysis.readingTimeSec}s de lecture)</div>
            </div>
            <div className="bg-[#1a1a24] p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400">Ratio Vous / Nous</div>
              <div className="font-semibold text-white mt-0.5">
                {analysis.vousCount} « vous » · {analysis.nousCount} « nous »
              </div>
            </div>
            <div className="bg-[#1a1a24] p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400">Chiffres concrets</div>
              <div className="font-semibold mt-0.5 text-white">
                {analysis.hasConcreteNumbers ? '✅ Présents (Prix/Dates)' : '⚠️ Manquants'}
              </div>
            </div>
            <div className="bg-[#1a1a24] p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400">Appel à l'action</div>
              <div className="font-semibold mt-0.5 text-white">
                {analysis.hasCallToAction ? '✅ Détecté' : '⚠️ Aucun verbe clair'}
              </div>
            </div>
          </div>

          {analysis.suggestions.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {analysis.suggestions.map((sug, i) => (
                <div key={i} className="text-xs text-amber-300/90 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={onAutoFixTypography}
              className="text-xs px-3 py-1.5 bg-[#e8c98d]/20 hover:bg-[#e8c98d]/30 text-[#e8c98d] font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Corriger automatiquement les espaces insécables (« », :, ;, !, ?)</span>
            </button>
          </div>
        </div>

        {/* 7 Rules List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="space-y-3">
            {rules.map(rule => (
              <div key={rule.num} className="bg-[#151520] border border-neutral-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-md bg-[#e8c98d] text-neutral-950 font-bold text-xs flex items-center justify-center">
                    {rule.num}
                  </span>
                  <h3 className="text-sm font-semibold text-white">{rule.title}</h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed pl-7">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Checklist Finale */}
          <div className="mt-6 pt-4 border-t border-neutral-800">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#e8c98d]" />
              <span>Checklist Finale Avant Publication</span>
            </h3>
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="text-[#e8c98d]">✔</span>
                <span>Le titre exprime une promesse compréhensible en moins de 3 secondes.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#e8c98d]">✔</span>
                <span>La date de l’événement et la date limite de livraison sont clairement visibles.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#e8c98d]">✔</span>
                <span>Prix affiché en FCFA ou économie chiffrée concrète.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#e8c98d]">✔</span>
                <span>Canal de commande local précisé (WhatsApp, MTN MoMo, Wave, Cash).</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#e8c98d]">✔</span>
                <span>Espaces insécables respectées avant les ponctuations doubles (: ; ! ? %).</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
