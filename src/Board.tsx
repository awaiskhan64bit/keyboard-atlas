import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Layout } from './data/layouts';
import type { Keyboard } from './data/keyboards';
import type { Palette } from './palette';

export type RgbMode = 'warm' | 'wave' | 'rainbow' | 'off';

type Props = {
  kb: Keyboard;
  layout: Layout;
  mode: RgbMode;
  pressed: ReadonlySet<string>;
  onPress: (code: string, row: number) => void;
  onRelease: (code: string) => void;
  palette?: Palette;
};

// Every hue in the lit range skips 240 to 320, so no board ever glows violet.
const HUES = [8, 22, 38, 52, 96, 148, 186, 214];

const inkOn = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 142 ? '#211f1b' : '#f6f1e6';
};

export default function Board({ kb, layout, mode, pressed, onPress, onRelease, palette }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [unit, setUnit] = useState(36);

  // Key size comes from the space available, so a full size board shrinks
  // instead of overflowing. Half a unit of case padding on each side.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const fit = () => setUnit(Math.max(9, Math.min(62, el.clientWidth / (layout.cols + 1))));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout.cols]);

  const cap = palette ?? kb.cap;
  const accent = palette?.accent ?? kb.accent;
  const caseColor = palette?.case ?? kb.caseColor;
  const accentKeys = kb.accentKeys ?? [];
  const lit = mode !== 'off' && kb.rgb !== 'None';

  return (
    <div className="board" ref={host}>
      <div
        className={`deck mode-${mode}`}
        data-lit={lit ? '1' : undefined}
        data-nolight={kb.rgb === 'None' ? '1' : undefined}
        style={{ '--u': `${unit}px`, '--case': caseColor } as CSSProperties}
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
            const touched = accent && accentKeys.includes(k.code);
            const face = touched ? accent! : k.main.length > 1 ? cap.mod : cap.base;
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
                    '--cap': face,
                    '--legend': touched ? inkOn(face) : kb.cap.legend,
                    '--i': i,
                    '--hue': HUES[i % HUES.length],
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
