import { Power } from './power.model';
import { Goal } from './goal.model';
import { Camp } from '../enums/camp.enum';
import { Alignment } from '../enums/alignment.enum';

export interface Role {
  id?: number;
  name: string;
  description: string;
  minPlayer: number;
  camp: Camp;
  goal: Goal | null;
  powers: Power[];
  alignments: Alignment[];
}
