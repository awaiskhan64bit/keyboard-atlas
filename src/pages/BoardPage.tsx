import { useEffect, useMemo, useRef, useState } from 'react';
import Board, { type RgbMode } from '../Board';
import { BY_ID, KEYBOARDS, type Keyboard } from '../data/keyboards';
import { LAYOUTS } from '../data/layouts';
import { colourwaysFor, photosFor, type Colourway } from '../data/photos';
import { switchOptionsFor, type SwitchOption } from '../data/switchOptions';
import { FAMILY, familyOf, type Palette } from '../palette';
import { links } from '../route';
import { sound, soundSetForSwitch } from '../sound';

type Props = {
  id: string;
  kb?: Keyboard;
};

const MODES: { id: RgbMode; label: string }[] = [
  { id: 'warm', label: 'Warm' },
  { id: 'wave', label: 'Wave' },
  { id: 'rainbow', label: 'Rainbow' },
  { id: 'off', label: 'Off' },
];

const CAPTURE = new Set([
  'Space',
  'Tab',
  'Backspace',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Quote',
  'Slash',
]);

export default function BoardPage({ id, kb: propKb }: Props) {
  const kb = propKb ?? BY_ID.get(id) ?? KEYBOARDS[0];
  const layout = LAYOUTS[kb.layout];

  const [mode, setMode] = useState<RgbMode>('warm');
  const [typed, setTyped] = useState(false);
  const [pressed, setPressed] = useState<ReadonlySet<string>>(() => new Set());
  const held = useRef<ReadonlySet<string>>(new Set());

  // Search in sidebar rail
  const [query, setQuery] = useState('');

  // Switch options
  const defaultSwitch: SwitchOption = useMemo(
    () => ({ name: kb.switchName, kind: kb.kind }),
    [kb.switchName, kb.kind]
  );
  const switchOptions = useMemo(
    () => switchOptionsFor(kb.id, defaultSwitch),
    [kb.id, defaultSwitch]
  );
  const [selectedSwitch, setSelectedSwitch] = useState<SwitchOption>(defaultSwitch);

  // Colourways
  const colourways = useMemo(() => colourwaysFor(kb.id), [kb.id]);
  const [selectedColourway, setSelectedColourway] = useState<Colourway | null>(null);

  // Photos
  const photos = useMemo(() => photosFor(kb.id), [kb.id]);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Palette computation
  const activePalette: Palette | undefined = useMemo(() => {
    if (!selectedColourway) return undefined;
    const key = selectedColourway.family in FAMILY ? selectedColourway.family : familyOf(selectedColourway.name);
    return FAMILY[key];
  }, [selectedColourway]);

  // Reset switch and colourway when board changes
  useEffect(() => {
    setSelectedSwitch(defaultSwitch);
    setSelectedColourway(null);
    setPhotoIndex(0);
  }, [kb.id, defaultSwitch]);

  // Update sound set when selected switch changes
  useEffect(() => {
    const set = soundSetForSwitch(selectedSwitch.name, selectedSwitch.kind);
    sound.select(set);
  }, [selectedSwitch]);

  const rows = useMemo(() => {
    const map = new Map<string, number>();
    for (const k of layout.keys) if (!map.has(k.code)) map.set(k.code, k.y);
    return map;
  }, [layout]);

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
    ['Switch', selectedSwitch.name],
    ['Feel', selectedSwitch.kind],
    ['Lighting', kb.rgb],
    ['Case', kb.caseMaterial],
    ['Mount', kb.mounting],
    ['Keycaps', kb.keycaps],
    ['Connect', kb.connect],
    ['Released', String(kb.year)],
  ];
  if (kb.price) facts.push(['Launch price', `about $${kb.price}`]);

  return (
    <div className="board-page">
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
                <a
                  key={b.id}
                  href={links.board(b.id)}
                  className="item"
                  data-active={b.id === kb.id}
                >
                  {b.model}
                  <span className="item__meta">{LAYOUTS[b.layout].name}</span>
                </a>
              ))}
            </div>
          ))}
        </aside>

        <div className="main">
          <nav className="crumb crumb--board">
            <a href={links.home}>All boards</a>
            <span className="crumb__sep">/</span>
            <a href={links.brand(kb.brand)}>{kb.brand}</a>
            <span className="crumb__sep">/</span>
            <span className="crumb__cur">{kb.model}</span>
          </nav>

          <section className="stage">
            <div className="stage__head">
              <div>
                <h1>
                  {kb.brand} {kb.model}
                </h1>
                <p className="stage__meta">
                  {layout.name} / {selectedSwitch.name} ({selectedSwitch.kind})
                </p>
              </div>

              <div className="stage__controls">
                <div className="seg" role="group" aria-label="Lighting mode">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      data-active={mode === m.id}
                      onClick={() => setMode(m.id)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Board
              kb={kb}
              layout={layout}
              mode={mode}
              pressed={pressed}
              onPress={hold}
              onRelease={loose}
              palette={activePalette}
            />

            <p className="hint">
              {typed
                ? 'Typing registered. Click switches or colourways below to hear differences.'
                : 'Press any key on your physical keyboard or click caps to hear real recordings'}
            </p>

            <div className="customizer">
              {switchOptions.length > 1 ? (
                <div className="customizer__group">
                  <span className="customizer__label">Switch options</span>
                  <div className="customizer__options">
                    {switchOptions.map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        className="chip"
                        data-on={selectedSwitch.name === s.name}
                        onClick={() => setSelectedSwitch(s)}
                      >
                        {s.name}
                        <span className="customizer__badge">{s.kind}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {colourways.length > 0 ? (
                <div className="customizer__group">
                  <span className="customizer__label">Colourways</span>
                  <div className="customizer__options">
                    <button
                      type="button"
                      className="chip"
                      data-on={selectedColourway === null}
                      onClick={() => setSelectedColourway(null)}
                    >
                      Stock
                    </button>
                    {colourways.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        className="chip chip--swatch"
                        data-on={selectedColourway?.name === c.name}
                        onClick={() => setSelectedColourway(c)}
                        title={c.name}
                      >
                        <span
                          className="swatch-bubble"
                          style={{
                            background: `linear-gradient(135deg, ${c.swatch[0]} 50%, ${c.swatch[1]} 50%)`,
                          }}
                        />
                        {c.name.length > 32 ? `${c.name.slice(0, 32)}...` : c.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          {photos.length > 0 ? (
            <section className="board-photos">
              <header className="board-photos__head">
                <h2>Product photography</h2>
                <p className="section__note">
                  Real pictures of this keyboard. Photo {photoIndex + 1} of {photos.length}.
                </p>
              </header>

              <div className="board-photos__view">
                <figure className="board-photos__main">
                  <img
                    src={photos[photoIndex]}
                    alt={`${kb.brand} ${kb.model}`}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                {photos.length > 1 ? (
                  <div className="board-photos__thumbs">
                    {photos.map((src, idx) => (
                      <button
                        key={src + idx}
                        type="button"
                        className="board-photos__thumb"
                        data-active={idx === photoIndex}
                        onClick={() => setPhotoIndex(idx)}
                      >
                        <img src={src} alt="" loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          <section className="specs">
            <header className="specs__header">
              <h2>Specifications & Notes</h2>
            </header>
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
              Specs are approximate and edited by contributors. Switch audio comes from kbsim recordings of matching switch classes.
            </p>
          </section>

          <section className="related-brand">
            <div className="related-brand__box">
              <div>
                <h3>Explore more from {kb.brand}</h3>
                <p>
                  View all boards, company background, and catalog entries for {kb.brand}.
                </p>
              </div>
              <a className="btn btn--ghost" href={links.brand(kb.brand)}>
                View {kb.brand} collection
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
