import { describe, expect, it } from 'vitest';
import { experiments } from './experiment.registry';
import { experimentRoutes } from './experiment.routes';

describe('experiment routes', () => {
  it('matches every registry route exactly', () => {
    expect(experimentRoutes.map(({ path }) => path).sort()).toEqual(
      experiments.map(({ route }) => route).sort(),
    );
  });
});
