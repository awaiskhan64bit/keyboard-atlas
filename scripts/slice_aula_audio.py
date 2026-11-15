import subprocess
import os
import re

AUDIO_SRC = r"C:\Users\awais\projects\keyboard-atlas\scripts\aula_raw.mp3"
SFX_DIR = r"C:\Users\awais\projects\keyboard-atlas\public\sfx"

# Segments in aula_raw.mp3
SEGMENTS = {
    "graywood": (1.0, 14.0),
    "reaper": (31.0, 44.0),
    "icevein": (46.0, 59.0),
    "starvector": (61.0, 74.0),
}

def detect_hits(start_time, end_time):
    duration = end_time - start_time
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(start_time),
        "-t", str(duration),
        "-i", AUDIO_SRC,
        "-af", "silencedetect=noise=-32dB:d=0.035",
        "-f", "null", "-"
    ]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.DEVNULL, text=True, encoding="utf-8", errors="replace")
    
    hits = []
    # silence_end marks the beginning of sound
    for m in re.finditer(r"silence_end:\s*([0-9.]+)", res.stderr):
        rel_hit = float(m.group(1))
        # absolute time in source
        hits.append(start_time + rel_hit)
    return hits

for name, (start, end) in SEGMENTS.items():
    out_folder = os.path.join(SFX_DIR, name)
    os.makedirs(out_folder, exist_ok=True)
    hits = detect_hits(start, end)
    print(f"{name}: found {len(hits)} hits")
    
    # We need takes: r0, r1, r2, r3, r4, space, enter, bksp, up, space-up, enter-up, bksp-up
    # If we have at least 12 hits, use distinct hits; else cycle
    if not hits:
        print(f"Warning: no hits for {name}")
        continue
    
    # Take slices
    takes = [
        "r0", "r1", "r2", "r3", "r4", "space", "enter", "bksp", "up",
        "space-up", "enter-up", "bksp-up"
    ]
    
    for idx, take in enumerate(takes):
        hit_pos = hits[idx % len(hits)]
        out_file = os.path.join(out_folder, f"{take}.mp3")
        # Cut 240ms around the hit: start 10ms before silence_end
        cut_start = max(0, hit_pos - 0.01)
        duration = 0.28
        
        # Audio filter: smooth fade in 3ms, fade out 40ms, normalize
        af = "afade=t=in:ss=0:d=0.004,afade=t=out:st=0.22:d=0.05,volume=4dB"
        
        cut_cmd = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-ss", f"{cut_start:.4f}",
            "-t", f"{duration:.3f}",
            "-i", AUDIO_SRC,
            "-af", af,
            "-b:a", "128k",
            out_file
        ]
        subprocess.run(cut_cmd, check=True)
    print(f"Saved 12 takes for {name} to {out_folder}")
