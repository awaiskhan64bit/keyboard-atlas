import type { Keyboard } from '../data/keyboards';
import { LAYOUTS } from '../data/layouts';
import { colourwaysFor, photosFor } from '../data/photos';
import { links } from '../route';

export default function BoardCard({ kb }: { kb: Keyboard }) {
  const photo = photosFor(kb.id)[0];
  const alts = colourwaysFor(kb.id);

  return (
    <a className="card" href={links.board(kb.id)}>
      <span className="card__media">
        {photo ? (
          <img src={photo} alt={`${kb.brand} ${kb.model}`} loading="lazy" decoding="async" />
        ) : (
          <span className="card__blank">{kb.brand}</span>
        )}
        {kb.price ? <span className="card__price">${kb.price}</span> : null}
      </span>
      <span className="card__body">
        <span className="card__brand">{kb.brand}</span>
        <span className="card__name">{kb.model}</span>
        <span className="card__meta">
          {LAYOUTS[kb.layout].name} / {kb.switchName}
        </span>
      </span>
      <span className="card__foot">
        {alts.length ? (
          <span className="dots" aria-label={`${alts.length + 1} colourways`}>
            {alts.map((a) => (
              <i key={a.name} style={{ background: `linear-gradient(150deg, ${a.swatch[0]} 50%, ${a.swatch[1]} 50%)` }} />
            ))}
          </span>
        ) : (
          <span className="dots" aria-hidden="true">
            <i style={{ background: kb.cap.base }} />
            <i style={{ background: kb.cap.mod }} />
            {kb.accent ? <i style={{ background: kb.accent }} /> : null}
          </span>
        )}
        <span className="card__go">Open</span>
      </span>
    </a>
  );
}
