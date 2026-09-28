---
title: 'OpenSwimMeet'
description: 'An open-source desktop app for running swim meets — Hy-Tek HY3 import and export, heat seeding, psych and heat sheet PDFs, results, and team scoring.'
featured: false
thumbnail: '../../assets/projects/openswimmeet.svg'
thumbnailAlt: 'Top-down view of an eight-lane pool where the top seeds swim the center lanes, beside a psych sheet of seed times'
techStack: ['Python', 'Tkinter', 'SQLite', 'ReportLab', 'pytest', 'Claude AI']
stats:
  - value: '92'
    label: 'Tests for the HY3 file parser'
  - value: '15'
    label: 'Tables in the meet database'
githubUrl: 'https://github.com/hopdad/OpenSwimMeet'
completedDate: 2026-02-07
category: 'desktop'
---

## Problem

Running a swim meet means importing entries from every team, seeding heats, printing psych and heat sheets, recording results lane by lane, and keeping team scores current as the meet goes. OpenSwimMeet is an open-source take on that whole workflow.

## Approach

A Tkinter desktop app over a SQLite meet database, so a meet runs on any laptop with no server required. Entries come in through the Hy-Tek HY3 format teams already use — a fixed-width, SDIF-style file — and go back out the same way.

## Key features

- HY3 import and export of teams, swimmers, and seed times
- Heat seeding that swims the fastest heat last with the top seeds in the center lanes, plus relay seeding
- Psych sheet and heat sheet PDFs
- Lane-by-lane results with DQ codes, and relay legs with splits
- Team scoring, meet statistics, and swimmer check-in
- Validation rules, automatic backups, and an undo log

## Challenges

HY3 files are fixed-width, and times arrive as strings like `1:23.45`, bare seconds, or `NT` for no time. The parser normalizes all of it — minutes, hours, and no-times — and it's the most heavily tested part of the app, with 92 tests.

## Outcome

The app runs a meet end to end: import, seed, print, record, and score. A live meet mode and reusable meet templates are next on the roadmap.
