---
title: 'Titan Yard & Dock Platform'
description: "One system for a distribution center's yard, dock, and building — an event-sourced core that every future module plugs into, starting with yard management."
featured: true
order: 3
thumbnail: '../../assets/projects/titan.svg'
thumbnailAlt: 'System diagram: gate, yard, and dock events flowing into an append-only event log, projected out to floor tablets and an HQ dashboard'
techStack:
  [
    'PostgreSQL',
    'PostGIS',
    'Python',
    'FastAPI',
    'React',
    'Next.js',
    'TypeScript',
    'Docker',
    'Claude AI',
  ]
stats:
  - value: '20'
    label: 'Migrations that define the core'
  - value: '9'
    label: 'Database test suites, including exit criteria'
  - value: '3'
    label: 'CI stages: database, services, apps'
status: 'active'
completedDate: 2026-09-18
category: 'web'
---

## Problem

A distribution center runs on disconnected tools, and associates end up working around them instead of with them. A trailer checked in at the gate should show up — at the same moment — for the people who move it, load it, and plan around it: same data, one truth, a view that fits each role. Instead, every tool keeps its own idea of what a trailer, a load, or a door is.

## Approach

Titan is built core-first. A shared core owns the entities — trailers, loads, doors, locations — and an append-only event log. Every module writes events to the core and reads projections from it: yard management first, then receiving, shipping, and routes. Outside systems sit behind adapters, so no vendor's schema or ID ever reaches the core, and any one of them can be swapped by replacing a single adapter.

The first version went wide — a dozen modules and several desktop stations at once. The rebuild starts narrower on purpose: prove the core, then ship YardGuardian, the yard module, on top of it.

I write the build spec and own the product decisions and the front end. The backend logic is written with Claude against that spec, and CI holds every change to the spec's exit criteria.

## Key features

- **Append-only event log.** Updates and deletes raise errors; a correction is a new event. Every number — including a detention dispute — can be proven.
- **State as a projection.** One applier serves both the live path and full rebuilds, and a drift check diffs the two.
- **The floor is the source of truth.** The gate owns trailer presence and the dock owns load status, enforced as roles in the event policy.
- **Every write is role-checked.** Clients read through row-level security and write only through a single emit function.
- **Site layout is data, not code.** Zones are effective-dated, and a remodel is a change set that's previewed, then activated.
- **Yard locations are a zone plus a GPS pin**, resolved to the right zone by polygon in PostGIS.
- **Offline-tolerant by design.** Devices mint their own IDs and idempotency keys, so replaying an offline queue is a no-op.
- **Built for rugged tablets** — keyboard-first, one global scan listener, and printing, scanning, and GPS behind a device bridge.
- **Portable.** The whole stack comes up with Docker Compose and signs in through standard OIDC or SAML.

## Challenges

Scope came first. The lesson carried into the rebuild is "manual before automated": every phase has to work with people entering data by hand before cameras, OCR, or ETA feeds are layered on, and every adapter ships disabled until it's needed.

Then there are the dead spots. Spotters and gate staff work on tablets in a yard with patchy coverage, so any record has to be creatable offline and sync cleanly later, without creating duplicates when a queue is replayed.

## Outcome

Phase 0, the core foundation, has shipped: twenty migrations, nine database test suites that encode the phase's exit criteria as runnable assertions, and CI that applies the migrations, seeds a site, and runs the service and app checks on every change.

Phase 1 — gate check-in and yard inventory — is next. Its routes, roles, and event types are already defined and enforced; the screens are being built. Each phase ships with its own KPIs, starting with dwell time, yard-check truth rate, and gate check-in time.
