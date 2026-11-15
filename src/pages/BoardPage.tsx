import { useEffect, useMemo, useRef, useState } from 'react';
import Board, { type RgbMode } from '../Board';
import BrandLogo from '../components/BrandLogo';
import { BY_ID, KEYBOARDS, type Keyboard } from '../data/keyboards';
import { LAYOUTS } from '../data/layouts';
import { colourwaysFor, photosFor, SWITCH_PHOTOS, type Colourway } from '../data/photos';
import { switchOptionsFor, type SwitchOption } from '../data/switchOptions';
import { FAMILY, familyOf, type Palette } from '../palette';
import { links } from '../route';
import { sound, soundSetForSwitch } from '../sound';

type Props = {
  id: string;
  kb?: Keyboard;
};

const MODES: { id: RgbMode; label: string }[] = [
  { id: 'warm', label: 'Warm Glow' },
  { id: 'wave', label: 'Breathing' },
  { id: 'rainbow', label: 'Spectrum' },
  { id: 'off', label: 'Lighting Off' },
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
  const [activePhoto, setActivePhoto] = useState<string>(photos[0] ?? '');

  // Reset switch and colourway when board changes
  useEffect(() => {
    setSelectedSwitch(defaultSwitch);
    setSelectedColourway(null);
    setActivePhoto(photos[0] ?? '');
  }, [kb.id, defaultSwitch, photos]);

  // Palette computation based on active colourway
  const activePalette: Palette | undefined = useMemo(() => {
    if (!selectedColourway) return undefined;
    const key = selectedColourway.family in FAMILY ? selectedColourway.family : familyOf(selectedColourway.name);
    return FAMILY[key];
  }, [selectedColourway]);

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

  // Macro photo for current switch
  const switchPhoto = useMemo(() => {
    const sName = selectedSwitch.name.toLowerCase();
    if (sName.includes('graywood')) return SWITCH_PHOTOS['graywood']?.[0];
    if (sName.includes('reaper')) return SWITCH_PHOTOS['reaper']?.[0];
    if (sName.includes('ice vein')) return SWITCH_PHOTOS['icevein']?.[0];
    if (sName.includes('star vector')) return SWITCH_PHOTOS['starvector']?.[0];
    return SWITCH_PHOTOS[selectedSwitch.kind]?.[0] ?? SWITCH_PHOTOS['linear']?.[0];
  }, [selectedSwitch]);

  const isAula = kb.brand === 'Aula';

  const facts: [string, string][] = [
    ['Layout', layout.name],
    ['Current switch', selectedSwitch.name],
    ['Switch feel', selectedSwitch.kind],
    ['Backlight', kb.rgb],
    ['Case material', kb.caseMaterial],
    ['Mounting style', kb.mounting],
    ['Keycaps profile', kb.keycaps],
    ['Connectivity', kb.connect],
    ['Release year', String(kb.year)],
  ];
  if (kb.price) facts.push(['Approx price', `$${kb.price}`]);

  return (
    <div className="board-page">
      <div className="shell">
        <aside className="rail">
          <div className="rail__head">
            <span className="rail__title">Catalog Explorer</span>
            <span className="badge badge--sm badge--red">{KEYBOARDS.length}</span>
          </div>
          <input
            className="search"
            type="search"
            placeholder="Search by brand or model..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search keyboards"
          />
          {groups.length === 0 ? <p className="empty">No keyboards found.</p> : null}
          {groups.map(([brand, boards]) => (
            <div className="group" key={brand}>
              <div className="group__header">
                <BrandLogo brand={brand} size={16} />
                <span className="group__name">{brand}</span>
              </div>
              {boards.map((b) => (
                <a
                  key={b.id}
                  href={links.board(b.id)}
                  className="item"
                  data-active={b.id === kb.id}
                >
                  <span className="item__name">{b.model}</span>
                  <span className="item__meta">{LAYOUTS[b.layout].name}</span>
                </a>
              ))}
            </div>
          ))}
        </aside>

        <div className="main">
          <nav className="crumb crumb--board">
            <a href={links.home}>Home</a>
            <span className="crumb__sep">/</span>
            <a href={links.brand(kb.brand)}>{kb.brand}</a>
            <span className="crumb__sep">/</span>
            <span className="crumb__cur">{kb.model}</span>
          </nav>

          {/* Top Hardware Showcase Section */}
          <section className="showcase-hero">
            <div className="showcase-hero__meta">
              <div className="showcase-hero__brand-row">
                <BrandLogo brand={kb.brand} size={28} />
                <span className="tag tag--red">{kb.brand} Showcase</span>
                {isAula ? <span className="badge badge--red">Real YouTube Sound Test</span> : null}
              </div>
              <h1 className="showcase-hero__title">
                {kb.brand} {kb.model}
              </h1>
              <p className="showcase-hero__subtitle">
                {layout.name} Form Factor / {selectedSwitch.name} / {kb.mounting} Mount
              </p>
            </div>

            {/* Photo vs Interactive View Dual Card */}
            <div className="showcase-dual">
              {/* Photo Showcase Card */}
              <div className="showcase-card showcase-card--photo">
                <div className="showcase-card__header">
                  <span className="showcase-card__tag">Factory Hardware Photography</span>
                  <span className="showcase-card__colour-label">
                    {selectedColourway ? selectedColourway.name : 'Stock Edition'}
                  </span>
                </div>
                <div className="showcase-card__img-wrap">
                  {activePhoto ? (
                    <img src={activePhoto} alt={`${kb.brand} ${kb.model}`} loading="lazy" decoding="async" />
                  ) : (
                    <div className="card__blank">{kb.brand}</div>
                  )}
                </div>

                {/* Colourway variation buttons that update the photo AND the interactive board */}
                {colourways.length > 0 ? (
                  <div className="colourway-picker">
                    <span className="colourway-picker__title">Switch Colourway:</span>
                    <div className="colourway-picker__swatches">
                      <button
                        type="button"
                        className={`colourway-btn ${selectedColourway === null ? 'colourway-btn--active' : ''}`}
                        onClick={() => {
                          setSelectedColourway(null);
                          setActivePhoto(photos[0] ?? '');
                        }}
                      >
                        <i style={{ background: kb.cap.base }} />
                        <span>Stock</span>
                      </button>
                      {colourways.map((cw) => (
                        <button
                          key={cw.name}
                          type="button"
                          className={`colourway-btn ${selectedColourway?.name === cw.name ? 'colourway-btn--active' : ''}`}
                          onClick={() => {
                            setSelectedColourway(cw);
                            setActivePhoto(cw.src);
                          }}
                          title={cw.name}
                        >
                          <i style={{ background: `linear-gradient(135deg, ${cw.swatch[0]} 50%, ${cw.swatch[1]} 50%)` }} />
                          <span>{cw.name.split(' - ')[1]?.split(' (')[0] ?? cw.family}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Thumbnail strip */}
                {photos.length > 1 ? (
                  <div className="showcase-card__thumbs">
                    {photos.map((src, i) => (
                      <button
                        key={src + i}
                        type="button"
                        className={`thumb-btn ${activePhoto === src ? 'thumb-btn--active' : ''}`}
                        onClick={() => setActivePhoto(src)}
                      >
                        <img src={src} alt="" loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Interactive Audio & Typing Deck Card */}
              <div className="showcase-card showcase-card--interactive">
                <div className="showcase-card__header">
                  <span className="showcase-card__tag">Interactive Typing & Audio Test</span>
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

                <div className="showcase-board-wrap">
                  <Board
                    kb={kb}
                    layout={layout}
                    mode={mode}
                    pressed={pressed}
                    onPress={hold}
                    onRelease={loose}
                    palette={activePalette}
                  />
                </div>

                <p className="hint">
                  {typed
                    ? 'Keypress registered with real switch acoustics. Type freely.'
                    : 'Press any key on your physical keyboard or click the keycaps above'}
                </p>
              </div>
            </div>
          </section>

          {/* Switch Laboratory Section */}
          <section className="switch-lab-section">
            <header className="section-head">
              <span className="section-head__eyebrow">Switch Options for this model</span>
              <h2 className="section-head__title">Select Your Switch Configuration</h2>
              <p className="section-head__desc">
                Changing switches updates the acoustic audio profile and macro camera view in real time.
              </p>
            </header>

            <div className="switch-detail-card">
              <div className="switch-detail-card__media">
                {switchPhoto ? (
                  <img src={switchPhoto} alt={selectedSwitch.name} loading="lazy" decoding="async" />
                ) : null}
                <span className="switch-card__feel-tag">{selectedSwitch.kind}</span>
              </div>
              <div className="switch-detail-card__body">
                <div className="switch-detail-card__top">
                  <div>
                    <span className="switch-card__maker">{kb.brand} Factory Option</span>
                    <h3 className="switch-detail-card__title">{selectedSwitch.name}</h3>
                  </div>
                  {isAula ? <span className="badge badge--red">YouTube Verified Audio</span> : null}
                </div>

                <div className="switch-pills">
                  <span className="switch-pills__label">Select switch:</span>
                  <div className="switch-pills__list">
                    {switchOptions.map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        className={`switch-pill ${selectedSwitch.name === s.name ? 'switch-pill--active' : ''}`}
                        onClick={() => setSelectedSwitch(s)}
                      >
                        <span className="switch-pill__name">{s.name}</span>
                        <span className="switch-pill__kind">{s.kind}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="switch-detail-card__note">
                  {isAula
                    ? 'Extracted from real Aula F75 YouTube sound tests. Sliced into individual row hits, spacebars and enter keystrokes with ffmpeg.'
                    : 'Acoustics matched to real high-fidelity switch recordings.'}
                </p>
              </div>
            </div>
          </section>

          {/* Technical Specifications */}
          <section className="specs">
            <header className="specs__header">
              <h2>Factory Specifications & Architecture</h2>
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
          </section>

          {/* Related Brand Action */}
          <section className="related-brand">
            <div className="related-brand__box">
              <div className="related-brand__info">
                <BrandLogo brand={kb.brand} size={36} />
                <div>
                  <h3>Explore All {kb.brand} Keyboards</h3>
                  <p>View all {kb.brand} hardware models, custom layouts, and variations.</p>
                </div>
              </div>
              <a className="btn btn--primary" href={links.brand(kb.brand)}>
                View {kb.brand} Collection
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
