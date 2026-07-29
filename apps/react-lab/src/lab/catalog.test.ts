import { describe, expect, it } from 'vitest';
import { filterExperiments } from './catalog';
import { experiments } from './experiment.registry';

describe('filterExperiments', () => {
  it('searches titles, summaries, technologies, and concepts without case sensitivity', () => {
    expect(filterExperiments(experiments, { query: 'nEsTeD', category: null })).toMatchObject([{ slug: 'nested-comments' }]);
    expect(filterExperiments(experiments, { query: 'recoverable api', category: null })).toMatchObject([{ slug: 'search' }]);
    expect(filterExperiments(experiments, { query: 'fEtCh aPi', category: null }).map(({ slug }) => slug).sort()).toEqual(['crypto-converter', 'search']);
    expect(filterExperiments(experiments, { query: 'ImMuTaBlE UpDaTeS', category: null })).toMatchObject([{ slug: 'nested-comments' }]);
  });

  it('combines the active category and search query', () => {
    expect(filterExperiments(experiments, { query: 'derived', category: 'state-and-data-flow' }).map(({ slug }) => slug)).toEqual(['account-activity']);
  });
});
