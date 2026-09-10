export type SectionId = 'letters' | 'vocabulary' | 'name-picture';

export interface AppSection {
  id: SectionId;
  title: string;
  description: string;
  emoji: string;
  route: string[];
}
