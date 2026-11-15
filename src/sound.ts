// Real switch recordings, not synthesis.
//
// Source: kbsim by Thomas Lai, MIT licensed (https://github.com/tplai/kbsim).
// Each set ships per row takes plus dedicated space, enter and backspace hits,
// which is why a spacebar sounds like a spacebar here. The files in public/sfx
// had their leading silence trimmed and were level matched across sets. Nothing
// else changed. See public/sfx/LICENSE.txt.

import type { Keyboard } from './data/keyboards';

export type SoundSet =
  | 'alpaca'
  | 'blackink'
  | 'bluealps'
  | 'boxnavy'
  | 'buckling'
  | 'cream'
  | 'holypanda'
  | 'mxblack'
  | 'mxblue'
  | 'mxbrown'
  | 'redink'
  | 'topre'
  | 'turquoise';

export type BigKey = 'space' | 'enter' | 'bksp';

const SETS: SoundSet[] = [
  'alpaca',
  'blackink',
  'bluealps',
  'boxnavy',
  'buckling',
  'cream',
  'holypanda',
  'mxblack',
  'mxblue',
  'mxbrown',
  'redink',
  'topre',
  'turquoise',
];

const TAKES = ['r0', 'r1', 'r2', 'r3', 'r4', 'up', 'space', 'space-up', 'enter', 'enter-up', 'bksp', 'bksp-up'];

// Order matters: the loud and unmistakable families are matched before the
// generic "red means linear" style guesses.
const MATCH: [RegExp, SoundSet][] = [
  [/topre|scissor|membrane/i, 'topre'],
  [/buckling/i, 'buckling'],
  [/box navy/i, 'boxnavy'],
  [/blue alps/i, 'bluealps'],
  [/navy/i, 'boxnavy'],
  [/ink black|black ink/i, 'blackink'],
  [/holy panda/i, 'holypanda'],
  [/jelly purple/i, 'mxbrown'],
  [/cream/i, 'cream'],
  [/alpaca/i, 'alpaca'],
  [/turquoise/i, 'turquoise'],
  [/brown|orange|tactile/i, 'mxbrown'],
  [/purple|green|blue|clicky/i, 'mxblue'],
  [/fox|graywood/i, 'alpaca'],
  [/red|silver|linear|lekker|leobog|omnipoint/i, 'redink'],
];

const BY_KIND: Record<Keyboard['kind'], SoundSet> = {
  linear: 'redink',
  tactile: 'mxbrown',
  clicky: 'mxblue',
  topre: 'topre',
  silent: 'topre',
  membrane: 'topre',
};

export function soundSetForSwitch(switchName: string, kind?: Keyboard['kind']): SoundSet {
  for (const [re, set] of MATCH) if (re.test(switchName)) return set;
  if (kind && BY_KIND[kind]) return BY_KIND[kind];
  return 'redink';
}

/** Closest real recording to a board's switch. */
export function soundSetFor(kb: Keyboard): SoundSet {
  return soundSetForSwitch(kb.switchName, kb.kind);
}

const bigKeyOf = (code: string): BigKey | undefined =>
  code === 'Space' ? 'space' : code === 'Backspace' ? 'bksp' : code === 'Enter' || code === 'NumpadEnter' ? 'enter' : undefined;

type Bank = Map<string, AudioBuffer>;

class KeyboardSound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private banks = new Map<SoundSet, Bank>();
  private busy = new Set<SoundSet>();
  private set: SoundSet = 'mxbrown';
  private warming = false;
  enabled = true;

  /** Safe to call before any gesture. Audio only starts on the first press. */
  select(set: SoundSet) {
    this.set = set;
    if (this.ctx) void this.load(set);
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(on ? 0.5 : 0, this.ctx.currentTime, 0.01);
  }

  private boot() {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return false;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.enabled ? 0.5 : 0;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return true;
  }

  private async load(set: SoundSet) {
    if (this.banks.has(set) || this.busy.has(set) || !this.ctx) return;
    this.busy.add(set);
    const ctx = this.ctx;
    try {
      const bank: Bank = new Map();
      await Promise.all(
        TAKES.map(async (take) => {
          const res = await fetch(`/sfx/${set}/${take}.mp3`);
          const data = await res.arrayBuffer();
          bank.set(take, await ctx.decodeAudioData(data));
        }),
      );
      this.banks.set(set, bank);
    } catch {
      // A missing take is not worth breaking typing over. The next press retries.
    } finally {
      this.busy.delete(set);
    }
  }

  /** Load every set in the background so switching boards is instant. */
  private warm() {
    if (this.warming) return;
    this.warming = true;
    void (async () => {
      for (const set of SETS) {
        if (!this.banks.has(set)) await this.load(set);
        await new Promise((r) => setTimeout(r, 120));
      }
    })();
  }

  private play(take: string, gain: number, jitter: number) {
    if (!this.enabled || !this.boot()) return;
    const ctx = this.ctx!;
    const bank = this.banks.get(this.set);
    if (!bank) {
      void this.load(this.set);
      return;
    }
    const buffer = bank.get(take) ?? bank.get(take.replace(/-up$/, '')) ?? bank.get('r2');
    if (!buffer) return;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = 1 - jitter + Math.random() * jitter * 2;

    const amp = ctx.createGain();
    amp.gain.value = gain * (0.92 + Math.random() * 0.16);

    src.connect(amp).connect(this.master!);
    src.start();
    this.warm();
  }

  /** row is the vertical position on the board, so tall rows sound like tall rows. */
  press(row: number, code: string) {
    const big = bigKeyOf(code);
    this.play(big ?? `r${Math.min(Math.max(row, 0), 4)}`, 0.9, 0.04);
  }

  release(code: string) {
    const big = bigKeyOf(code);
    this.play(big ? `${big}-up` : 'up', 0.5, 0.06);
  }
}

export const sound = new KeyboardSound();
