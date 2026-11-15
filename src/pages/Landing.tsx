import BoardCard from '../components/BoardCard';
import { BRAND_META } from '../data/brands';
import { BRANDS, KEYBOARDS } from '../data/keyboards';
import { PHOTOS, photosFor, SWITCH_PHOTOS } from '../data/photos';
import { brandSlug, links } from '../route';

const STATS = [
  ['44', 'boards, spec by spec'],
  ['16', 'brands and their layouts'],
  ['13', 'real switch recordings'],
  ['6', 'layout families'],
];

const FEATURED = ['aula-f75-pro', 'keychron-q1', 'ducky-one-3-sf', 'razer-huntsman-mini', 'mode-sonnet', 'hhkb-professional-classic'];

const KINDS = [
  ['linear', 'Linear', 'Smooth all the way down. Nothing to feel but the spring.'],
  ['tactile', 'Tactile', 'A bump at the actuation point, no click to announce it.'],
  ['clicky', 'Clicky', 'A separate click jacket. Loud on purpose.'],
  ['topre', 'Topre', 'Rubber dome over a conical spring. Deep, not sharp.'],
];

const allPhotos = () => PHOTOS.map((p) => p.src);

function Tile({ brand }: { brand: string }) {
  const boards = KEYBOARDS.filter((k) => k.brand === brand);
  const meta = BRAND_META[brand];
  const strip = boards.flatMap((b) => photosFor(b.id).slice(0, 1)).slice(0, 3);

  return (
    <a className="tile" href={links.brand(brand)}>
      <span className="tile__top">
        <span className={`wordmark wordmark--${brandSlug(brand)}`}>{brand}</span>
        <span className="tile__meta">
          {meta?.country} / {boards.length} {boards.length === 1 ? 'board' : 'boards'}
        </span>
      </span>
      <span className="tile__strip">
        {strip.map((src, i) => (
          <img key={src + i} src={src} alt="" loading="lazy" decoding="async" />
        ))}
        {strip.length === 0 ? <span className="tile__blank" /> : null}
      </span>
      <span className="tile__foot">
        <span>{meta?.blurb}</span>
        <span className="tile__go">View</span>
      </span>
    </a>
  );
}

export default function Landing({ onRandom }: { onRandom: () => void }) {
  const featured = FEATURED.map((id) => KEYBOARDS.find((k) => k.id === id)).filter(Boolean);
  const wallPhotos = allPhotos().slice(0, 10);

  return (
    <>
      <section className="hero">
        <video className="hero__film" src="/media/hero.mp4" poster="/media/hero.jpg" autoPlay muted loop playsInline aria-hidden="true" />
        <div className="hero__veil" />
        <div className="hero__copy">
          <p className="eyebrow">Open source catalog / 44 boards / 16 brands</p>
          <h1>
            Every board,
            <br />
            in daylight.
          </h1>
          <p className="lede">
            Press the keys and hear the switch. Pick a colourway and watch it change. Read the specs before you spend anything.
          </p>
          <div className="hero__cta">
            <a className="btn" href="#brands">
              Browse the brands
            </a>
            <button type="button" className="btn btn--ghost" onClick={onRandom}>
              Open a random board
            </button>
          </div>
        </div>
        <p className="hero__tag">Looping film from the desk</p>
      </section>

      <section className="stats">
        {STATS.map(([n, label]) => (
          <div key={label}>
            <span className="stats__n">{n}</span>
            <span className="stats__label">{label}</span>
          </div>
        ))}
      </section>

      <section className="section" id="brands">
        <header className="section__head">
          <h2>The brands</h2>
          <p className="section__note">Sixteen makers, from hundred dollar foam boards to bare aluminium cases. Pick one to see every board it made.</p>
        </header>
        <div className="tiles">
          {BRANDS.map((brand) => (
            <Tile key={brand} brand={brand} />
          ))}
        </div>
      </section>

      <section className="section section--slate">
        <header className="section__head">
          <h2>Start somewhere</h2>
          <p className="section__note">Six boards people ask about most. Each one opens with its photos, its colourways and its recordings.</p>
        </header>
        <div className="grid grid--3">
          {featured.map((kb) => kb && <BoardCard key={kb.id} kb={kb} />)}
        </div>
      </section>

      <section className="section">
        <header className="section__head">
          <h2>The four feels</h2>
          <p className="section__note">Every switch in the catalog is one of these, plus the quiet ones. Real macro photographs, real recordings.</p>
        </header>
        <div className="kinds">
          {KINDS.map(([key, name, blurb]) => {
            const photo = SWITCH_PHOTOS[key]?.[0];
            return (
              <article className="kind" key={key}>
                <span className="kind__media">{photo ? <img src={photo} alt={`${name} switch`} loading="lazy" decoding="async" /> : null}</span>
                <h3>{name}</h3>
                <p>{blurb}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section section--wall">
        <header className="section__head">
          <h2>From the listings</h2>
          <p className="section__note">Product photography, collected as each board was added. Every image credit is in the repo.</p>
        </header>
        <div className="wall">
          {wallPhotos.map((src, i) => (
            <figure key={src} className={i % 5 === 0 ? 'wall__item wall__item--wide' : 'wall__item'}>
              <img src={src} alt="" loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
      </section>

      <section className="cta">
        <div>
          <h2>Forty four boards in one browser tab.</h2>
          <p>No accounts, no email gate. Press a key and it plays the recording of that switch.</p>
        </div>
        <div className="cta__buttons">
          <a className="btn" href={links.board('aula-f75-pro')}>
            Open the Aula F75 Pro
          </a>
          <a className="btn btn--ghost" href="https://github.com/awaiskhan64bit/keyboard-atlas" rel="noreferrer">
            Read the source
          </a>
        </div>
      </section>
    </>
  );
}
