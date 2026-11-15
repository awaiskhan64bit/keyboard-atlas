# Keyboard Atlas

An open source keyboard tester and catalog for mechanical keyboards.

Pick a board from the catalog, type on it, and the keys move under your fingers. You hear the switch, not a click track. The backlight switches between warm, wave, rainbow and off. Real product photography, colourway swatches, and community-maintained specifications sit alongside each board.

Live at [keyboard-atlas.vercel.app](https://keyboard-atlas.vercel.app).

## Features

- 44 keyboards across 16 brands, from the budget Aula F75 to custom gasket boards and Topre domes
- Six layout templates: 60%, 65%, 75%, 96%, TKL and full size
- 13 sets of real switch recordings from kbsim
- Live interactive typing in the browser with full keypress audio
- Switch selector: audition the different switches a board actually ships with
- Dynamic colourways: switch colorway themes and watch the rendered board update in real time
- Real product photography and macro switch galleries
- Dedicated brand showcase pages with size filtering and specs
- Search by brand, model or switch

## Sound

Every sound comes from [kbsim](https://github.com/tplai/kbsim) by Thomas Lai, MIT licensed. Those are actual recordings of actual switches, with separate takes per row and dedicated hits for space, enter and backspace, which is why a spacebar sounds like a spacebar here.

The files were trimmed of leading silence and matched in level across sets, so switching boards does not jump in volume. Full notice in `public/sfx/LICENSE.txt`.

Each board plays the closest real recording to its switch. An Aula F75 with Graywood switches uses the Alpaca linear set. An HHKB uses the Topre set.

## Development

```bash
npm install
npm run dev
```

Build with `npm run build`, which type checks and then bundles to `dist`. There is no server, no database and no API keys required. Drop `dist` on any static host.

## Adding a board

Board data lives in `src/data/keyboards.ts`. Append an entry with the brand, model, year, layout, switch, materials and colours. `kind` drives the fallback sound, and `accentKeys` picks which keys use the accent colour.

Layouts live in `src/data/layouts.ts`. Each one is built from rows of tokens in key units, so `[['space', 6.25]]` produces a 6.25u spacebar and `_` produces a gap.

Sound selection is keyword based in `src/sound.ts`.

## Credits

See [CREDITS.md](CREDITS.md).

## License

MIT. See [LICENSE](LICENSE).
