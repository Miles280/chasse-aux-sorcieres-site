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
 * Une couleur dédiée par alignement, mais volontairement TERNE :
 * fond très sombre (950) + texte semi-transparent, plutôt que fond 900/40 +
 * texte plein qui ressortait trop (notamment le Meneur en ambre).
 */
export const ALIGNMENT_BADGE_CLASSES: Record<Alignment, string> = {
  [Alignment.SUPPORT]:
    'bg-blue-950/40 text-blue-400/80 border border-blue-500/20',
  [Alignment.LEADER]:
    'bg-amber-950/40 text-amber-400/60 border border-amber-500/15',
  [Alignment.KILLER]: 'bg-red-950/40 text-red-400/80 border border-red-500/20',
  [Alignment.INFORMER]:
    'bg-cyan-950/40 text-cyan-400/80 border border-cyan-500/20',
  [Alignment.PROTECTOR]:
    'bg-emerald-950/40 text-emerald-400/80 border border-emerald-500/20',
};

export function getAlignmentLabel(alignment: Alignment): string {
  return ALIGNMENT_LABELS[alignment];
}

export function getAlignmentBadgeClasses(alignment: Alignment): string {
  return ALIGNMENT_BADGE_CLASSES[alignment];
}
