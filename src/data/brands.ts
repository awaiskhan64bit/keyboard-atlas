// Brand notes for the landing grid and the brand pages. Short on purpose: one
// sentence about what the brand is known for, plus where it is made.

export type BrandMeta = {
  country: string;
  founded: number;
  blurb: string;
};

export const BRAND_META: Record<string, BrandMeta> = {
  Akko: { country: 'China', founded: 2016, blurb: 'Colourful keycap sets and smooth CS switches at prices that made custom boards normal.' },
  Aula: { country: 'China', founded: 2004, blurb: 'The budget board specialists. Thick foam, gasket mounts and a knob for under a hundred dollars.' },
  Corsair: { country: 'United States', founded: 1994, blurb: 'Brushed aluminium, exposed switch plates and software that runs the whole desk.' },
  Ducky: { country: 'Taiwan', founded: 2008, blurb: 'The boards that convinced a generation to pay for PBT instead of plastic shine.' },
  Glorious: { country: 'United States', founded: 2014, blurb: 'Started as group buys, ended up building one of the first mainstream gasket kits.' },
  Keychron: { country: 'Hong Kong', founded: 2017, blurb: 'Mac keys in the box, aluminium cases and a layout for every desk.' },
  Leopold: { country: 'South Korea', founded: 2006, blurb: 'No lighting, no software, just thick PBT and one of the most respected sound signatures.' },
  Logitech: { country: 'Switzerland', founded: 1981, blurb: 'Low profile wireless boards that sit closer to a laptop than to a custom build.' },
  Mode: { country: 'United States', founded: 2020, blurb: 'Bare cases for people who already know which switch they want.' },
  NuPhy: { country: 'China', founded: 2021, blurb: 'Low profile boards thin enough to carry, styled like nothing else in the price range.' },
  PFU: { country: 'Japan', founded: 1989, blurb: 'The company that keeps the HHKB alive, one 60 percent layout at a time.' },
  Razer: { country: 'Singapore', founded: 2005, blurb: 'Optical and analog switches, loud by design and lit from every edge.' },
  SteelSeries: { country: 'Denmark', founded: 2001, blurb: 'Adjustable actuation per key, aimed squarely at competitive play.' },
  Topre: { country: 'Japan', founded: 1982, blurb: 'Rubber domes over conical springs. The thock everything else is compared to.' },
  Varmilo: { country: 'China', founded: 2012, blurb: 'Heavy case, thick caps, and printing that made mechanical boards look like stationery.' },
  Wooting: { country: 'Netherlands', founded: 2015, blurb: 'Hall effect switches that measure travel, so a key can be as light or as heavy as you like.' },
};
