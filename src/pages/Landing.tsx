import { useState } from 'react';
import BoardCard from '../components/BoardCard';
import BrandLogo from '../components/BrandLogo';
import { BRAND_META } from '../data/brands';
import { KEYBOARDS, type Keyboard } from '../data/keyboards';
import { links } from '../route';
import { sound, soundSetForSwitch } from '../sound';

// Featured primary brands to focus on
const FEATURED_BRANDS = [
  'Aula',
  'Keychron',
  'Ducky',
  'Razer',
  'Logitech',
  'NuPhy',
  'Wooting',
  'Corsair',
  'Mode',
  'PFU',
];

type SwitchFeature = {
  id: string;
  name: string;
  brand: string;
  feel: string;
  force: string;
  travel: string;
  soundKey: string;
  blurb: string;
  photo: string;
};

const AULA_SWITCHES: SwitchFeature[] = [
  {
    id: 'graywood',
    name: 'LEOBOG Graywood V3',
    brand: 'Aula / LEOBOG',
    feel: 'Linear',
    force: '40 gf',
    travel: '3.6 mm',
    soundKey: 'graywood',
    blurb: 'Deep, creamy acoustic profile with factory lube. Sourced directly from Aula F75 real sound tests.',
    photo: '/photos/switch-graywood.jpg',
  },
  {
    id: 'reaper',
    name: 'LEOBOG Reaper',
    brand: 'Aula / LEOBOG',
    feel: 'Linear',
    force: '45 gf',
    travel: '3.6 mm',
    soundKey: 'reaper',
    blurb: 'Slightly higher actuation resistance with clean, rounded bottom-out clack.',
    photo: '/photos/switch-reaper.jpg',
  },
  {
    id: 'icevein',
    name: 'LEOBOG Ice Vein',
    brand: 'Aula / LEOBOG',
    feel: 'Linear',
    force: '40 gf',
    travel: '3.6 mm',
    soundKey: 'icevein',
    blurb: 'Polycarbonate transparent housing with crisp, crisp high-frequency bottom-out.',
    photo: '/photos/switch-icevein.jpg',
  },
  {
    id: 'starvector',
    name: 'LEOBOG Star Vector',
    brand: 'Aula / LEOBOG',
    feel: 'Linear',
    force: '42 gf',
    travel: '3.7 mm',
    soundKey: 'starvector',
    blurb: 'Extended stem pole creating an authoritative, thocky return stroke.',
    photo: '/photos/switch-starvector.jpg',
  },
];

export default function Landing({ onRandom }: { onRandom: () => void }) {
  const [playingSwitch, setPlayingSwitch] = useState<string | null>(null);

  // Focus primarily on Aula keyboards
  const aulaBoards = KEYBOARDS.filter((k) => k.brand === 'Aula');
  const otherFeatured = KEYBOARDS.filter(
    (k) => k.brand !== 'Aula' && ['keychron-q1', 'ducky-one-3-sf', 'wooting-60he', 'nuphy-air75', 'mode-sonnet'].includes(k.id)
  );

  const testSwitchAudio = (s: SwitchFeature) => {
    setPlayingSwitch(s.id);
    const set = soundSetForSwitch(s.name, 'linear');
    sound.select(set);
    sound.press(2, 'Space');
    setTimeout(() => {
      sound.release('Space');
    }, 120);
    setTimeout(() => {
      setPlayingSwitch(null);
    }, 450);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-cinema">
        <div className="hero-cinema__frame">
          <video
            className="hero-cinema__video"
            src="/media/hero.mp4"
            poster="/media/hero.jpg"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="hero-cinema__overlay" />
          <div className="hero-cinema__content">
            <span className="badge badge--red">Laboratory & Mechanical Catalog</span>
            <h1 className="hero-cinema__title">
              Type on mechanical boards <br />
              before you buy.
            </h1>
            <p className="hero-cinema__lede">
              Explore authentic factory photography, switch between real colorways, and audition real switch recordings
              extracted from high-fidelity typing tests.
            </p>
            <div className="hero-cinema__actions">
              <a href="#aula" className="btn btn--primary">
                Explore Aula Collection
              </a>
              <a href="#brands" className="btn btn--outline">
                All Brands with Logos
              </a>
              <button type="button" className="btn btn--outline" onClick={onRandom}>
                Random Board
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Selector Strip with Vector Logos */}
      <section className="section" id="brands">
        <header className="section-head">
          <span className="section-head__eyebrow">Manufacturers</span>
          <h2 className="section-head__title">Select a brand to view all keyboards & variations</h2>
          <p className="section-head__desc">
            Click any maker logo below to explore their complete hardware lineup with photos of all colourways.
          </p>
        </header>

        <div className="brand-grid">
          {FEATURED_BRANDS.map((brand) => {
            const count = KEYBOARDS.filter((k) => k.brand === brand).length;
            const meta = BRAND_META[brand];
            const isAula = brand === 'Aula';

            return (
              <a
                key={brand}
                href={isAula ? '#aula' : links.brand(brand)}
                className={`brand-card ${isAula ? 'brand-card--featured' : ''}`}
              >
                <div className="brand-card__logo-wrap">
                  <BrandLogo brand={brand} size={28} className="brand-card__logo" />
                </div>
                <div className="brand-card__info">
                  <div className="brand-card__title-row">
                    <span className="brand-card__name">{brand}</span>
                    {isAula ? <span className="badge badge--sm badge--red">Target Focus</span> : null}
                  </div>
                  <span className="brand-card__meta">
                    {meta?.country} / {count} {count === 1 ? 'board' : 'boards'}
                  </span>
                  <p className="brand-card__blurb">{meta?.blurb}</p>
                </div>
                <span className="brand-card__arrow">View keyboards &rarr;</span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Targeted Premier Focus: Aula Keyboards */}
      <section className="section section--highlight" id="aula">
        <header className="section-head">
          <div className="section-head__badge-row">
            <BrandLogo brand="Aula" size={32} />
            <span className="badge badge--red">Premier Focus</span>
          </div>
          <h2 className="section-head__title">The Complete Aula Collection</h2>
          <p className="section-head__desc">
            Targeting the premier budget gasket-mounted lineup. Featuring real photography of every colourway variation,
            hot-swap switch options, and authentic YouTube sound tests.
          </p>
        </header>

        <div className="grid grid--3">
          {aulaBoards.map((kb: Keyboard) => (
            <BoardCard key={kb.id} kb={kb} />
          ))}
        </div>
      </section>

      {/* Switch Audio & Macro Photography Laboratory */}
      <section className="section" id="switches">
        <header className="section-head">
          <span className="section-head__eyebrow">Switch Acoustics Laboratory</span>
          <h2 className="section-head__title">Real Switch Macro Photography & Sounds</h2>
          <p className="section-head__desc">
            Sourced from real YouTube audio tests and high-resolution macro photography. Click "Audition Switch" to listen.
          </p>
        </header>

        <div className="switch-lab-grid">
          {AULA_SWITCHES.map((sw) => (
            <article key={sw.id} className="switch-card">
              <div className="switch-card__media">
                <img src={sw.photo} alt={sw.name} loading="lazy" decoding="async" />
                <span className="switch-card__feel-tag">{sw.feel}</span>
              </div>
              <div className="switch-card__body">
                <span className="switch-card__maker">{sw.brand}</span>
                <h3 className="switch-card__name">{sw.name}</h3>
                <div className="switch-card__specs">
                  <div>
                    <dt>Actuation</dt>
                    <dd>{sw.force}</dd>
                  </div>
                  <div>
                    <dt>Travel</dt>
                    <dd>{sw.travel}</dd>
                  </div>
                </div>
                <p className="switch-card__blurb">{sw.blurb}</p>
                <button
                  type="button"
                  className={`btn btn--sm ${playingSwitch === sw.id ? 'btn--primary' : 'btn--outline'}`}
                  onClick={() => testSwitchAudio(sw)}
                >
                  {playingSwitch === sw.id ? 'Playing sound...' : 'Audition Keypress'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Other Notable Mechanical Keyboards */}
      <section className="section">
        <header className="section-head">
          <span className="section-head__eyebrow">Custom & Flagship Boards</span>
          <h2 className="section-head__title">More Makers in the Atlas</h2>
          <p className="section-head__desc">
            From Keychron aluminum frames to Wooting analog Hall effect switches.
          </p>
        </header>

        <div className="grid grid--3">
          {otherFeatured.map((kb) => (
            <BoardCard key={kb.id} kb={kb} />
          ))}
        </div>
      </section>
    </div>
  );
}
