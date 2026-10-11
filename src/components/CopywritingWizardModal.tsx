import React, { useState } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { StudioSettings } from '../types';

interface CopywritingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (phrase: string, headerTag: string, footerSig: string) => void;
  currentSettings: StudioSettings;
}

export function CopywritingWizardModal({
  isOpen,
  onClose,
  onApply,
}: CopywritingWizardModalProps) {
  const [brand, setBrand] = useState('Minuit Doré');
  const [target, setTarget] = useState('les femmes de Cotonou');
  const [benefit, setBenefit] = useState('trouver leur look complet du Réveillon en un clic');
  const [eventDate, setEventDate] = useState('le Réveillon du 31 décembre');
  const [deadline, setDeadline] = useState('avant le 29 décembre');
  const [fear, setFear] = useState('craindre que leur tenue n’arrive trop tard');
  const [differentiator, setDifferentiator] = useState('essayage gratuit à la livraison et paiement MoMo');

  if (!isOpen) return null;

  // Formule reine : « Grâce à [marque], [cible] peut [bénéfice] pour [événement], sans [peur principale]. »
  const generatedPromise = `Grâce à ${brand || '[marque]'}, ${target || '[cible]'} peut ${benefit || '[bénéfice]'} pour ${eventDate || '[événement]'}, sans ${fear || '[peur]'}. Commandez ${deadline || 'à temps'} : ${differentiator || 'service garanti'}.`;

  const generatedHeader = `${(eventDate || 'ÉVÉNEMENT').toUpperCase()} · OFFRE VÉRIFIÉE`;
  const generatedFooter = `${(brand || 'GANDXO').toUpperCase()} · ${(differentiator || 'LIVRAISON LOCALE').toUpperCase()}`;

  const handleApply = () => {
    onApply(generatedPromise, generatedHeader, generatedFooter);
    onClose();
  };

  const handleLoadSample = (sampleType: 'cotonou' | 'blackfriday' | 'noel' | 'portfolio') => {
    if (sampleType === 'portfolio') {
      setBrand('Gandxo Tech');
      setTarget('les entrepreneurs et créateurs');
      setBenefit('lancer leur plateforme web moderne en 7 jours');
      setEventDate('leur projet 2026');
      setDeadline('ce mois-ci');
      setFear('perdre du temps avec du code lent ou des bugs');
      setDifferentiator('accompagnement direct sur WhatsApp et devis gratuit');
    } else if (sampleType === 'cotonou') {
      setBrand('Minuit Doré');
      setTarget('les femmes de Cotonou et Calavi');
      setBenefit('trouver leur robe de soirée étincelante en 1 clic');
      setEventDate('le Réveillon');
      setDeadline('avant le 29 décembre');
      setFear('recevoir la mauvaise taille ou subir un retard');
      setDifferentiator('essayage devant le livreur et échange immédiat');
    } else if (sampleType === 'blackfriday') {
      setBrand('VoltX Bénin');
      setTarget('les travailleurs et créateurs d’Akpakpa');
      setBenefit('garder 48h de batterie continue');
      setEventDate('ce Black Friday');
      setDeadline('avant vendredi 23h59');
      setFear('payer cher un faux matériel qui lâche');
      setDifferentiator('garantie 12 mois et test complet à la livraison dès 14 900 FCFA');
    } else {
      setBrand('Douceurs d’Ébène');
      setTarget('les familles et entreprises');
      setBenefit('offrir un coffret gourmand personnalisé');
      setEventDate('la Semaine de la Gratitude');
      setDeadline('avant le 20 décembre');
      setFear('un colis impersonnel ou un prix visible');
      setDifferentiator('mot manuscrit inclus et aucun prix sur le paquet');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#101015] border border-neutral-800 rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800/80 flex items-center justify-between sticky top-0 bg-[#101015]/95 backdrop-blur-sm z-10 gap-3">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#e8c98d]" />
              <span>Générateur : Formule en 5 Questions</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 sm:mt-1">
              Répondez à quelques questions simples pour générer un texte clair qui donne envie d’acheter.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 space-y-4">
          {/* Presets rapides */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-neutral-800/50 text-xs">
            <span className="text-neutral-400 text-[11px]">Exemples :</span>
            <button
              onClick={() => handleLoadSample('portfolio')}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors cursor-pointer text-[11px]"
            >
              💼 Portfolio Pro
            </button>
            <button
              onClick={() => handleLoadSample('cotonou')}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors cursor-pointer text-[11px]"
            >
              👗 Minuit Doré
            </button>
            <button
              onClick={() => handleLoadSample('blackfriday')}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors cursor-pointer text-[11px]"
            >
              ⚡ Black Friday
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                1. Votre Marque ou Nom
              </label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="Ex. Gandxo Tech, Minuit Doré…"
                className="w-full px-3 py-2 bg-[#17171f] border border-neutral-800 rounded-lg text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#e8c98d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                2. Qui achète ? (Votre cible)
              </label>
              <input
                type="text"
                value={target}
                onChange={e => setTarget(e.target.value)}
                placeholder="Ex. Les créateurs de Cotonou, parents…"
                className="w-full px-3 py-2 bg-[#17171f] border border-neutral-800 rounded-lg text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#e8c98d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                3. Quel bénéfice concret obtient-il ?
              </label>
              <input
                type="text"
                value={benefit}
                onChange={e => setBenefit(e.target.value)}
                placeholder="Ex. trouver leur look en un clic…"
                className="w-full px-3 py-2 bg-[#17171f] border border-neutral-800 rounded-lg text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#e8c98d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                4. Quelle est sa peur principale ?
              </label>
              <input
                type="text"
                value={fear}
                onChange={e => setFear(e.target.value)}
                placeholder="Ex. recevoir en retard, mauvaise taille…"
                className="w-full px-3 py-2 bg-[#17171f] border border-neutral-800 rounded-lg text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#e8c98d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                5. Événement ou Moment clé
              </label>
              <input
                type="text"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                placeholder="Ex. Réveillon 31 Décembre, ce mois-ci…"
                className="w-full px-3 py-2 bg-[#17171f] border border-neutral-800 rounded-lg text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#e8c98d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                6. Date limite de commande
              </label>
              <input
                type="text"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                placeholder="Ex. avant le 29 décembre, ce soir…"
                className="w-full px-3 py-2 bg-[#17171f] border border-neutral-800 rounded-lg text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#e8c98d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              7. Ce qui vous rend différent / crédible
            </label>
            <input
              type="text"
              value={differentiator}
              onChange={e => setDifferentiator(e.target.value)}
              placeholder="Ex. testé devant le livreur, dès 6 900 FCFA, SAV local…"
              className="w-full px-3 py-2 bg-[#17171f] border border-neutral-800 rounded-lg text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#e8c98d]"
            />
          </div>

          {/* Résultat Promesse Box */}
          <div className="bg-[#14141c] border border-[#e8c98d]/30 rounded-xl p-3 sm:p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#e8c98d] uppercase tracking-wider">
                Votre Phrase-Promesse Finale
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-white leading-relaxed">
              « {generatedPromise} »
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-3 sm:p-6 border-t border-neutral-800 bg-[#101015] flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer text-center"
          >
            Fermer
          </button>
          <button
            onClick={handleApply}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-[#e8c98d] hover:bg-[#d8b97d] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#e8c98d]/20"
          >
            <Check className="w-4 h-4" />
            <span>Mettre dans le Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
}
