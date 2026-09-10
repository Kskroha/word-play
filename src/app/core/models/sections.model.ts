export type SectionId = 'letters' | 'vocabulary';

export interface AppSection {
  id: SectionId;
  title: string;
  description: string;
  emoji: string;
  route: string[];
}
