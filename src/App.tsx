import { useEffect, useMemo, useRef, useState } from 'react';
import Board from './Board';
import type { RgbMode } from './Board';
import { BRANDS, BY_ID, KEYBOARDS } from './data/keyboards';
import type { Keyboard } from './data/keyboards';
import { LAYOUTS } from './data/layouts';
import { sound, soundSetFor } from './sound';

const MODES: { id: RgbMode; label: string }[] = [
  { id: 'warm', label: 'Warm' },
  { id: 'spectrum', label: 'Spectrum' },
  { id: 'reactive', label: 'Reactive' },
  { id: 'off', label: 'Off' },
];

// Keys the browser would use for something else while you are testing a board.
const CAPTURE = new Set(['Space', 'Tab', 'Backspace', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Quote', 'Slash']);

const Speaker = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
  </svg>
);

export default function App() {
  const [id, setId] = useState('aula-f75-pro');
  const [mode, setMode] = useState<RgbMode>('warm');
  const [muted, setMuted] = useState(false);
  const [query, setQuery] = useState('');
  const [typed, setTyped] = useState(false);
  const [pressed, setPressed] = useState<ReadonlySet<string>>(() => new Set());
  const held = useRef<ReadonlySet<string>>(new Set());

  const kb = BY_ID.get(id) ?? KEYBOARDS[0];
  const layout = LAYOUTS[kb.layout];

  const rows = useMemo(() => {
    const map = new Map<string, number>();
    for (const k of layout.keys) if (!map.has(k.code)) map.set(k.code, k.y);
    return map;
  }, [layout]);

  useEffect(() => {
    sound.select(soundSetFor(kb));
  }, [kb]);

  useEffect(() => {
    sound.setEnabled(!muted);
  }, [muted]);

  const hold = (code: string, row: number) => {
    if (held.current.has(code)) return;
    sound.press(row, code);
    const next = new Set(held.current);
    next.add(code);
    held.current = next;
    setPressed(next);
    setTyped(true);
  };

  const loose = (code: string) => {
    if (!held.current.has(code)) return;
    sound.release(code);
    const next = new Set(held.current);
    next.delete(code);
    held.current = next;
    setPressed(next);
  };

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.repeat) return;
      // Tab stays usable while a control has focus, so the page can still be navigated.
      const bare = document.activeElement === document.body;
      if (CAPTURE.has(e.code) && !e.altKey && (e.code !== 'Tab' || bare)) e.preventDefault();
      hold(e.code, rows.get(e.code) ?? 2);
    };
    const onUp = (e: KeyboardEvent) => loose(e.code);
    const onBlur = () => {
      held.current = new Set();
      setPressed(new Set());
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [rows]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? KEYBOARDS.filter((k) => `${k.brand} ${k.model} ${k.switchName}`.toLowerCase().includes(q)) : KEYBOARDS;
    const map = new Map<string, Keyboard[]>();
    for (const k of list) {
      const bucket = map.get(k.brand);
      if (bucket) bucket.push(k);
      else map.set(k.brand, [k]);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [query]);

  const facts: [string, string][] = [
    ['Layout', layout.name],
    ['Switch', kb.switchName],
    ['Feel', kb.kind],
    ['Lighting', kb.rgb],
    ['Case', kb.caseMaterial],
    ['Mount', kb.mounting],
    ['Keycaps', kb.keycaps],
    ['Connect', kb.connect],
    ['Released', String(kb.year)],
  ];
  if (kb.price) facts.push(['Launch price', `about $${kb.price}`]);

  return (
    <div className="app">
      <header className="top">
        <span className="mark">Keyboard Atlas</span>
        <span className="top__count">
          {KEYBOARDS.length} boards / {BRANDS.length} brands
        </span>
        <div className="top__right">
          <button type="button" className="chip" data-on={!muted} onClick={() => setMuted((m) => !m)}>
            <Speaker />
            {muted ? 'Muted' : 'Sound'}
          </button>
          <div className="seg" role="group" aria-label="Backlight mode">
            {MODES.map((m) => (
              <button key={m.id} type="button" data-active={mode === m.id} onClick={() => setMode(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="shell">
        <aside className="rail">
          <input
            className="search"
            type="search"
            placeholder="Search boards"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search boards"
          />
          {groups.length === 0 ? <p className="empty">Nothing matches that.</p> : null}
          {groups.map(([brand, boards]) => (
            <div className="group" key={brand}>
              <p className="group__name">{brand}</p>
              {boards.map((b) => (
                <button key={b.id} type="button" className="item" data-active={b.id === kb.id} onClick={() => setId(b.id)}>
                  {b.model}
                  <span className="item__meta">{LAYOUTS[b.layout].name}</span>
                </button>
              ))}
            </div>
          ))}
        </aside>

        <main className="main">
          <section className="stage">
            <div className="stage__head">
              <h1>
                {kb.brand} {kb.model}
              </h1>
              <p className="stage__meta">
                {layout.name} / {kb.switchName}
              </p>
            </div>

            <Board kb={kb} layout={layout} mode={mode} pressed={pressed} onPress={hold} onRelease={loose} />

            <p className="hint">{typed ? 'Clicks work too. Switch boards any time.' : 'Press any key to hear this board'}</p>
          </section>

          <section className="specs">
            <p className="specs__note">{kb.note}</p>
            <dl className="facts">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="fine">
              Specs are approximate and edited by contributors. The sound is a real recording of a matching switch type, not of
              this exact board.
            </p>
          </section>

          <footer className="foot">
            <a href="https://github.com/awaiskhan64bit/keyboard-atlas" rel="noreferrer">
              Source on GitHub
            </a>
            <span className="foot__dot">/</span>
            <a href="https://github.com/awaiskhan64bit/keyboard-atlas/blob/main/src/data/keyboards.ts" rel="noreferrer">
              Add a board
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
