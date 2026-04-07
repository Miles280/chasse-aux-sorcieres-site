import { Power } from './power.model';
import { Camp } from '../enums/camp.enum';
import { Alignment } from '../enums/alignment.enum';

export interface Role {
  id?: number;
  name: string;
  description: string;
  minPlayer: number;
  camp: Camp;
  goal?: string;
  notes?: string;
  powers: Power[];
  alignments: Alignment[];
}
