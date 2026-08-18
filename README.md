# FlowPilot AI — Premium SaaS Landing Page

A production-oriented, dependency-light landing page concept for **FlowPilot AI**, an AI execution platform that turns goals into adaptive plans, focused work, and repeatable workflows.

## What this project demonstrates

- Conversion-first SaaS information architecture
- Custom product UI mockup built with semantic HTML/CSS
- Interactive Plan / Execute / Automate / Analyze demo
- Adaptive persona switcher
- Sticky feature storytelling on desktop, stacked experience on mobile
- Monthly / yearly pricing with live team-seat calculator
- Accessible FAQ accordion and testimonial carousel
- Keyboard command palette (`Cmd/Ctrl + K`)
- Persistent light/dark theme and announcement dismissal
- Reduced-motion support
- Client-side signup validation and async success state
- Semantic landmarks, focus states, ARIA relationships, Open Graph metadata, JSON-LD, sitemap, robots.txt, and web manifest
- No external product APIs, database, authentication service, chart library, or image dependency

## Structure

```text
.
├── index.html
├── styles.css
├── app.js
├── favicon.svg
├── og-cover.svg
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── vercel.json
├── .github/workflows/quality.yml
└── README.md
```

## Run locally

This is a static site. Any local web server is sufficient.

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Production deployment

The GitHub repository is connected to Vercel as the `flowpilot-ai-landing-page` project.

Verified production URL:

`https://flowpilot-ai-landing-page-three.vercel.app/`

The latest verified production deployment is served from the `main` branch and is reported by Vercel as `READY`.

The project also uses Vercel security headers and long-lived caching for versioned static assets through `vercel.json`.

## Content policy for this portfolio concept

All company marks, usage metrics, testimonials, user names, pricing, and product behavior shown here are **fictional demonstration content**. They should not be presented as real customer evidence or production SaaS metrics.

The signup form and newsletter are intentionally simulated. No real account, payment, authentication, or database service is connected.

## Quality and verification

### Verified from the repository / deployment

- Required static files are present
- JavaScript syntax is covered by the GitHub Actions quality workflow
- Vercel production deployment exists and reports `READY`
- Production response returns HTTP `200`
- Production security headers are present
- Canonical, Open Graph, structured-data, sitemap, and robots references point to the verified Vercel production hostname
- Vercel reports no grouped runtime errors for the selected recent period

### Not claimed as measured here

A full browser-driven interaction pass and Lighthouse score are **not** claimed unless they are independently executed and measured. Source-level accessibility and responsive safeguards are present, but browser-level visual and keyboard verification should be treated separately from static inspection.

## QA checklist

- [x] Desktop navigation and dropdown structure
- [x] Mobile navigation structure
- [x] Theme persistence logic
- [x] Dismissible announcement persistence logic
- [x] Product demo tabs
- [x] Feature storytelling
- [x] Persona switcher
- [x] Metric count-up logic
- [x] Testimonial controls and auto-rotation logic
- [x] Billing toggle
- [x] Team-seat calculator (1–50)
- [x] FAQ accordion logic
- [x] Signup validation + async success state
- [x] Newsletter validation
- [x] Command palette logic
- [x] Escape / keyboard handling
- [x] Reduced-motion CSS support
- [x] Responsive layout rules for small mobile through wide desktop
- [x] Self-contained SVG favicon and social preview
- [x] Production deployment through Vercel
