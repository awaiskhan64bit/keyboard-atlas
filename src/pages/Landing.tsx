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

const GATERON_SWITCHES: SwitchFeature[] = [
  {
    id: 'gateron-red',
    name: 'Gateron Red',
    brand: 'Gateron Mechanical',
    feel: 'Linear',
    force: '45 gf',
    travel: '4.0 mm',
    soundKey: 'gateronred',
    blurb: 'Smooth, light linear stroke with deep acoustic clack. Extracted from studio Keychron sound tests.',
    photo: '/photos/switch-gateron-red.jpg',
  },
  {
    id: 'gateron-brown',
    name: 'Gateron Brown',
    brand: 'Gateron Mechanical',
    feel: 'Tactile',
    force: '55 gf',
    travel: '4.0 mm',
    soundKey: 'gateronbrown',
    blurb: 'Gentle tactile feedback bump mid-travel. Sourced directly from authentic Gateron switch audio.',
    photo: '/photos/switch-gateron-brown.jpg',
  },
  {
    id: 'gateron-blue',
    name: 'Gateron Blue',
    brand: 'Gateron Mechanical',
    feel: 'Clicky',
    force: '60 gf',
    travel: '4.0 mm',
    soundKey: 'gateronblue',
    blurb: 'Sharp, distinctive click jacket with crisp high-pitch actuation pop on every keypress.',
    photo: '/photos/switch-gateron-blue.jpg',
  },
  {
    id: 'gateron-black',
    name: 'Gateron Black',
    brand: 'Gateron Mechanical',
    feel: 'Heavy Linear',
    force: '60 gf',
    travel: '4.0 mm',
    soundKey: 'gateronblack',
    blurb: 'Substantial 60 gf spring resistance providing a solid, cushioned return thock without bottoming out.',
    photo: '/photos/switch-gateron-black.jpg',
  },
];

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
    blurb: 'Polycarbonate transparent housing with crisp, bright high-frequency bottom-out.',
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

  // Active Aula boards
  const aulaBoards = KEYBOARDS.filter((k) => k.brand === 'Aula');

  // Preview boards (coming soon)
  const comingSoonBoards = KEYBOARDS.filter(
    (k) => k.brand !== 'Aula' && ['keychron-q1', 'ducky-one-3-sf', 'wooting-60he', 'nuphy-air75', 'mode-sonnet'].includes(k.id)
  );

  const testSwitchAudio = (s: SwitchFeature) => {
    setPlayingSwitch(s.id);
    const set = soundSetForSwitch(s.soundKey, 'linear');
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
      {/* Hero Cinema: 100% Full Opacity Video & Bold Brand Header */}
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
          <div className="hero-cinema__scrim" />
          <div className="hero-cinema__content">
            <div className="hero-cinema__brand-badge">
              <span className="brand-badge-pill">KEYBOARD ATLAS</span>
              <span className="badge badge--red">Studio Mechanical Lab</span>
            </div>
            <h1 className="hero-cinema__title">
              Type on mechanical boards <br />
              before you buy.
            </h1>
            <p className="hero-cinema__lede">
              Explore authentic factory photography, switch between real colorways, and audition authentic switch recordings
              extracted from high-fidelity typing tests.
            </p>
            <div className="hero-cinema__actions">
              <a href="#aula" className="btn btn--primary">
                Explore Aula Collection (7 Boards)
              </a>
              <a href="#switches" className="btn btn--outline">
                Audition Gateron & Aula Switches
              </a>
              <button type="button" className="btn btn--outline" onClick={onRandom}>
                Random Aula Board
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturers Strip: Aula Active, Others Coming Soon */}
      <section className="section" id="brands">
        <header className="section-head">
          <span className="section-head__eyebrow">Manufacturers</span>
          <h2 className="section-head__title">Select a brand to view hardware lineups</h2>
          <p className="section-head__desc">
            Aula is our fully active, sound-tested collection. Other makers are currently queued for studio audio sampling.
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
                className={`brand-card ${isAula ? 'brand-card--featured' : 'brand-card--coming-soon'}`}
              >
                <div className="brand-card__logo-wrap">
                  <BrandLogo brand={brand} size={28} className="brand-card__logo" />
                </div>
                <div className="brand-card__info">
                  <div className="brand-card__title-row">
                    <span className="brand-card__name">{brand}</span>
                    {isAula ? (
                      <span className="badge badge--sm badge--red">Active (7 Boards)</span>
                    ) : (
                      <span className="badge badge--sm badge--slate">Coming Soon</span>
                    )}
                  </div>
                  <span className="brand-card__meta">
                    {meta?.country} / {count} {count === 1 ? 'model' : 'models'}
                  </span>
                  <p className="brand-card__blurb">{meta?.blurb}</p>
                </div>
                <span className="brand-card__arrow">
                  {isAula ? 'Explore collection &rarr;' : 'Preview lineup &rarr;'}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Premier Active Focus: The Complete Aula Collection */}
      <section className="section section--highlight" id="aula">
        <header className="section-head">
          <div className="section-head__badge-row">
            <BrandLogo brand="Aula" size={32} />
            <span className="badge badge--red">Active Playable Collection</span>
          </div>
          <h2 className="section-head__title">The Complete Aula Lineup</h2>
          <p className="section-head__desc">
            Featuring authentic factory photography of every colourway variation, hot-swap switch choices, and real YouTube
            sound test audio.
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
          <h2 className="section-head__title">Gateron Mechanical Switches</h2>
          <p className="section-head__desc">
            Official Keychron studio sound test audio and macro camera captures for Gateron Red, Brown, Blue, and Black. Click
            "Audition Keypress" to listen.
          </p>
        </header>

        <div className="switch-lab-grid">
          {GATERON_SWITCHES.map((sw) => (
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

        <header className="section-head" style={{ marginTop: '56px' }}>
          <span className="section-head__eyebrow">Factory Lineup</span>
          <h2 className="section-head__title">Aula LEOBOG Switches</h2>
          <p className="section-head__desc">
            Factory lubricated switches sourced directly from Aula F75 high-fidelity sound tests.
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

      {/* Coming Soon: Other Makers in Queue */}
      <section className="section" id="coming-soon">
        <header className="section-head">
          <div className="section-head__badge-row">
            <span className="badge badge--slate">In Studio Queue</span>
          </div>
          <h2 className="section-head__title">Coming Soon to Keyboard Atlas</h2>
          <p className="section-head__desc">
            We are actively recording acoustic audio profiles and capturing high-resolution photos for these flagship models.
          </p>
        </header>

        <div className="grid grid--3">
          {comingSoonBoards.map((kb) => (
            <div key={kb.id} className="coming-soon-card-wrap">
              <BoardCard kb={kb} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
