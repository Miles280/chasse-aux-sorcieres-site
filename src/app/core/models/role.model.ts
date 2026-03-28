// On définit l'Enum qui correspond exactement à ton PHP
export enum Camp {
  VILLAGEOIS = 'VILLAGEOIS',
  SORCIERES = 'SORCIERES',
  INDEPENDANTS = 'INDEPENDANTS'
}

export interface Role {
  id: number;
  name: string;
  description: string;
  minPlayer: number;
  camp: Camp; 
  powers?: any[];
  alignment?: string[];
}