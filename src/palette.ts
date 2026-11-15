// A colourway is a real family the board is sold in. The renderer only needs
// the cap, case and accent tones, so each family maps to one set of hex values.
// After that the animated board and the product photo agree on colour.

export type Palette = {
  base: string;
  mod: string;
  legend: string;
  case: string;
  accent: string;
};

export const FAMILY: Record<string, Palette> = {
  black: { base: '#2b2d31', mod: '#212327', legend: '#e6e1d6', case: '#17181b', accent: '#c0453a' },
  white: { base: '#f2efe8', mod: '#dfdbd2', legend: '#2c2a26', case: '#d8d3c8', accent: '#c0453a' },
  cream: { base: '#e9e2d2', mod: '#d3c9b4', legend: '#332f28', case: '#c8bfa9', accent: '#b8453a' },
  grey: { base: '#c9c6bf', mod: '#a9a69f', legend: '#2f2d2a', case: '#8e8b85', accent: '#c0453a' },
  sand: { base: '#ddd2bd', mod: '#c0b49c', legend: '#3b352b', case: '#a89c85', accent: '#a8563f' },
  green: { base: '#d7ddcb', mod: '#a9bda6', legend: '#2c352b', case: '#8fae92', accent: '#b8453a' },
  blue: { base: '#dbe3ea', mod: '#a9bdd1', legend: '#26303b', case: '#7d94ab', accent: '#b8453a' },
  red: { base: '#e7d7d3', mod: '#c9574c', legend: '#33211f', case: '#a33f36', accent: '#33211f' },
  orange: { base: '#e8ddcd', mod: '#d08a55', legend: '#3a2a1c', case: '#b06f3d', accent: '#3a2a1c' },
  rose: { base: '#e2d3d0', mod: '#c6b3af', legend: '#3a3130', case: '#b3a19d', accent: '#8f5f58' },
};

export const familyOf = (name: string): keyof typeof FAMILY => {
  const n = name.toLowerCase();
  for (const key of Object.keys(FAMILY) as (keyof typeof FAMILY)[]) if (n.includes(key)) return key;
  return 'black';
};
