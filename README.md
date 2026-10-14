# ReliefLink

**Track:** AI for Better Living & Smarter Communities  
**Engine:** Engineered & Prompted via Google AI Studio for Promptwars 2026  
**Environment:** Client-Side Sandbox Architecture (Zero System Dependencies)

---

## Project Overview

ReliefLink is a resilient, ultra-accessible volunteer coordination framework engineered to eliminate resource bottlenecks during sudden climate and flood disasters. In active crisis events, spontaneous volunteers often want to step up but lack insight into exactly where help is needed, which tasks match their physical constraints, and how to safely help without disrupting professional rescue units.

This prototype demonstrates a fail-safe hybrid deployment pattern:
1. Deterministic Filter Matrix: Critical core safety constraints, shifts, limits, and radii calculations run locally via raw client-side scripts. AI cannot alter verification statuses, reduce safety margins, or dynamically route civilians into high-risk hazard zones.
2. Contextual Translation Layer: Employs precise text generation variables to immediately break down exactly why a matching metric score fits a volunteer's constraints in plain language.

---

## Human-Centric UI Blueprint

To break away from sterile, predictable AI-generated dashboard templates, the client layout embraces an intentional, human-engineered design tailored for field work under high cognitive stress:

* Emergency Navy & Crisp Cream Palette: Replaces generic gray grid structures and high-fatigue alarmist red blocks with a deeply grounding color scheme (#0B0F19 background text elements paired with clean structural tones).
* High-Utility Data Density: Completely eliminates generic emoji markers. Information architecture relies on hard typography hierarchies, solid borders, and explicit system status tags.
* Responsive Mobile Optimization: Engineered with fluid constraints to guarantee seamless usage for on-the-ground volunteer check-ins on mobile web runtimes.

---

## Real-Time Geolocation & The 24-Hour Safety Rule

To ensure field volunteers chase live, actionable requests rather than outdated, closed incidents, ReliefLink integrates automated temporal filtration grids:
* Active Expiration Threshold: The app implements a strict time delta check where (Date.now() - event.timestamp) must be less than or equal to 86400000 milliseconds. Any incident node older than 24 hours is instantly dropped from the active dashboard feed.
* Proximity Geofencing: Correlates native browser geolocation inputs (navigator.geolocation) directly against verified incident coordinate matrices.

---

## Dynamic Judge Sandbox Override Mode

Because hackathon judges and code reviewers frequently evaluate deployment workflows from stable, unaffected geographic spaces, a completely live geolocation filter would generate blank states. ReliefLink bypasses this friction transparently:

1. Live Check Fallback: The engine searches for live location data first. If none are present, it alerts the evaluator.
2. Interactive Simulator Panel: Evaluators can manually override system states via a clear toolbar to simulate specific scenarios, such as simulating an active flood zone in Riverdale Downtown.
3. Temporal Runtime Insertion: Sandbox selection programmatically assigns the user's active client clock string (new Date().toISOString()) to the mock data packages, instantly bypassing the 24-hour expiration filter for realistic end-to-end evaluation.

---

## How the Matching Engine Scores Tasks

The client calculation matrix ranks open deployment tasks using rigid priority weights:
* Primary Skill Match (+50 points): Confirms structural alignment with the requested physical task.
* Time Availability (+30 points): Validates that shift durations sit well within the volunteer's time allocation.
* Geofenced Proximity (+20 points): Factors in localized distance calculations relative to starting markers.
* Absolute Hard Cutoff (0 points): If a task has 0 open spots left, exceeds travel limits, or requires a longer commitment than available, its score is dropped to 0 to guarantee absolute volunteer safety.

---

## Quick Launch / Local Setup

This deployment package runs entirely on the client side inside a single standalone document file. No heavy databases, node environments, web servers, or third-party integrations required.

1. Clone the public repository:
   ```bash
   git clone https://github.com
   ```
2. Navigate into the project workspace:
   ```bash
   cd ReliefLink
   ```
3. Run the interface locally:
   Simply double-click index.html to open and test the entire layout immediately in any desktop or mobile browser. To create a live tracking URL for your submission, drop the file directly into a free static target like GitHub Pages.

---

## Mandatory Prototype Safety Disclaimer

Fictional demo data. In a real emergency, always follow official emergency instructions and volunteer through recognized response organizations.

This repository functions exclusively as a conceptual design, UX framework, and code architecture blueprint for Promptwars 2026. It does not actively track real-world hazards, process true emergency dispatch signals, monitor physical telemetry, or handle valid tactical public field alerts.
