import { Camp } from './camp.model';
import { Power } from './power.model';
import { Alignment } from './alignment.model';

export interface Role {
  id: number;
  name: string;
  description: string;
  minPlayer: number;
  camp: Camp;
  goal?: {
    id: number;
    name: string;
  } | null;
  powers: Power[];
  alignment: Alignment[];
}
