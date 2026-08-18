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
└── README.md
```

## Run locally

This is a static site. Any local web server is sufficient.

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

For production deployment, the same files can be served by Vercel, Netlify, GitHub Pages, Cloudflare Pages, or a conventional static host.

## Production notes

The canonical URL, Open Graph URLs, sitemap URL, and robot policy currently use the placeholder domain `flowpilot-ai.example.com`. Replace that domain with the real deployment hostname before launch.

All company marks, usage metrics, testimonials, user names, pricing, and product behavior shown here are fictional demonstration content.

## QA checklist

- [x] Desktop navigation and dropdowns
- [x] Mobile navigation
- [x] Theme persistence
- [x] Dismissible announcement persistence
- [x] Product demo tabs
- [x] Feature storytelling
- [x] Persona switcher
- [x] Metric count-up
- [x] Testimonial controls and auto-rotation
- [x] Billing toggle
- [x] Team-seat calculator (1–50)
- [x] FAQ accordion
- [x] Signup validation + async success state
- [x] Newsletter validation
- [x] Command palette
- [x] Escape / keyboard handling
- [x] Reduced motion media query
- [x] Responsive layout rules for small mobile through wide desktop
- [x] Self-contained SVG favicon and social preview
