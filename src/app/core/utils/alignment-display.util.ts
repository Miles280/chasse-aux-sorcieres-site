import { Alignment } from 'src/app/core/enums/alignment.enum';

/** Libellé FR affiché pour chaque alignement */
export const ALIGNMENT_LABELS: Record<Alignment, string> = {
  [Alignment.KILLER]: 'Tueur',
  [Alignment.INFORMER]: 'Informateur',
  [Alignment.LEADER]: 'Meneur',
  [Alignment.PROTECTOR]: 'Protecteur',
  [Alignment.SUPPORT]: 'Support',
};

/**
 * Classes Tailwind du badge pour chaque alignement.
 * Une couleur dédiée par alignement.
 */
export const ALIGNMENT_BADGE_CLASSES: Record<Alignment, string> = {
  [Alignment.SUPPORT]: 'bg-blue-900/40 text-blue-300 border border-blue-500/30',
  [Alignment.LEADER]:
    'bg-amber-900/40 text-amber-300 border border-amber-500/30',
  [Alignment.KILLER]: 'bg-red-900/40 text-red-300 border border-red-500/30',
  [Alignment.INFORMER]:
    'bg-cyan-900/40 text-cyan-300 border border-cyan-500/30',
  [Alignment.PROTECTOR]:
    'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30',
};

export function getAlignmentLabel(alignment: Alignment): string {
  return ALIGNMENT_LABELS[alignment];
}

export function getAlignmentBadgeClasses(alignment: Alignment): string {
  return ALIGNMENT_BADGE_CLASSES[alignment];
}
