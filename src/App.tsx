import { useEffect, useState } from 'react';
import { BY_ID, KEYBOARDS } from './data/keyboards';
import Landing from './pages/Landing';
import BrandPage from './pages/BrandPage';
import BoardPage from './pages/BoardPage';
import { links, useRoute } from './route';
import { sound } from './sound';

const Speaker = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
  </svg>
);

const KeyboardGlyph = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
    <path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M7 14h10" />
  </svg>
);

export default function App() {
  const route = useRoute();
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    sound.setEnabled(!muted);
  }, [muted]);

  const random = () => {
    const pick = KEYBOARDS[Math.floor(Math.random() * KEYBOARDS.length)];
    location.hash = links.board(pick.id);
  };

  return (
    <div className="app">
      <header className="top">
        <a className="mark" href={links.home}>
          <KeyboardGlyph />
          Keyboard Atlas
        </a>
        <nav className="top__nav">
          <a href={links.home}>Boards</a>
          <a href="https://github.com/awaiskhan64bit/keyboard-atlas" rel="noreferrer">
            Source
          </a>
          <button type="button" className="chip" data-on={!muted} onClick={() => setMuted((m) => !m)} aria-pressed={!muted}>
            <Speaker />
            {muted ? 'Muted' : 'Sound on'}
          </button>
        </nav>
      </header>

      <main>
        {route.page === 'home' ? <Landing onRandom={random} /> : null}
        {route.page === 'brand' ? <BrandPage slug={route.slug} /> : null}
        {route.page === 'board' ? <BoardPage id={route.id} kb={BY_ID.get(route.id)} /> : null}
      </main>

      <footer className="foot">
        <div className="foot__inner">
          <div>
            <p className="foot__mark">Keyboard Atlas</p>
            <p className="foot__note">
              An open source catalog of mechanical keyboards. Specs are edited by contributors, photos belong to the brands
              that made the boards, and the switch sounds are real recordings.
            </p>
          </div>
          <div className="foot__links">
            <a href={links.home}>All boards</a>
            <a href="https://github.com/awaiskhan64bit/keyboard-atlas" rel="noreferrer">
              Source on GitHub
            </a>
            <a href="https://github.com/awaiskhan64bit/keyboard-atlas/blob/main/CREDITS.md" rel="noreferrer">
              Photo credits
            </a>
            <a href="https://github.com/awaiskhan64bit/keyboard-atlas/blob/main/src/data/keyboards.ts" rel="noreferrer">
              Add a board
            </a>
          </div>
        </div>
        <div className="foot__bar">
          <span>MIT licensed</span>
          <span>No trackers, no accounts</span>
          <span>{KEYBOARDS.length} boards</span>
        </div>
      </footer>
    </div>
  );
}
