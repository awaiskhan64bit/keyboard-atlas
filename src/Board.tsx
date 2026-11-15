import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Layout } from './data/layouts';
import type { Keyboard } from './data/keyboards';

export type RgbMode = 'warm' | 'spectrum' | 'reactive' | 'off';

type Props = {
  kb: Keyboard;
  layout: Layout;
  mode: RgbMode;
  pressed: ReadonlySet<string>;
  onPress: (code: string, row: number) => void;
  onRelease: (code: string) => void;
};

const inkOn = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 142 ? '#1b1a17' : '#f2efe8';
};

export default function Board({ kb, layout, mode, pressed, onPress, onRelease }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const [unit, setUnit] = useState(36);

  // Key size comes from the space available, so a full size board shrinks
  // instead of overflowing. Half a unit of case padding on each side.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const fit = () => setUnit(Math.max(11, Math.min(56, el.clientWidth / (layout.cols + 1))));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout.cols]);

  useEffect(() => {
    if (mode !== 'spectrum') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = deck.current;
    if (!el) return;
    let raf = 0;
    const from = performance.now();
    const tick = (now: number) => {
      el.style.setProperty('--t', ((now - from) * 0.05).toFixed(2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.style.removeProperty('--t');
    };
  }, [mode]);

  const accentKeys = kb.accentKeys ?? [];

  return (
    <div className="board" ref={host}>
      <div
        className={`deck mode-${mode}`}
        ref={deck}
        data-nolight={kb.rgb === 'None' ? '1' : undefined}
        style={{ '--u': `${unit}px`, '--case': kb.caseColor } as CSSProperties}
      >
        <div
          className="keys"
          style={{
            gridTemplateColumns: `repeat(${layout.cols * 4}, 1fr)`,
            gridAutoRows: `${unit}px`,
            width: `${layout.cols * unit}px`,
          }}
        >
          {layout.keys.map((k, i) => {
            const lit = kb.accent && accentKeys.includes(k.code);
            const cap = lit ? kb.accent! : k.main.length > 1 ? kb.cap.mod : kb.cap.base;
            const wide = k.w >= 1.5 && k.main.length > 1;
            return (
              <div
                key={k.id}
                className="k"
                data-on={pressed.has(k.code) ? '1' : undefined}
                data-wide={wide ? '1' : undefined}
                style={
                  {
                    gridColumn: `${Math.round(k.x * 4) + 1} / span ${Math.round(k.w * 4)}`,
                    gridRow: `${k.y + 1} / span ${k.h}`,
                    '--cap': cap,
                    '--legend': lit ? inkOn(cap) : kb.cap.legend,
                    '--i': i,
                  } as CSSProperties
                }
                onPointerDown={() => onPress(k.code, k.y)}
                onPointerUp={() => onRelease(k.code)}
                onPointerLeave={() => onRelease(k.code)}
              >
                <span className="k__leg">
                  {k.top ? <span className="k__top">{k.top}</span> : null}
                  <span className="k__main">{k.main}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
