---
title: 'LaunchPad Dock Planner'
description: "A web app that turns a shipping dock's daily cube sheets into trailer projections and multi-stop run plans — with OCR intake, anomaly checks, and live coordination on the dock floor."
featured: false
thumbnail: '../../assets/projects/launchpad.svg'
thumbnailAlt: 'A scanned cube sheet with OCR boxes feeding trailers packed by bin packing, and a multi-stop delivery route'
techStack:
  [
    'Python',
    'FastAPI',
    'React',
    'TypeScript',
    'OR-Tools',
    'Tesseract OCR',
    'OpenCV',
    'SQLite',
    'Claude AI',
  ]
stats:
  - value: '197'
    label: 'Automated backend tests'
  - value: '4'
    label: 'Ways in: typed, pasted, CSV, or scanned'
completedDate: 2026-03-09
category: 'web'
---

## Problem

Every day, a shipping dock has to turn a stack of cube numbers — how much freight is headed to each store — into a plan: how many trailers, which stores ride together on multi-stop "peddle" runs, and who loads what. Worked by hand from printed sheets, it's slow and error-prone, and there's no easy way to compare the plan with what actually shipped.

## Approach

LaunchPad started as a quick Streamlit tool and grew into a FastAPI backend with a React and TypeScript front end. Cube data comes in however the dock has it — typed, pasted, uploaded as a CSV, or scanned — and flows through intake checks, planning, and exports, with each day's actuals feeding back in.

## Key features

- OCR intake for scanned sheets, images, and PDFs, with OpenCV preprocessing ahead of Tesseract
- Anomaly checks that flag likely OCR misreads, typos, and forgotten stores against each store's own history, using z-scores and IQR — no ML library required
- Trailer projections and suggested runs from bin packing, overflow routing, distance sequencing, and weighted scoring
- A live dock view with role-based screens for clerks, loaders, and floaters, plus load diagrams and loader sheets
- Actuals captured automatically as loads complete, with history and correction factors for planners
- PDF and Excel exports, sign-in with role-based access, and admin user management

## Challenges

OCR is only as good as the page it reads. Cleaning up images before recognition helps, but the real safety net is the anomaly check: comparing each value with that store's history catches a misread digit before it becomes a wrong trailer count — and it degrades gracefully when there isn't much history yet.

## Outcome

LaunchPad is built to deploy as a hosted web app, with 197 backend tests plus front-end lint, build, and test runs in CI. It's proprietary software, so the code isn't public.
