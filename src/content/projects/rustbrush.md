---
title: 'RustBrush Sign Painter'
description: 'A Rust desktop app that paints any image onto in-game signs in the survival game Rust — perceptual color matching, dithering, and a path optimizer that cuts mouse travel.'
featured: true
order: 5
thumbnail: '../../assets/projects/rustbrush.svg'
thumbnailAlt: 'A source image quantized onto a pixel canvas with a limited palette, overlaid with the optimized paint path'
techStack: ['Rust', 'egui', 'CIEDE2000', 'K-means++', 'Dithering', 'GitHub Actions', 'Claude AI']
stats:
  - value: '8,800+'
    label: 'Lines of Rust across three crates'
  - value: '70'
    label: 'Unit tests on the color and planning core'
  - value: '18'
    label: 'Canvas presets, one for every sign type'
githubUrl: 'https://github.com/hopdad/RustBrush'
completedDate: 2026-03-25
category: 'desktop'
---

## Problem

Rust — the survival game — lets players paint signs, banners, and picture frames by hand, one brush stroke at a time. Reproducing a real image that way means matching every pixel to a limited palette and clicking thousands of times. RustBrush turns any image into a paint plan and carries it out.

## Approach

A three-crate Rust workspace keeps the interesting parts testable without the game: a pure core library for color science, image processing, and paint planning; a platform layer for input, screen capture, and hotkeys; and an app crate with both a command-line interface and an egui GUI.

Painting is a pipeline: load and resize, adjust, map every pixel to the nearest palette color, optionally dither, plan the strokes, then execute them with pause, cancel, and resume.

Anti-cheat safety was a design constraint from the start. RustBrush uses only OS-level input and standard screen capture — it never reads or writes game memory, injects code, or hooks the game process — the same approach used by painting tools published on Steam.

## Key features

- Perceptual color matching with CIEDE2000 in CIE L\*a\*b\* space, plus RGB distance when speed matters more
- Floyd–Steinberg error diffusion and ordered (Bayer) dithering
- An adaptive 512-color palette built with k-means++ clustering in Lab space
- Four painting strategies, with line detection that turns horizontal runs into single shift-click strokes
- A 2-opt path optimizer that reorders paint segments to minimize total mouse travel
- Adaptive delays that tune painting speed from successes and failures
- Session save and resume, GIF frames for animated signs, and a built-in text and clipart builder

## Challenges

Speed and fidelity pull against each other. Every palette switch and every mouse move costs time; skipping them costs image quality. Grouping by color, detecting runs, and reordering segments with 2-opt attack the time. Perceptual matching and dithering protect the image. Quality presets — Speed, Balanced, Quality, and Maximum — expose that trade-off as one choice instead of a dozen sliders.

## Outcome

Version 0.2 shipped with Windows builds produced by GitHub Actions, full documentation — getting started, a user guide, a CLI reference, and troubleshooting — and 70 unit tests covering the color and planning core. It's open source under the MIT license.
