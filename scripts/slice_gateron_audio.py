import subprocess
import os
import re

AUDIO_SRC = r"C:\Users\awais\projects\keyboard-atlas\scripts\gateron_raw.mp3"
SFX_DIR = r"C:\Users\awais\projects\keyboard-atlas\public\sfx"

SEGMENTS = {
    "gateronred": (3.5, 17.5),
    "gateronblue": (21.0, 34.5),
    "gateronbrown": (38.0, 50.5),
    "gateronblack": (85.0, 96.5),
}

def detect_hits(start_time, end_time):
    duration = end_time - start_time
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(start_time),
        "-t", str(duration),
        "-i", AUDIO_SRC,
        "-af", "silencedetect=noise=-30dB:d=0.03",
        "-f", "null", "-"
    ]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.DEVNULL, text=True, encoding="utf-8", errors="replace")
    
    hits = []
    for m in re.finditer(r"silence_end:\s*([0-9.]+)", res.stderr):
        rel_hit = float(m.group(1))
        hits.append(start_time + rel_hit)
    return hits

takes = [
    "r0", "r1", "r2", "r3", "r4", "space", "enter", "bksp", "up",
    "space-up", "enter-up", "bksp-up"
]

for name, (start, end) in SEGMENTS.items():
    out_folder = os.path.join(SFX_DIR, name)
    os.makedirs(out_folder, exist_ok=True)
    hits = detect_hits(start, end)
    print(f"{name}: found {len(hits)} hits")
    
    if not hits:
        print(f"Warning: no hits detected for {name}, using evenly spaced fallback")
        step = (end - start) / 12.0
        hits = [start + i * step for i in range(12)]
    
    for idx, take in enumerate(takes):
        hit_pos = hits[idx % len(hits)]
        out_file = os.path.join(out_folder, f"{take}.mp3")
        cut_start = max(0, hit_pos - 0.008)
        duration = 0.28
        
        af = "afade=t=in:ss=0:d=0.004,afade=t=out:st=0.22:d=0.05,volume=5dB"
        
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
