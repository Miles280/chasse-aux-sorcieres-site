export interface Power {
  id: number;
  title: string;
  description: string;
  isDayPower: boolean;
  isPassive: boolean;
  usageLimit: number | null;
  position: number;
  leavingHouse: boolean;
}
