export interface HydraCollection<T> {
  member: T[];
  totalItems: number;
  '@context': string;
  '@id': string;
  '@type': string;
}
