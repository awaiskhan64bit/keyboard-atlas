// The switches each board is actually sold with. A board missing from this map
// ships with just its stock switch, which is what the catalog already records.
// Selecting an option changes the recording the board plays.

import type { SwitchKind } from './keyboards';

export type SwitchOption = { name: string; kind: SwitchKind };

const linear = 'linear' as const;
const tactile = 'tactile' as const;
const clicky = 'clicky' as const;
const topre = 'topre' as const;

const AULA: SwitchOption[] = [
  { name: 'LEOBOG Graywood V3', kind: linear },
  { name: 'LEOBOG Reaper', kind: linear },
  { name: 'LEOBOG Ice Vein', kind: linear },
  { name: 'LEOBOG Star Vector', kind: linear },
  { name: 'LEOBOG Nimbus V3', kind: linear },
];

const JELLY: SwitchOption[] = [
  { name: 'Akko CS Jelly Pink', kind: linear },
  { name: 'Akko CS Jelly Purple', kind: tactile },
  { name: 'Akko CS Jelly Blue', kind: clicky },
];

const CHERRY: SwitchOption[] = [
  { name: 'Cherry MX Red', kind: linear },
  { name: 'Cherry MX Brown', kind: tactile },
  { name: 'Cherry MX Blue', kind: clicky },
  { name: 'Cherry MX Speed Silver', kind: linear },
];

export const SWITCH_OPTIONS: Record<string, SwitchOption[]> = {
  'aula-f75': AULA,
  'aula-f75-pro': AULA,
  'aula-f87-pro': AULA,
  'aula-f99': AULA,
  'aula-s98': AULA,
  'aula-f108-pro': AULA,
  'aula-f2088': [
    { name: 'Outemu Blue', kind: clicky },
    { name: 'Outemu Red', kind: linear },
    { name: 'Outemu Brown', kind: tactile },
  ],
  'aula-f3287': [
    { name: 'Outemu Red', kind: linear },
    { name: 'Outemu Blue', kind: clicky },
  ],

  'keychron-k2': [
    { name: 'Gateron Brown', kind: tactile },
    { name: 'Gateron Red', kind: linear },
    { name: 'Gateron Blue', kind: clicky },
  ],
  'keychron-q1': [
    { name: 'Gateron Pro Red', kind: linear },
    { name: 'Gateron Pro Brown', kind: tactile },
    { name: 'Gateron Pro Blue', kind: clicky },
    { name: 'Keychron K Pro Banana', kind: tactile },
  ],
  'keychron-q2': [
    { name: 'Gateron Pro Brown', kind: tactile },
    { name: 'Gateron Pro Red', kind: linear },
    { name: 'Keychron K Pro Banana', kind: tactile },
  ],
  'keychron-q3': [
    { name: 'Gateron Pro Brown', kind: tactile },
    { name: 'Gateron Pro Red', kind: linear },
    { name: 'Gateron Pro Blue', kind: clicky },
  ],
  'keychron-q6': [
    { name: 'Gateron Pro Brown', kind: tactile },
    { name: 'Gateron Pro Red', kind: linear },
    { name: 'Gateron Pro Blue', kind: clicky },
  ],
  'keychron-k8-pro': [
    { name: 'Gateron Pro Red', kind: linear },
    { name: 'Gateron Pro Brown', kind: tactile },
    { name: 'Gateron Pro Blue', kind: clicky },
  ],
  'keychron-v1': [
    { name: 'Keychron K Pro Brown', kind: tactile },
    { name: 'Keychron K Pro Red', kind: linear },
    { name: 'Keychron K Pro Banana', kind: tactile },
  ],
  'keychron-k12': [
    { name: 'Gateron Red', kind: linear },
    { name: 'Gateron Brown', kind: tactile },
    { name: 'Gateron Blue', kind: clicky },
  ],

  'razer-huntsman-mini': [
    { name: 'Razer Optical Purple', kind: clicky },
    { name: 'Razer Optical Red', kind: linear },
    { name: 'Razer Optical Analog', kind: linear },
  ],
  'razer-huntsman-v3-pro-tkl': [
    { name: 'Razer Analog Optical Gen 2', kind: linear },
    { name: 'Razer Analog Optical Gen 2 55g', kind: linear },
  ],
  'razer-blackwidow-v4-pro': [
    { name: 'Razer Green', kind: clicky },
    { name: 'Razer Yellow', kind: linear },
    { name: 'Razer Orange', kind: tactile },
  ],
  'razer-blackwidow-lite': [
    { name: 'Razer Orange', kind: tactile },
    { name: 'Razer Yellow', kind: linear },
    { name: 'Razer Green', kind: clicky },
  ],

  'logitech-g915-tkl': [
    { name: 'GL Tactile', kind: tactile },
    { name: 'GL Linear', kind: linear },
    { name: 'GL Clicky', kind: clicky },
  ],
  'logitech-g915': [
    { name: 'GL Clicky', kind: clicky },
    { name: 'GL Tactile', kind: tactile },
    { name: 'GL Linear', kind: linear },
  ],
  'logitech-g-pro-x': [
    { name: 'GX Blue', kind: clicky },
    { name: 'GX Brown', kind: tactile },
    { name: 'GX Red', kind: linear },
  ],
  'logitech-k845': [
    { name: 'Cherry MX Blue', kind: clicky },
    { name: 'Cherry MX Red', kind: linear },
    { name: 'Cherry MX Brown', kind: tactile },
  ],
  'logitech-mx-keys': [{ name: 'Scissor membrane', kind: 'membrane' }],

  'corsair-k70-mk2': CHERRY,
  'corsair-k65-mini': [
    { name: 'Cherry MX Speed Silver', kind: linear },
    { name: 'Cherry MX Red', kind: linear },
    { name: 'Cherry MX Brown', kind: tactile },
  ],
  'corsair-k100-rgb': [
    { name: 'Cherry MX Speed Silver', kind: linear },
    { name: 'Cherry MX Red', kind: linear },
    { name: 'Cherry MX Brown', kind: tactile },
  ],

  'ducky-one-3-mini': CHERRY,
  'ducky-one-3-tkl': CHERRY,
  'ducky-one-3-sf': CHERRY,
  'akko-3068b': JELLY,
  'akko-5075b': JELLY,
  'akko-mod007': JELLY,

  'nuphy-air75': [
    { name: 'Gateron Low Profile Brown', kind: tactile },
    { name: 'Gateron Low Profile Red', kind: linear },
    { name: 'Gateron Low Profile Blue', kind: clicky },
  ],
  'nuphy-air60': [
    { name: 'Gateron Low Profile Red', kind: linear },
    { name: 'Gateron Low Profile Brown', kind: tactile },
    { name: 'Gateron Low Profile Blue', kind: clicky },
  ],
  'wooting-60he': [
    { name: 'Lekker L60', kind: linear },
    { name: 'Lekker L45', kind: linear },
  ],
  'varmilo-va87m': [
    { name: 'Cherry MX Red', kind: linear },
    { name: 'Cherry MX Brown', kind: tactile },
    { name: 'Cherry MX Silent Red', kind: 'silent' },
  ],
  'leopold-fc900r': [
    { name: 'Cherry MX Brown', kind: tactile },
    { name: 'Cherry MX Red', kind: linear },
    { name: 'Cherry MX Silent Red', kind: 'silent' },
  ],
  'hhkb-professional-classic': [
    { name: 'Topre 45 g', kind: topre },
    { name: 'Topre 45 g Type-S', kind: 'silent' },
  ],
  'realforce-r2-tkl': [
    { name: 'Topre 45 g', kind: topre },
    { name: 'Topre 55 g', kind: topre },
    { name: 'Topre Variable', kind: topre },
  ],
  'mode-sonnet': [
    { name: 'Gateron Ink Black', kind: linear },
    { name: 'Gateron Ink Red', kind: linear },
    { name: 'Gateron Ink Blue', kind: clicky },
  ],
  'gmmk-pro': [
    { name: 'Glorious Fox', kind: linear },
    { name: 'Glorious Panda', kind: tactile },
    { name: 'Glorious Lynx', kind: linear },
  ],
  'steelseries-apex-pro-tkl': [{ name: 'OmniPoint Adjustable', kind: linear }],
};

export const switchOptionsFor = (id: string, fallback: SwitchOption): SwitchOption[] =>
  SWITCH_OPTIONS[id] ?? [fallback];
