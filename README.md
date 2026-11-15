# Keyboard Atlas

A keyboard tester for boards you have not bought yet.

Pick a board from the catalog, type on it, and the keys move under your fingers. You hear the switch, not a click track. The backlight changes between warm, spectrum, reactive and off. Specs sit under the board so you can see what you are actually looking at.

Live at [keyboard-atlas.vercel.app](https://keyboard-atlas.vercel.app).

## What is in it

- 44 boards from 16 brands, from the Aula F75 and Keychron Q1 to the HHKB and Realforce
- Six layout templates: 60%, 65%, 75%, 96%, TKL and full size
- 13 sets of real switch recordings
- Colourways per board: keycap colour, modifier colour, accent key and case colour
- Search by brand, model or switch

## Sound

Every sound comes from [kbsim](https://github.com/tplai/kbsim) by Thomas Lai, MIT licensed. Those are actual recordings of actual switches, with separate takes per row and dedicated hits for space, enter and backspace, which is why a spacebar sounds like a spacebar here.

The files were trimmed of leading silence and matched in level across sets, so switching boards does not jump in volume. Nothing else was changed. Full notice in `public/sfx/LICENSE.txt`.

Each board plays the closest real recording to its switch, not a recording of that exact board. An Aula F75 with Graywood switches uses the Alpaca linear set. An HHKB uses the Topre set. It is honest about being a family match.

## Run it

```bash
npm install
npm run dev
```

Build with `npm run build`, which type checks and then bundles to `dist`. There is no server, no database and no API keys. Drop `dist` on any static host.

## Add a board

Board data lives in `src/data/keyboards.ts`. Append an entry with the brand, model, year, layout, switch, materials and colours. `kind` drives the fallback sound, and `accentKeys` picks which keys use the accent colour.

Layouts live in `src/data/layouts.ts`. Each one is built from rows of tokens in key units, so `[['space', 6.25]]` produces a 6.25u spacebar and `_` produces a gap. Add a layout only if the shape is genuinely new.

Sound selection is keyword based in `src/sound.ts`, so a new switch name usually maps itself. Add a rule only when a switch does not.

## Accuracy

The board is drawn from the layout data, not traced from a photo. It is the right shape, the right row heights and the right legends for the layout, and the keycaps are coloured like the real colourway. It is not a photograph.

Specs are maintained by hand and prices are launch prices in US dollars. If something is wrong, open an issue or a pull request with a source.

Brand names appear as plain text. No manufacturer logos, no product photography.

## Credits

See [CREDITS.md](CREDITS.md).

## License

MIT. See [LICENSE](LICENSE).
