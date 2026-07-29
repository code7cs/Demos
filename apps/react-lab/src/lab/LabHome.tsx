import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { filterExperiments } from './catalog';
import './LabHome.css';
import { experiments } from './experiment.registry';
import { experimentCategories, type ExperimentCategory, type ExperimentDefinition } from './experiment.types';

const categoryLabels: Record<ExperimentCategory, string> = { architecture: 'Architecture', 'state-and-data-flow': 'State & data flow', 'async-workflows': 'Async workflows', 'ux-and-quality': 'UX & quality', 'full-stack': 'Full stack' };

function ExperimentCard({ experiment }: { experiment: ExperimentDefinition }) {
  return <article className="experiment-card"><div className="experiment-card__meta"><span>{categoryLabels[experiment.category]}</span><span className={`experiment-card__status experiment-card__status--${experiment.status}`}>{experiment.status}</span></div><h2>{experiment.title}</h2><p>{experiment.summary}</p><ul className="experiment-card__tags" aria-label={`${experiment.title} technologies`}>{experiment.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul><Link className="experiment-card__link" to={experiment.route}>Open experiment <span aria-hidden="true">→</span></Link></article>;
}

export default function LabHome() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ExperimentCategory | null>(null);
  const filteredExperiments = useMemo(() => filterExperiments(experiments, { query, category }), [category, query]);
  const hasActiveFilters = query.trim() !== '' || category !== null;
  const resetFilters = () => { setQuery(''); setCategory(null); };
  return <div className="lab-home"><section className="lab-hero" aria-labelledby="lab-title"><p className="eyebrow">React Engineering Lab</p><h1 id="lab-title">Small experiments for durable frontend decisions.</h1><p className="lab-hero__summary">A focused catalog of production-shaped React exercises, each designed to make one engineering trade-off clear and inspectable.</p><a className="button button--primary" href="#experiments">Browse experiments</a></section><section className="featured-section" aria-labelledby="featured-title"><div className="section-heading"><div><p className="eyebrow">Selected work</p><h2 id="featured-title">Featured experiments</h2></div></div><div className="experiment-grid experiment-grid--featured">{experiments.filter(({ featured }) => featured).map((experiment) => <ExperimentCard key={experiment.slug} experiment={experiment} />)}</div></section><section className="catalog-section" id="experiments" aria-labelledby="catalog-title"><div className="section-heading"><div><p className="eyebrow">Catalog</p><h2 id="catalog-title">All experiments</h2></div><p>{filteredExperiments.length} available</p></div><div className="catalog-controls"><label className="search-control" htmlFor="experiment-search"><span>Search experiments</span><input id="experiment-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “state”, “TypeScript”, or “cancellation”" /></label><div className="category-controls" aria-label="Filter experiments by category"><button className="filter-button" type="button" aria-pressed={category === null} onClick={() => setCategory(null)}>All</button>{experimentCategories.map((option) => <button className="filter-button" type="button" key={option} aria-pressed={category === option} onClick={() => setCategory(option)}>{categoryLabels[option]}</button>)}</div></div>{filteredExperiments.length > 0 ? <div className="experiment-grid">{filteredExperiments.map((experiment) => <ExperimentCard key={experiment.slug} experiment={experiment} />)}</div> : <div className="catalog-empty" role="status"><h3>No experiments match those filters.</h3><p>Try a broader search, or return to the complete catalog.</p>{hasActiveFilters && <button className="button button--secondary" type="button" onClick={resetFilters}>Reset filters</button>}</div>}</section></div>;
}
