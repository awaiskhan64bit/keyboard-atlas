// Sources real product photography for every board, the colourways each board
// is actually sold in, and macro shots of the switches themselves.
//
// Sources: eezepc.com (open WooCommerce Store API, features every Aula board),
// plus the product sitemaps of mechanicalkeyboards.com, keychron.com,
// gloriousgaming.com and modedesigns.com (Shopify stores that publish product
// photos in their sitemap).
//
//   node scripts/fetch-products.mjs
//
// Writes public/photos/*.jpg and src/data/photos.ts.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\//, '');
const OUT = join(ROOT, 'public', 'photos');
const MANIFEST = join(ROOT, 'src', 'data', 'photos.ts');
const CACHE = join(ROOT, 'scripts', '.sources.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const curl = (url, out) =>
  execFileSync('curl.exe', ['-sS', '-L', '--max-time', '90', '-A', UA, ...(out ? ['-o', out] : []), url], {
    encoding: out ? 'buffer' : 'utf8',
    maxBuffer: 128 * 1024 * 1024,
  });

const text = (url) => curl(url).toString();

const decode = (s) =>
  s
    .replace(/&#8211;|&#8212;|&#8216;|&#8217;|&#8220;|&#8221;/g, (m) => ({ '&#8211;': '-', '&#8212;': '-', '&#8216;': "'", '&#8217;': "'", '&#8220;': '"', '&#8221;': '"' })[m])
    .replace(/&#\d+;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const words = (s) =>
  decode(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

// ---------------------------------------------------------------- sources

async function eezepc() {
  if (existsSync(CACHE)) {
    const cached = JSON.parse(readFileSync(CACHE, 'utf8'));
    if (cached['eezepc.com']) return cached['eezepc.com'];
  }
  const out = [];
  for (const term of ['keyboard', 'switch']) {
    for (let page = 1; page <= 8; page++) {
      const url = `https://eezepc.com/wp-json/wc/store/products?per_page=100&page=${page}&search=${term}`;
      let batch;
      try {
        batch = JSON.parse(text(url));
      } catch {
        break;
      }
      if (!Array.isArray(batch) || batch.length === 0) break;
      for (const p of batch) {
        out.push({
          id: `ez-${p.id}`,
          name: decode(p.name),
          images: p.images.map((i) => i.src.replace(/-\d+x\d+(?=\.\w+$)/, '')),
          url: p.permalink,
          source: 'eezepc.com',
        });
      }
      if (batch.length < 100) break;
      await pause(700);
    }
  }
  saveCache('eezepc.com', out);
  return out;
}

function saveCache(key, rows) {
  const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
  cache[key] = rows;
  writeFileSync(CACHE, JSON.stringify(cache));
}

async function shopify(host) {
  const cacheKey = host;
  if (existsSync(CACHE)) {
    const cached = JSON.parse(readFileSync(CACHE, 'utf8'));
    if (cached[cacheKey]) return cached[cacheKey];
  }
  const out = [];
  let xml = '';
  try {
    xml = text(`https://${host}/sitemap_products_1.xml?from=1&to=9999999999999`);
  } catch {
    return out;
  }
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  for (const block of blocks) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(block)?.[1];
    const img = /<image:loc>([^<]+)<\/image:loc>/.exec(block)?.[1];
    const title = /<image:title>([^<]*)<\/image:title>/.exec(block)?.[1];
    if (!loc || !img) continue;
    const handle = loc.split('/products/')[1] ?? '';
    out.push({
      id: `${host}-${handle}`,
      name: decode(title || handle.replace(/-/g, ' ')),
      images: [img.replace(/\?.*$/, '')],
      url: loc,
      source: host,
    });
  }
  saveCache(host, out);
  return out;
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function allSources() {
  const parts = await Promise.all([
    eezepc(),
    shopify('www.keychron.com'),
    shopify('mechanicalkeyboards.com'),
    shopify('www.gloriousgaming.com'),
    shopify('modedesigns.com'),
    shopify('cannonkeys.com'),
    shopify('www.divinikey.com'),
    shopify('deskhero.ca'),
    shopify('www.mechbox.co.uk'),
    shopify('novelkeys.com'),
    shopify('keebsforall.com'),
  ]);
  const rows = parts.flat();
  return rows;
}

// ---------------------------------------------------------------- matching

function boards() {
  const src = readFileSync(join(ROOT, 'src', 'data', 'keyboards.ts'), 'utf8');
  const out = [];
  const re = /id: '([^']+)',\s*brand: '([^']+)',\s*model: '([^']+)',[\s\S]*?kind: '(linear|tactile|clicky|topre|silent|membrane)'/g;
  let m;
  while ((m = re.exec(src))) out.push({ id: m[1], brand: m[2], model: m[3], kind: m[4] });
  return out;
}

const EXTRA = ['he', 'max', 'ultra', 'rt', 'v2', 'v3', 'mini', 'air', 'pro', 'plus', 'gen'];

// A brand is sometimes known by its product line rather than its own name.
const BRAND_WORDS = {
  PFU: ['pfu', 'hhkb'],
  Topre: ['topre', 'realforce'],
  Mode: ['mode', 'modedesigns', 'sonnet'],
  Glorious: ['glorious', 'gmmk'],
  SteelSeries: ['steelseries', 'apex'],
};

const LAYOUT_OK = {
  '60': ['60', '61', '64', '68', 'mini'],
  '65': ['65', '67', '68'],
  '75': ['75', '81', '84'],
  '96': ['96', '98', '99', '1800'],
  tkl: ['tkl', 'tenkeyless', '87', '88'],
  full: ['full', '104', '108'],
};

const MARKERS = ['60', '61', '64', '65', '67', '68', '75', '81', '84', '87', '88', '96', '98', '99', '104', '108', 'tkl', 'tenkeyless', 'numpad', 'full'];

const NOT_A_BOARD = /keycap|switch set|switches|switch puller|lube|deskmat|wrist|artisan|stabiliz|gasket|plate|foam|cable|coiled|bag|sleeve/i;

function match(board, product, model = board.model) {
  if (NOT_A_BOARD.test(product.name)) return -1;
  const name = new Set(words(product.name));
  const brands = BRAND_WORDS[board.brand] ?? [words(board.brand)[0]];
  const hostBrand = product.source.startsWith(words(board.brand)[0].replace(/\s/g, ''));
  if (!brands.some((b) => name.has(b)) && !hostBrand) return -1;
  const tokens = words(model);
  for (const t of tokens) if (!name.has(t)) return -1;

  // A listing that names a different layout is a different board.
  const ok = LAYOUT_OK[board.layout] ?? [];
  for (const marker of MARKERS) {
    if (name.has(marker) && !ok.includes(marker)) return -1;
  }

  let score = 20 + tokens.length * 6;
  for (const extra of EXTRA) {
    if (name.has(extra) && !tokens.includes(extra)) score -= 9;
  }
  score -= Math.max(0, name.size - tokens.length - 2) * 0.4;
  return score;
}

// "F75 Pro" when only the F75 is listed: same shell, and better than no photo.
const rootOf = (model) => {
  const tokens = words(model);
  const drop = new Set(['pro', 'plus', 'v1', 'v2', 'v3', 'sf', 'mk', '2', '3']);
  const trimmed = tokens.filter((t) => !drop.has(t));
  return trimmed.length ? trimmed : tokens;
};

// ---------------------------------------------------------------- images

const slugFile = (id, n) => `${id}-${n}.jpg`;

function download(url, dest) {
  if (existsSync(dest) && readFileSync(dest).length > 15000) return true;
  const raw = join(OUT, '.raw');
  try {
    curl(url, raw);
    if (!existsSync(raw) || readFileSync(raw).length < 15000) return false;
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-vf', "scale='min(1600,iw)':-2", '-q:v', '3', dest], {
      stdio: 'pipe',
    });
    return true;
  } catch {
    return false;
  } finally {
    if (existsSync(raw)) unlinkSync(raw);
  }
}

function productPageImages(url, host) {
  try {
    const html = text(url);
    const found = new Set();
    for (const m of html.matchAll(/https?:\/\/cdn\.shopify\.com\/s\/files\/[^"'\\ ]+?\.(?:jpg|jpeg|png|webp)/g)) {
      const clean = m[0].replace(/\?.*$/, '');
      if (/_(icon|small|thumb|compact|pico|grande|medium|large|x?[\d]+x[\d]*)\./i.test(clean)) continue;
      found.add(clean);
      if (found.size >= 4) break;
    }
    return [...found];
  } catch {
    return [];
  }
}

const COLOURS = [
  ['thunder black', ['#2a2c30', '#3a3d44']],
  ['black', ['#232529', '#34373d']],
  ['white', ['#f1eee6', '#dcd8ce']],
  ['cream', ['#e9e2d2', '#d4cbb6']],
  ['grey', ['#c9c6bf', '#a9a69f']],
  ['gray', ['#c9c6bf', '#a9a69f']],
  ['green', ['#8fae92', '#6f8f74']],
  ['blue', ['#8fa8c4', '#6d86a3']],
  ['red', ['#c9574c', '#a33f36']],
  ['orange', ['#d08a55', '#b06f3d']],
  ['yellow', ['#d9c276', '#b8a15a']],
  ['sand', ['#ddd2bd', '#c0b49c']],
  ['mint', ['#a9c9bb', '#87ab9c']],
  ['pink', ['#e0c3c3', '#c5a5a5']],
  ['rose', ['#e2d3d0', '#c6b3af']],
  ['purple', ['#b9a9c9', '#9a89ab']],
];

function colourway(name) {
  const n = name.toLowerCase();
  for (const [needle, swatch] of COLOURS) if (n.includes(needle)) return { swatch, family: needle.split(' ').pop() };
  return null;
}

// ---------------------------------------------------------------- run

const rows = await allSources();
const catalogBoards = boards();
mkdirSync(OUT, { recursive: true });

const PHOTOS = {};
const COLOURWAYS = {};
const CREDITS = [];
const report = [];

for (const board of catalogBoards) {
  let ranked = rows
    .map((p) => ({ p, s: match(board, p) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);

  let closest = false;
  if (!ranked.length) {
    const root = rootOf(board.model).join(' ');
    ranked = rows
      .map((p) => ({ p, s: match(board, p, root) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s);
    closest = ranked.length > 0;
  }

  if (!ranked.length) {
    report.push(`${board.id.padEnd(28)} none`);
    continue;
  }

  const best = ranked[0].p;
  let images = [...best.images];
  // Shopify sitemaps list one photo per product; the page itself has the rest.
  if (images.length === 1 && best.source.endsWith('.com') && best.source !== 'eezepc.com') {
    images = [...images, ...productPageImages(best.url, best.source)];
  }

  const kept = [];
  for (const src of images.slice(0, 4)) {
    const file = slugFile(board.id, kept.length + 1);
    if (!download(src, join(OUT, file))) continue;
    kept.push(`/photos/${file}`);
  }
  if (!kept.length) {
    report.push(`${board.id.padEnd(28)} download failed`);
    continue;
  }
  PHOTOS[board.id] = kept;
  CREDITS.push({ board: board.id, title: decode(best.name), source: best.url, host: best.source });

  const variants = [];
  for (const { p } of ranked.slice(1, 9)) {
    const cw = colourway(p.name);
    if (!cw || !p.images[0]) continue;
    const name = decode(p.name).replace(new RegExp(`^${board.brand}\\s*`, 'i'), '').slice(0, 60);
    if (variants.some((v) => v.name === name)) continue;
    const file = `${board.id}-alt-${variants.length + 1}.jpg`;
    if (!download(p.images[0], join(OUT, file))) continue;
    variants.push({ name, family: cw.family, swatch: cw.swatch, src: `/photos/${file}`, source: p.url });
    if (variants.length >= 4) break;
  }
  if (variants.length) COLOURWAYS[board.id] = variants;

  report.push(`${board.id.padEnd(28)} ${kept.length} photo(s) ${variants.length} alt ${closest ? 'closest ' : ''} <- ${decode(best.name).slice(0, 52)}`);
}

// Switch macros: any product whose name reads like a switch set.
const SWITCHES = {};
for (const p of rows) {
  const n = p.name.toLowerCase();
  if (!/switch/.test(n) || /puller|tester|film|lube|tool/.test(n)) continue;
  const kind = /topre|dome|capacitive/.test(n)
    ? 'topre'
    : /blue|green|clicky|jade|navy/.test(n)
      ? 'clicky'
      : /brown|tactile|purple|orange|banana/.test(n)
        ? 'tactile'
        : 'linear';
  if (!p.images[0]) continue;
  SWITCHES[kind] ??= [];
  if (SWITCHES[kind].length >= 2) continue;
  const file = `switch-${kind}-${SWITCHES[kind].length + 1}.jpg`;
  if (!download(p.images[0], join(OUT, file))) continue;
  SWITCHES[kind].push(`/photos/${file}`);
  CREDITS.push({ board: `switch-${kind}`, title: decode(p.name), source: p.url, host: p.source });
}

writeFileSync(
  MANIFEST,
  `// Generated by scripts/fetch-products.mjs. Real product photography of the
// boards, their colourways and the switches. See CREDITS.md for every source.

export type Colourway = {
  name: string;
  family: string;
  swatch: [string, string];
  src: string;
  source: string;
};

export const BOARD_PHOTOS: Record<string, string[]> = ${JSON.stringify(PHOTOS, null, 2)};

export const BOARD_COLOURWAYS: Record<string, Colourway[]> = ${JSON.stringify(COLOURWAYS, null, 2)};

export const SWITCH_PHOTOS: Record<string, string[]> = ${JSON.stringify(SWITCHES, null, 2)};

export const PHOTO_CREDITS = ${JSON.stringify(CREDITS, null, 2)};

export const photosFor = (id: string): string[] => BOARD_PHOTOS[id] ?? [];
export const colourwaysFor = (id: string): Colourway[] => BOARD_COLOURWAYS[id] ?? [];
`,
);

console.log(report.join('\n'));
console.log(`\n${Object.keys(PHOTOS).length}/${catalogBoards.length} boards with photos`);
console.log(`switch families: ${Object.keys(SWITCHES).join(', ')}`);
