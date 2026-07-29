import { describe, expect, it } from 'vitest';
import { experiments } from './experiment.registry';

describe('experiment registry', () => {
  it('uses unique slugs and routes', () => {
    const slugs = experiments.map(({ slug }) => slug);
    const routes = experiments.map(({ route }) => route);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it('provides recruiter-facing metadata for every experiment', () => {
    for (const experiment of experiments) {
      expect(experiment.title.trim()).not.toBe('');
      expect(experiment.summary.trim().length).toBeGreaterThanOrEqual(40);
      expect(experiment.technologies.length).toBeGreaterThan(0);
      expect(experiment.concepts.length).toBeGreaterThan(0);
      expect(experiment.route).toBe(`/experiments/${experiment.slug}`);
    }
  });
});
