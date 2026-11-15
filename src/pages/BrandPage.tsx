import { useMemo, useState } from 'react';
import BoardCard from '../components/BoardCard';
import BrandLogo from '../components/BrandLogo';
import { BRAND_META } from '../data/brands';
import { BRANDS, KEYBOARDS, type LayoutId } from '../data/keyboards';
import { LAYOUTS } from '../data/layouts';
import { photosFor } from '../data/photos';
import { brandSlug, links } from '../route';

type Props = {
  slug: string;
};

export default function BrandPage({ slug }: Props) {
  const brand = useMemo(() => {
    return BRANDS.find((b) => brandSlug(b) === slug) ?? '';
  }, [slug]);

  const [layoutFilter, setLayoutFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

  const meta = brand ? BRAND_META[brand] : null;

  const brandBoards = useMemo(() => {
    if (!brand) return [];
    return KEYBOARDS.filter((k) => k.brand === brand);
  }, [brand]);

  const filteredBoards = useMemo(() => {
    return brandBoards.filter((b) => {
      if (layoutFilter !== 'all' && b.layout !== layoutFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          b.model.toLowerCase().includes(q) ||
          b.switchName.toLowerCase().includes(q) ||
          b.kind.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [brandBoards, layoutFilter, query]);

  const layoutsPresent = useMemo(() => {
    const set = new Set<LayoutId>();
    for (const b of brandBoards) set.add(b.layout);
    return Array.from(set);
  }, [brandBoards]);

  const brandPhotos = useMemo(() => {
    return brandBoards.flatMap((b) => photosFor(b.id)).slice(0, 8);
  }, [brandBoards]);

  if (!brand) {
    return (
      <div className="empty-page">
        <span className="badge badge--red">Brand not found</span>
        <h2>We could not find maker "{slug}"</h2>
        <p className="empty-page__note">
          Explore the catalog for sixteen keyboard makers and all documented models.
        </p>
        <a className="btn btn--primary" href={links.home}>
          Return to all brands
        </a>
      </div>
    );
  }

  return (
    <div className="brand-view">
      <nav className="crumb">
        <a href={links.home}>Home</a>
        <span className="crumb__sep">/</span>
        <a href="#brands">Makers</a>
        <span className="crumb__sep">/</span>
        <span className="crumb__cur">{brand}</span>
      </nav>

      <header className="brand-hero">
        <div className="brand-hero__top">
          <div className="brand-hero__logo-box">
            <BrandLogo brand={brand} size={42} />
            <div>
              <h1 className="brand-hero__title">{brand}</h1>
              <div className="brand-hero__badges">
                {meta?.country ? <span className="tag">{meta.country}</span> : null}
                {meta?.founded ? <span className="tag">Est. {meta.founded}</span> : null}
                <span className="tag tag--red">
                  {brandBoards.length} {brandBoards.length === 1 ? 'model' : 'models'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {meta?.blurb ? <p className="brand-hero__blurb">{meta.blurb}</p> : null}
        {brand !== 'Aula' ? (
          <div className="coming-soon-banner" style={{ marginTop: '20px' }}>
            <span className="badge badge--slate">Coming Soon</span>
            <p>
              High-fidelity sound tests and switch acoustic captures for {brand} are currently in queue. You can preview the
              hardware specs below or test the fully playable <a href={links.home + '#aula'}>Aula Collection</a>.
            </p>
          </div>
        ) : null}
      </header>

      {brandPhotos.length > 0 ? (
        <section className="brand-gallery" aria-label={`${brand} hardware photography`}>
          <div className="brand-gallery__scroll">
            {brandPhotos.map((src, idx) => (
              <figure key={src + idx} className="brand-gallery__shot">
                <img src={src} alt={`${brand} keyboard`} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="brand-boards">
        <div className="filter-bar">
          <div className="filter-bar__pills">
            <button
              type="button"
              className="pill"
              data-active={layoutFilter === 'all'}
              onClick={() => setLayoutFilter('all')}
            >
              All sizes ({brandBoards.length})
            </button>
            {layoutsPresent.map((l) => (
              <button
                key={l}
                type="button"
                className="pill"
                data-active={layoutFilter === l}
                onClick={() => setLayoutFilter(l)}
              >
                {LAYOUTS[l].name}
              </button>
            ))}
          </div>

          <input
            type="search"
            className="filter-bar__search"
            placeholder={`Search ${brand} models...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={`Search ${brand} boards`}
          />
        </div>

        {filteredBoards.length === 0 ? (
          <div className="empty-notice">
            <p>No {brand} boards match your search filter.</p>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => {
                setLayoutFilter('all');
                setQuery('');
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid--3">
            {filteredBoards.map((b) => (
              <BoardCard key={b.id} kb={b} />
            ))}
          </div>
        )}
      </section>

      <section className="brand-strip">
        <p className="brand-strip__title">More Keyboard Makers</p>
        <div className="brand-strip__list">
          {BRANDS.filter((b) => b !== brand).map((other) => (
            <a key={other} href={links.brand(other)} className="brand-strip__link">
              <BrandLogo brand={other} size={16} />
              <span>{other}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
