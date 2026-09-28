---
title: 'FowlCast'
description: "FishCast's sister platform for waterfowl hunters: machine-learning predictions of duck and goose activity across Michigan, driven by cold fronts, wind, and migration timing."
featured: false
thumbnail: '../../assets/projects/fowlcast.svg'
thumbnailAlt: 'A marsh contour map at dawn with migration flight paths, a wind rose, and an activity score gauge'
techStack: ['Python', 'XGBoost', 'FastAPI', 'Supabase', 'React', 'Claude AI']
stats:
  - value: '7'
    label: 'Species modeled, from mallard to Canada goose'
  - value: '10'
    label: 'Factors in the activity score'
  - value: '~45'
    label: 'Engineered features per prediction'
status: 'in-design'
completedDate: 2026-04-04
category: 'ml'
---

## Problem

Waterfowl hunting lives and dies on timing. A cold front that passed six hours ago can mean birds on the move; three days later, the same marsh can go quiet. Hunters are left to piece that picture together themselves.

## Approach

FowlCast reuses FishCast's architecture — a FastAPI backend, Supabase, a React front end, and XGBoost models — so the second product starts from proven parts. What changes is the domain model: cold fronts become the dominant factor, wind direction decides whether a decoy spread will work at all, and migration timing matters as much as the weather.

## Key features

- A 10-factor activity score per species and location, led by cold-front timing
- Per-species XGBoost models on about 45 engineered features, blended 60/40 with the rules engine
- A setup engine that recommends decoy spreads and calling, with a confidence score
- A migration tracker that places each species in its seasonal phase
- Harvest reports under a three-layer privacy model: a private log, anonymized location aggregates, and training data
- Regulation checks and a safety system with a hypothermia-risk calculator

## Challenges

Good predictions need the bad days, too. A catch log only records success, so FowlCast's trip reports capture empty hunts as negative signal. And until real reports accumulate, the models train on synthetic data, with the rules engine carrying 40% of every score.

## Where it stands

FowlCast is fully specified and ready to build: species profiles, the scoring engine, database schema, API routes, front-end components, the ML and ingestion pipelines, and a build order — written as a handoff spec for AI-assisted development, the same way FishCast was built.
