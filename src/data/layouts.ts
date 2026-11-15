// Layout data. Widths are in key units (1u = one 1u keycap). Rows are padded to
// each block's width so every board renders as a rectangle.

type Token = string | [string, number, number?];

export type BuiltKey = {
  id: string;
  main: string;
  top?: string;
  code: string;
  w: number;
  h: number;
  x: number;
  y: number;
};

export type Layout = {
  id: string;
  name: string;
  cols: number;
  rows: number;
  keys: BuiltKey[];
};

type Block = { at: [number, number]; w: number; rows: Token[][] };

const NAMED: Record<string, [string, string]> = {
  esc: ['Escape', 'Esc'],
  bksp: ['Backspace', 'Backspace'],
  tab: ['Tab', 'Tab'],
  caps: ['CapsLock', 'Caps'],
  enter: ['Enter', 'Enter'],
  space: ['Space', ''],
  lshift: ['ShiftLeft', 'Shift'],
  rshift: ['ShiftRight', 'Shift'],
  lctrl: ['ControlLeft', 'Ctrl'],
  rctrl: ['ControlRight', 'Ctrl'],
  lalt: ['AltLeft', 'Alt'],
  ralt: ['AltRight', 'Alt'],
  win: ['MetaLeft', 'Win'],
  menu: ['ContextMenu', 'Menu'],
  fn: ['Fn', 'Fn'],
  prtsc: ['PrintScreen', 'PrtSc'],
  scrlk: ['ScrollLock', 'ScrLk'],
  pause: ['Pause', 'Pause'],
  ins: ['Insert', 'Ins'],
  home: ['Home', 'Home'],
  pgup: ['PageUp', 'PgUp'],
  del: ['Delete', 'Del'],
  end: ['End', 'End'],
  pgdn: ['PageDown', 'PgDn'],
  up: ['ArrowUp', '\u2191'],
  down: ['ArrowDown', '\u2193'],
  left: ['ArrowLeft', '\u2190'],
  right: ['ArrowRight', '\u2192'],
  num: ['NumLock', 'Num'],
  nenter: ['NumpadEnter', 'Enter'],
  nadd: ['NumpadAdd', '+'],
  nsub: ['NumpadSubtract', '\u2212'],
  nmul: ['NumpadMultiply', '*'],
  ndiv: ['NumpadDivide', '/'],
  ndot: ['NumpadDecimal', '.'],
};

for (let i = 1; i <= 12; i++) NAMED[`f${i}`] = [`F${i}`, `F${i}`];
for (let i = 0; i <= 9; i++) NAMED[`n${i}`] = [`Numpad${i}`, String(i)];

const PUNCT: Record<string, [string, string]> = {
  '`': ['Backquote', '`'],
  '-': ['Minus', '-'],
  '=': ['Equal', '='],
  '[': ['BracketLeft', '['],
  ']': ['BracketRight', ']'],
  '\\': ['Backslash', '\\'],
  ';': ['Semicolon', ';'],
  "'": ['Quote', "'"],
  ',': ['Comma', ','],
  '.': ['Period', '.'],
  '/': ['Slash', '/'],
};

const GAP = '_';

const tokenWidth = (t: Token) => (typeof t === 'string' ? 1 : t[1]);
const isGap = (t: Token) => (typeof t === 'string' ? t === GAP : t[0] === GAP);

function describe(t: Token) {
  const raw = typeof t === 'string' ? t : t[0];
  // A literal pipe cannot be written as the second half of a pair, so the
  // backslash key is spelled out.
  if (raw === '\\|') return { main: '\\', top: '|', code: 'Backslash' };
  // Width variants like ['bksp', 2] still need their real legend and code.
  if (NAMED[raw]) {
    const [code, label] = NAMED[raw];
    return { main: label, code };
  }
  if (PUNCT[raw]) {
    const [code, label] = PUNCT[raw];
    return { main: label, code };
  }
  const [main, top] = raw.split('|');
  if (PUNCT[main]) return { main, top, code: PUNCT[main][0] };
  if (/^[a-z]$/.test(main)) return { main: main.toUpperCase(), code: `Key${main.toUpperCase()}` };
  if (/^[0-9]$/.test(main)) return { main, top, code: `Digit${main}` };
  return { main, top, code: `KEY_${main}` };
}

function build(id: string, name: string, cols: number, rows: number, blocks: Block[]): Layout {
  const keys: BuiltKey[] = [];
  let n = 0;
  for (const block of blocks) {
    block.rows.forEach((row, ry) => {
      let x = block.at[0];
      const y = block.at[1] + ry;
      const total = row.reduce((sum, t) => sum + tokenWidth(t), 0);
      // Rows that come up short get the remainder on the last real key, so a
      // board never renders ragged on the right.
      const slack = block.w - total;
      const last = row.length - 1;
      row.forEach((t, i) => {
        let w = tokenWidth(t);
        const h = typeof t === 'string' ? 1 : (t[2] ?? 1);
        if (i === last && slack > 0 && !isGap(t)) w += slack;
        if (!isGap(t)) keys.push({ id: `${id}-${n++}`, ...describe(t), w, h, x, y });
        x += w;
      });
    });
  }
  return { id, name, cols, rows, keys };
}

const digits: Token[] = ['1|!', '2|@', '3|#', '4|$', '5|%', '6|^', '7|&', '8|*', '9|(', '0|)', '-|_', '=|+'];
const letters = (s: string): Token[] => s.split('');
const qwerty = letters('qwertyuiop');
const home = letters('asdfghjkl');
const bottom = letters('zxcvbnm');
const numpadTop: Token[] = ['num', 'ndiv', 'nmul', 'nsub'];

const row60: Token[][] = [
  ['esc', ...digits, ['bksp', 2]],
  [['tab', 1.5], ...qwerty, '[|{', ']|}', ['\\|', 1.5]],
  [['caps', 1.75], ...home, ';|:', "'|\"", ['enter', 2.25]],
  [['lshift', 2.25], ...bottom, ',|<', '.|>', '/|?', ['rshift', 2.75]],
  [['lctrl', 1.25], ['win', 1.25], ['lalt', 1.25], ['space', 6.25], ['ralt', 1.25], ['fn', 1.25], ['menu', 1.25], ['rctrl', 1.25]],
];

// Boards with a dedicated F row move Esc up there and put ` under it.
const row60NoEsc: Token[][] = [['`', ...digits, ['bksp', 2]], ...row60.slice(1)];

const main65: Token[][] = [
  ['esc', ...digits, ['bksp', 2], 'del'],
  [['tab', 1.5], ...qwerty, '[|{', ']|}', ['\\|', 1.5], 'pgup'],
  [['caps', 1.75], ...home, ';|:', "'|\"", ['enter', 2.25], 'pgdn'],
  [['lshift', 2.25], ...bottom, ',|<', '.|>', '/|?', ['rshift', 1.75], 'up', 'end'],
  [['lctrl', 1.25], ['win', 1.25], ['lalt', 1.25], ['space', 5.5], ['ralt', 1.25], ['fn', 1.25], ['rctrl', 1.25], 'left', 'down', 'right'],
];

// 75% moves Esc to the top row and makes room for the backquote key, so the
// number row starts at ` and ends on Home instead of Del.
const main75: Token[][] = [['`', ...digits, ['bksp', 2], 'home'], ...main65.slice(1)];

// 96% keeps the F row, so the number row loses Esc but keeps everything else.
const main96: Token[][] = [['`', ...digits, ['bksp', 2], 'del'], ...main65.slice(1)];

const navCluster: Token[][] = [
  ['ins', 'home', 'pgup'],
  ['del', 'end', 'pgdn'],
];

const fRowBlocks = (y: number): Block[] => [
  { at: [0, y], w: 1, rows: [['esc']] },
  { at: [2, y], w: 4, rows: [['f1', 'f2', 'f3', 'f4']] },
  { at: [6.5, y], w: 4, rows: [['f5', 'f6', 'f7', 'f8']] },
  { at: [11, y], w: 4, rows: [['f9', 'f10', 'f11', 'f12']] },
  { at: [15.5, y], w: 3, rows: [['prtsc', 'scrlk', 'pause']] },
];

export const LAYOUTS: Record<string, Layout> = {
  '60': build('60', '60%', 15, 5, [{ at: [0, 0], w: 15, rows: row60 }]),

  '65': build('65', '65%', 16, 5, [{ at: [0, 0], w: 16, rows: main65 }]),

  '75': build('75', '75%', 16, 6, [
    { at: [0, 0], w: 1, rows: [['esc']] },
    { at: [2, 0], w: 4, rows: [['f1', 'f2', 'f3', 'f4']] },
    { at: [6.5, 0], w: 4, rows: [['f5', 'f6', 'f7', 'f8']] },
    { at: [11, 0], w: 4, rows: [['f9', 'f10', 'f11', 'f12']] },
    { at: [15, 0], w: 1, rows: [['del']] },
    { at: [0, 1], w: 16, rows: main75 },
  ]),

  '96': build('96', '96%', 20, 6, [
    { at: [0, 0], w: 16, rows: [['esc', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'ins', 'home', 'end']] },
    { at: [0, 1], w: 16, rows: main96 },
    { at: [16, 1], w: 4, rows: [numpadTop] },
    { at: [16, 2], w: 4, rows: [['n7', 'n8', 'n9', ['nadd', 1, 2]]] },
    { at: [16, 3], w: 4, rows: [['n4', 'n5', 'n6', ['_', 1]]] },
    { at: [16, 4], w: 4, rows: [['n1', 'n2', 'n3', ['nenter', 1, 2]]] },
    { at: [16, 5], w: 4, rows: [[['n0', 2], 'ndot', ['_', 1]]] },
  ]),

  tkl: build('tkl', 'TKL', 18.5, 6, [
    ...fRowBlocks(0),
    { at: [0, 1], w: 15, rows: row60NoEsc },
    { at: [15.5, 1], w: 3, rows: navCluster },
    { at: [16.5, 4], w: 1, rows: [['up']] },
    { at: [15.5, 5], w: 3, rows: [['left', 'down', 'right']] },
  ]),

  full: build('full', 'Full size', 23, 6, [
    ...fRowBlocks(0),
    { at: [0, 1], w: 15, rows: row60NoEsc },
    { at: [15.5, 1], w: 3, rows: navCluster },
    { at: [16.5, 4], w: 1, rows: [['up']] },
    { at: [15.5, 5], w: 3, rows: [['left', 'down', 'right']] },
    { at: [19, 1], w: 4, rows: [numpadTop] },
    { at: [19, 2], w: 4, rows: [['n7', 'n8', 'n9', ['nadd', 1, 2]]] },
    { at: [19, 3], w: 4, rows: [['n4', 'n5', 'n6', ['_', 1]]] },
    { at: [19, 4], w: 4, rows: [['n1', 'n2', 'n3', ['nenter', 1, 2]]] },
    { at: [19, 5], w: 4, rows: [[['n0', 2], 'ndot', ['_', 1]]] },
  ]),
};

export const LAYOUT_LIST = Object.values(LAYOUTS);
