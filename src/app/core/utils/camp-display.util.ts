import { Camp } from 'src/app/core/enums/camp.enum';

/** Libellé FR affiché pour chaque camp */
export const CAMP_LABELS: Record<Camp, string> = {
  [Camp.VILLAGERS]: 'Villageois',
  [Camp.WITCH]: 'Sorcières',
  [Camp.INDEPENDENT]: 'Indépendants',
};

export function getCampLabel(camp: Camp): string {
  return CAMP_LABELS[camp];
}
