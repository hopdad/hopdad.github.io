---
title: 'Truck Simulator Toolkit'
description: 'Three standard-library Python tools for American Truck Simulator — a mod builder, a mod-folder doctor, and the telemetry bridge for a second-screen dashboard — backed by 150 automated checks.'
featured: false
thumbnail: '../../assets/projects/truck-sim-toolkit.svg'
thumbnailAlt: 'A second-screen truck dashboard with speed, real time left, and pay per real hour, beside a mod load-order stack showing a conflict and an overridden mod'
techStack:
  ['Python', 'Standard library only', 'SII parsing', 'Shared-memory telemetry', 'Claude AI']
stats:
  - value: '150'
    label: 'Automated checks across three tools'
  - value: '0'
    label: 'Third-party dependencies to install'
  - value: '3'
    label: 'Self-contained tools, each with its own tests'
githubUrl: 'https://github.com/hopdad/ATS'
status: 'active'
completedDate: 2026-09-13
category: 'tools'
---

## Problem

Truck-sim modding is full of silent failures. A mod packed one folder too deep loads nothing. Two mods ship the same file, and one quietly loses. A mod can be enabled, look healthy in the Mod Manager, and do nothing at all, because something higher in the load order overrides every file it has. And the game's clock runs far faster than real time, so its arrival estimate tells you very little about your own evening.

## Approach

Three self-contained tools, each a folder with its own tests and docs, all built on the Python standard library — nothing to install. There's deliberately no shared package: the two mod tools each parse a little SII, but single-file tools are how mod tooling actually gets used, so any one of them can be lifted out and run on its own.

## Key features

- **Economy Chest** builds a money and XP multiplier mod by patching the economy file your copy of the game actually ships. It scales only the per-kilometer revenue coefficients, so the balance between job types stays intact, and prints every attribute it changed.
- It also packages for the Steam Workshop, enforcing the three rules that silently break an upload and validating the preview image.
- **Mod Doctor** finds packaging errors the game quietly ignores, file conflicts grouped by the mods involved — gameplay-affecting files first — and mods that are enabled but completely overridden.
- It reads the load order from a profile or a hand-typed list, refuses to guess on encrypted profiles, and offers JSON output and a strict exit code for scripting.
- **Cab Deck** is the telemetry bridge for a second-screen dashboard: real time left, which limit hits first, pay per real hour, and alerts — with simulate, record, and replay modes so it runs without the game.

## Challenges

Building against a simulator first caught two bugs before a single byte of real telemetry was read. A nine-hour sleep looked like a save reload, since both are big forward jumps in game time. And driving through a town 110 miles out tripled the arrival estimate, because the whole trip was being costed at city pace. The fixes — drop any measurement window that spans a time jump, and cost road not yet reached at remembered open-road pace — are pinned by tests.

The real telemetry arrives as a C struct in shared memory, where a wrong field offset decodes to a plausible number instead of an error. So the reader refuses to run without the plugin's own layout rather than guessing one.

## Outcome

Economy Chest and Mod Doctor are working tools with 52 and 49 checks. Cab Deck's first phase — the telemetry bridge — is built with 49 unit tests; the dashboard and in-game controls are planned next.
