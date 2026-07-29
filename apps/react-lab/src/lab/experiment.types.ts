export const experimentCategories = [
  'architecture',
  'state-and-data-flow',
  'async-workflows',
  'ux-and-quality',
  'full-stack',
] as const;

export type ExperimentCategory = (typeof experimentCategories)[number];
export type ExperimentStatus = 'stable' | 'exploring';

export type ExperimentDefinition = {
  slug: string;
  title: string;
  summary: string;
  category: ExperimentCategory;
  technologies: string[];
  concepts: string[];
  status: ExperimentStatus;
  route: `/experiments/${string}`;
  featured: boolean;
};
