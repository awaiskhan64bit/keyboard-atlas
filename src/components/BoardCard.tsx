import { useState } from 'react';
import type { Keyboard } from '../data/keyboards';
import { LAYOUTS } from '../data/layouts';
import { colourwaysFor, photosFor } from '../data/photos';
import { links } from '../route';

export default function BoardCard({ kb }: { kb: Keyboard }) {
  const stockPhoto = photosFor(kb.id)[0];
  const alts = colourwaysFor(kb.id);
  const [currentPhoto, setCurrentPhoto] = useState(stockPhoto);
  const [activeColourName, setActiveColourName] = useState<string | null>(null);

  return (
    <article className="card">
      <a className="card__media" href={links.board(kb.id)}>
        {currentPhoto ? (
          <img src={currentPhoto} alt={`${kb.brand} ${kb.model}`} loading="lazy" decoding="async" />
        ) : (
          <span className="card__blank">{kb.brand}</span>
        )}
        {kb.price ? <span className="card__price">${kb.price}</span> : null}
        <span className="card__kind-badge">{kb.kind}</span>
      </a>

      <div className="card__body">
        <div className="card__header">
          <span className="card__brand">{kb.brand}</span>
          <span className="card__layout">{LAYOUTS[kb.layout].name}</span>
        </div>
        <h3 className="card__name">
          <a href={links.board(kb.id)}>{kb.model}</a>
        </h3>
        <p className="card__switch">
          <span className="card__switch-dot" />
          {kb.switchName}
        </p>

        {activeColourName ? (
          <p className="card__colourway-name">{activeColourName}</p>
        ) : (
          <p className="card__colourway-name card__colourway-name--muted">
            {alts.length > 0 ? `${alts.length + 1} colourways available` : 'Standard edition'}
          </p>
        )}
      </div>

      <div className="card__foot">
        {alts.length > 0 ? (
          <div className="card__swatches" aria-label="Available colourways">
            <button
              type="button"
              className="swatch-btn"
              data-active={currentPhoto === stockPhoto}
              onClick={() => {
                setCurrentPhoto(stockPhoto);
                setActiveColourName('Stock edition');
              }}
              title="Stock edition"
            >
              <i style={{ background: kb.cap.base, border: `1px solid ${kb.cap.mod}` }} />
            </button>
            {alts.map((a) => (
              <button
                key={a.name}
                type="button"
                className="swatch-btn"
                data-active={currentPhoto === a.src}
                onClick={() => {
                  setCurrentPhoto(a.src);
                  setActiveColourName(a.name);
                }}
                onMouseEnter={() => {
                  setCurrentPhoto(a.src);
                  setActiveColourName(a.name);
                }}
                title={a.name}
              >
                <i style={{ background: `linear-gradient(135deg, ${a.swatch[0]} 50%, ${a.swatch[1]} 50%)` }} />
              </button>
            ))}
          </div>
        ) : (
          <div className="dots" aria-hidden="true">
            <i style={{ background: kb.cap.base }} />
            <i style={{ background: kb.cap.mod }} />
            {kb.accent ? <i style={{ background: kb.accent }} /> : null}
          </div>
        )}

        <a className="card__go btn btn--sm" href={links.board(kb.id)}>
          Showcase
        </a>
      </div>
    </article>
  );
}
