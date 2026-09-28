---
title: 'FishCast ML Platform'
description: "An ML-powered platform that predicts fishing success rates for Michigan's 4,000+ inland lakes using real-time weather data, seasonal patterns, and historical catch information."
featured: true
thumbnail: '../../assets/projects/fishcast.svg'
thumbnailAlt: 'Lake depth chart with 5-foot contours, a predicted fishing hotspot on a drop-off, and a 7-day bite outlook'
techStack: ['Python', 'Scikit-learn', 'FastAPI', 'Supabase', 'JavaScript', 'Claude AI']
stats:
  - value: '4,000+'
    label: 'Michigan inland lakes covered'
  - value: '73%'
    label: 'Prediction accuracy in beta testing'
  - value: '16'
    label: 'Specification documents behind the build'
githubUrl: 'https://github.com/hopdad/fishcast'
completedDate: 2025-01-15
category: 'ml'
---

## Problem

Michigan anglers waste countless hours fishing unproductive waters. Weather patterns, seasonal changes, and lake conditions dramatically affect fish behavior, but this critical data isn't accessible or actionable for recreational fishermen. I wanted to solve this for myself and fellow Michigan anglers.

## Approach

Built an ML-powered platform that predicts fishing success rates for Michigan's 4,000+ inland lakes. The system uses regime-conditioned models that automatically adjust predictions based on seasonal and weather pattern changes, integrating NOAA weather APIs, the LAGOS-US lake database, and community-submitted catch reports. I used systematic AI collaboration to design the architecture and create comprehensive technical specifications.

## Key features

- Real-time fishing predictions for 4,000+ Michigan lakes
- Species-specific recommendations (bass, panfish, pike, walleye)
- 7-day weather integration and forecasting
- Community catch reporting with verification system
- Mobile-optimized interface for use in areas with poor cell coverage

## Challenges

Working with sparse training data required creative feature engineering and careful validation. The biggest technical challenge was balancing model complexity with prediction reliability — too simple and it's useless, too complex and it overfits. I also had to design for the reality of spotty cellular coverage on remote Michigan lakes.

## Outcome

Beta testing achieved 73% prediction accuracy across multiple lake types and seasons. The AI-assisted development process produced 16 comprehensive specification documents covering everything from ML pipeline design to legal compliance. The system is architected for statewide deployment with scalable data infrastructure.
