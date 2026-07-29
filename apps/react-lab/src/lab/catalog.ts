import type { ExperimentCategory, ExperimentDefinition } from './experiment.types';

export type CatalogFilters = {
  query: string;
  category: ExperimentCategory | null;
};

export function filterExperiments(
  experiments: readonly ExperimentDefinition[],
  { query, category }: CatalogFilters,
): ExperimentDefinition[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return experiments.filter((experiment) => {
    const matchesCategory = category === null || experiment.category === category;

    if (!normalizedQuery) {
      return matchesCategory;
    }

    const searchableContent = [
      experiment.title,
      experiment.summary,
      ...experiment.technologies,
      ...experiment.concepts,
    ]
      .join(' ')
      .toLocaleLowerCase();

    return matchesCategory && searchableContent.includes(normalizedQuery);
  });
}
