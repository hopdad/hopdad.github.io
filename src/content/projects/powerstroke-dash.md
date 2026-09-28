---
title: '7.3 Powerstroke Digital Dash'
description: "An ESP32-S3 gauge cluster and data logger for a 1996 F-250's 7.3L Powerstroke — reading the signals the factory gauges don't show, from injection pressure to exhaust gas temperature."
featured: false
thumbnail: '../../assets/projects/powerstroke-dash.svg'
thumbnailAlt: 'A dark, high-contrast digital gauge cluster with arc gauges for EGT, boost, injection pressure, oil and transmission temperature, and fuel pressure'
techStack:
  ['ESP32-S3', 'C++', 'FreeRTOS', 'LVGL', 'PlatformIO', 'ADS1115 ADC', 'MAX31855', 'Claude AI']
stats:
  - value: '8'
    label: 'Engine and transmission channels on one screen'
  - value: '4'
    label: 'Build phases, from bench to wireless'
githubUrl: 'https://github.com/hopdad/Powerstroke'
status: 'in-design'
completedDate: 2026-07-29
category: 'hardware'
---

## Problem

On a '96 7.3L Powerstroke, the factory gauges are little more than decoration, and the engine fails silently without injection control pressure, oil temperature, exhaust gas temperature, and fuel pressure monitoring. The truck's OBD-II link is too slow and sparse for real-time use.

## Approach

Read every signal directly: taps on the engine computer's sensor lines, plus dedicated sensors for boost, fuel pressure, and pre-turbo exhaust temperature. An ESP32-S3 runs a FreeRTOS task per sensor group — analog channels at about 20 Hz through an external ADS1115 converter, the thermocouple at 4 Hz, and pulse-width capture for the injection pressure regulator — while the display renders on its own core with LVGL and a logger batches writes to an SD card.

## Key features

- Eight channels: injection control pressure, oil temperature, manifold pressure, regulator duty cycle, exhaust gas temperature, boost, fuel pressure, and transmission temperature
- Per-channel warning and critical thresholds from config, with critical alarms taking over the screen
- Dark, high-contrast gauges built to read at a glance in sunlight — numbers and arc indicators, no clutter
- Timestamped CSV logging to SD, with Bluetooth or Wi-Fi streaming in the final phase
- A simulation mode that feeds realistic idle, rev, and highway patterns, so the whole pipeline runs on the bench with no truck attached

## Challenges

Accuracy starts with the rules. No ESP32 internal ADC on measurement channels — a dedicated converter instead. No dynamic memory allocation in sensor tasks after startup. And scaling constants live in one header, marked for calibration until they've been checked against real hardware, so no estimated number passes as final.

## Where it stands

The design is done, and the build is phased: first on the bench with simulated inputs, then the standalone sensors (exhaust temperature, boost, and fuel pressure), then the engine-computer taps, and finally logging and wireless. The bench build is up first.
