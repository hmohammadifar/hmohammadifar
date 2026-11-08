<!--
════════════════════════════════════════════════════════════════════════════
  IMPORTANT — THIS README IS THE REPOSITORY LANDING PAGE
  --------------------------------------------------------------------------
  This file is shown on the GitHub profile / repository home page for
  Dr Hossein Mohammadifar. Whatever is written here is the first thing a
  visitor, collaborator or hiring panel reads when they open the repo, so
  keep it accurate, current and free of internal notes.

  Because GitHub renders this file on the profile, it must stay:
    • self-contained (relative links only, no local file paths)
    • free of draft comments, TODOs and secrets
    • in sync with the deployed site's placeholder status

  The comment block you are reading is invisible when GitHub renders the
  README, but it IS present in the raw file — do not paste confidential
  details into it. Anything meant to be read should sit below this block.
════════════════════════════════════════════════════════════════════════════
-->

# Dr Hossein Mohammadifar — Portfolio (placeholder)

A static, dependency-free portfolio website for **Dr Hossein Mohammadifar** — researcher,
lecturer and engineer. Built with **HTML5 and CSS only**, with a light layer of **vanilla
JavaScript** for interactions and animation. No frameworks, no build step, no package
manager, no third-party requests.

> **Status: placeholder.**
> Every name, date, publication, figure, statistic and contact detail on this site is
> illustrative sample content used to demonstrate the layout. None of it should be read as
> a real academic record yet. The [Replacing the placeholder content](#replacing-the-placeholder-content)
> section explains exactly what to swap.

---

## Contents

- [What this is](#what-this-is)
- [Live pages](#live-pages)
- [Project structure](#project-structure)
- [Running the site locally](#running-the-site-locally)
- [Features](#features)
- [Design system](#design-system)
- [Replacing the placeholder content](#replacing-the-placeholder-content)
- [Accessibility](#accessibility)
- [Printing and PDF output](#printing-and-pdf-output)
- [Browser support](#browser-support)
- [Roadmap](#roadmap)
- [Licence](#licence)

---

## What this is

A hand-written, multi-page static site intended as a clean starting point for an academic
portfolio. It is deliberately small and readable: every file can be opened in a text
editor and understood without tooling.

| Requirement | How it is met |
| --- | --- |
| Portfolio for Dr Hossein Mohammadifar | Seven pages of placeholder academic content |
| HTML5 and CSS only | Semantic HTML5 markup; three CSS layers plus a print stylesheet |
| Separated directories | `assets/css/`, `assets/js/`, `assets/img/` — one concern per folder |
| Vanilla JS for effects and animation | Three small scripts, no libraries, no build step |
| Placeholder-friendly | Visible "placeholder" markers and notes throughout |

## Live pages

| Page | File | Purpose |
| --- | --- | --- |
| Home | [`index.html`](index.html) | Hero, animated statistics, research focus, recent publications, biography |
| About | [`about.html`](about.html) | Biography, career timeline, teaching accordions, recognition |
| Research | [`research.html`](research.html) | Research themes, project cards with figures, methods table |
| Publications | [`publications.html`](publications.html) | Filterable publication list (journal / conference / chapter / preprint) |
| CV | [`cv.html`](cv.html) | Appointments, degrees, teaching record, service — prints cleanly |
| Contact | [`contact.html`](contact.html) | Validated enquiry form (placeholder submit) and direct details |
| Not found | [`404.html`](404.html) | Friendly error page for static hosts |

## Project structure

```text
.
├── index.html               # Home
├── about.html               # Biography, timeline, teaching
├── research.html            # Themes, projects, methods
├── publications.html        # Filterable publication list
├── cv.html                  # Curriculum vitae (print-friendly)
├── contact.html             # Contact form + details
├── 404.html                 # Not-found page
├── README.md                # This file (rendered on the repository home page)
├── LICENSE
└── assets/
    ├── css/
    │   ├── base.css         # Design tokens, reset, typography, utilities
    │   ├── layout.css       # Header, navigation, hero shell, footer, reveal base
    │   ├── components.css   # Buttons, cards, timeline, publications, forms, CTA band
    │   └── print.css        # Print/PDF stylesheet (media="print")
    ├── js/
    │   ├── main.js          # Theme toggle, mobile nav, scroll progress, scrollspy, reveals
    │   ├── animations.js    # Text splitting, count-up, skill bars, spotlight cards, glow, tilt
    │   └── interactions.js  # Accordion, publication filters, form validation, copy-to-clipboard
    └── img/
        ├── favicon.svg      # "HM" monogram favicon
        ├── figure-1.svg     # Abstract figure — layered model
        ├── figure-2.svg     # Abstract figure — uncertainty bands
        └── figure-3.svg     # Abstract figure — connected nodes
```

CSS is loaded in order — `base.css` → `layout.css` → `components.css` — so later files can
rely on the tokens and utilities defined earlier. `print.css` is attached with
`media="print"` and never affects screen rendering.

## Running the site locally

No installation, no build. Any static server works.

```bash
# Clone and enter the repository
git clone <your-repository-url> hmf-portfolio
cd hmf-portfolio

# Option 1 — Python (usually already installed)
python3 -m http.server 8000

# Option 2 — Node
npx serve .

# Then open http://localhost:8000
```

Opening `index.html` directly from the file system also works, though a local server is
recommended so relative asset paths and the dark-mode preference behave exactly as they
would in production.

### Deploying

The repository root is the site root, so it can be published as-is:

- **GitHub Pages** — Settings → Pages → deploy from branch, folder `/ (root)`.
- **Netlify / Vercel / Cloudflare Pages** — point at the repository, no build command, publish
  directory `.`.
- **404 handling** — static hosts serve `404.html` automatically; no configuration needed.

Before publishing, delete or replace the placeholder content described below.

## Features

**Layout and content**

- Seven semantic HTML5 pages sharing one header, navigation and footer.
- Two-column, single-column and sticky-aside layouts that collapse gracefully on small screens.
- Print stylesheet that turns the CV into a clean, ink-friendly document.

**Vanilla JavaScript effects** (`assets/js/`)

- **Theme toggle** — light/dark, remembers the choice in `localStorage`, falls back to the OS
  `prefers-color-scheme` preference on first visit.
- **Mobile navigation** — accessible burger button, `aria-expanded`, closes on link click,
  `Escape` or outside click.
- **Scroll progress bar** across the top of the viewport.
- **Scrollspy** — highlights the current section in the navigation.
- **Reveal on scroll** — staggered `IntersectionObserver` fade-and-rise for sections and cards.
- **Hero text splitting** — headline characters animate in one by one (decorative only; the
  original string is preserved in `aria-label`).
- **Count-up statistics** that animate when scrolled into view.
- **Skill bars** that fill to their target when they enter the viewport.
- **Spotlight cards** whose highlight follows the pointer (CSS custom properties).
- **Cursor glow** — a soft, slowly trailing light on desktop pointers only.
- **Seamless marquee** — the research keyword strip is duplicated at runtime for a continuous loop.
- **Subtle 3D tilt** on the portrait card.
- **Accordions** for teaching information, with single-open behaviour per group.
- **Publication filters** — show/hide by output type, with an empty state.
- **Form validation** — inline, accessible, blur- and submit-triggered, with a placeholder
  success state that sends nothing.
- **Copy-to-clipboard** buttons for the email address.

**Performance and privacy**

- Zero dependencies and zero network requests beyond the site's own files — no fonts, no CDN,
  no analytics, no cookies.
- Scripts are `defer`red; CSS is a single preload plus two more stylesheets.
- All animation is opt-in and disabled automatically under `prefers-reduced-motion: reduce`.

## Design system

All visual decisions live in the custom properties at the top of `assets/css/base.css`.

| Group | Examples | Notes |
| --- | --- | --- |
| Brand | `--brand-500`, `--brand-600`, `--accent-500` | Deep navy and warm ochre |
| Surfaces | `--bg`, `--surface`, `--surface-soft`, `--border` | Warm paper tones in light mode |
| Text | `--text`, `--text-soft`, `--text-muted` | Three-step hierarchy |
| Type scale | `--step--2` … `--step-5` | Fluid `clamp()` values, no media-query font jumps |
| Space | `--sp-1` … `--sp-9` | Consistent rhythm across all pages |
| Radius/shadow | `--r-sm` … `--r-lg`, `--shadow-sm` … `--lg` | |
| Motion | `--ease`, `--dur-fast`, `--dur`, `--dur-slow` | One easing curve everywhere |

Dark mode is a single `[data-theme="dark"]` block that overrides those tokens — no duplicated
component rules. To rebrand the site, change the brand tokens in that one file.

Typography uses a serif display face for headings (system-installed: Iowan Old Style,
Palatino, Georgia) and the native sans-serif stack for body text, so nothing is downloaded.

## Replacing the placeholder content

Everything below is sample text and should be replaced before the site is published.

1. **Name and identity** — search every page for `Mohammadifar`, `HM` and the `brand__*`
   markup in the header. Update `<title>`, `<meta name="description">` and the Open Graph
   tags in each page's `<head>`.
2. **Contact details** — `h.mohammadifar@example.com`, the location line, and the
   `data-copy` attribute on the CV and contact pages.
3. **Portrait** — `index.html` uses a monogram placeholder inside `.portrait__frame`. Replace
   the `HM` span with an `<img>` (roughly 4:5, e.g. 800×1000) and delete
   `.portrait__card` and `.portrait__caption` when a real photograph is in place.
4. **Publications** — `publications.html` holds the full list; `index.html` shows three
   selected entries. Each `<li class="pub" data-pub-type="…">` carries its type for the
   filter; valid values are `journal`, `conference`, `chapter`, `preprint`.
5. **Figures** — `assets/img/figure-*.svg` are abstract placeholders. Drop in real diagrams
   or plots (SVG or WebP recommended) and keep the `width`, `height` and `alt` attributes
   accurate.
6. **Statistics** — the four numbers on the home page come from `data-count`, plus
   `data-suffix` / `data-prefix` / `data-decimals` attributes. The same figure is also the
   fallback text inside the element, so update both.
7. **Timelines and tables** — appointments, degrees, modules and service records are
   ordinary list and table markup; duplicate an item to add one.
8. **External profiles** — Google Scholar, ORCID, LinkedIn and GitHub links currently use
   `data-placeholder-link`, which stops them navigating. Replace each `href="#"` with the real
   URL and remove the attribute.
9. **Contact form** — there is no backend. To make it live, either point the `<form>` at a form
   service (Formspree, Netlify Forms) or add your own endpoint, then remove the placeholder
   success block in `assets/js/interactions.js` and the consent checkbox on `contact.html`.
10. **Placeholder markers** — remove the `.badge-placeholder` chips and `.placeholder-note`
    blocks once the content is real, and the footer line "Placeholder content — ready for
    real details".

## Accessibility

- Landmarks on every page: `header`, `nav`, `main`, `footer`; a visible-on-focus skip link.
- The current page is marked with `aria-current="page"`; the scrollspy uses `aria-current` too.
- Buttons carry `aria-expanded` / `aria-controls`; accordion panels keep their content in the
  DOM and are toggled with CSS grid rows.
- Form fields have real `<label>` elements, inline errors announced with `aria-live`, and
  validation is duplicated on the server side when you build one.
- Decorative SVG is `aria-hidden` and `focusable="false"`; informative figures have `alt` text.
- Focus is never removed — `:focus-visible` gets a 2px ochre outline with offset.
- All motion is suppressed under `prefers-reduced-motion: reduce`, and reveal animations have a
  no-JavaScript fallback via the `no-js` class removed inline in `<head>`.
- Colour combinations were chosen for comfortable contrast on both themes; re-check if you
  change the brand tokens.

## Printing and PDF output

`assets/css/print.css` is attached with `media="print"`. It strips navigation, buttons, the
cursor glow and the call-to-action bands, converts timelines and cards to plain bordered
blocks, prints link URLs after anchors, and avoids page breaks inside entries.

Print `cv.html` (Ctrl/Cmd + P) to obtain a clean A4 PDF. A ready-made PDF CV link is left as a
placeholder in `cv.html` — add your own file to `assets/` and point the button at it.

## Browser support

Current versions of Chrome, Edge, Firefox and Safari, on desktop and mobile. The site uses
modern CSS (`clamp()`, custom properties, `grid-template-rows` transitions,
`color-mix()`, `mask-image`) — all progressive enhancements either degrade visually or are
guarded with `@supports`. JavaScript is optional: content and navigation work without it.

## Roadmap

- [ ] Replace all placeholder copy, figures and contact details
- [ ] Add a real portrait photograph
- [ ] Wire the contact form to a form service
- [ ] Add real publication metadata and DOI links
- [ ] Add an RSS/JSON feed for publications (optional)
- [ ] Add `sitemap.xml` and `robots.txt` once the domain is fixed
- [ ] Consider an Open Graph preview image (`og:image`) per page

## Licence

Released under the MIT Licence — see [`LICENSE`](LICENSE). The placeholder text and abstract
figures may be reused freely.

Site content (biography, publications, CV details) is the property of Dr Hossein Mohammadifar
and should be replaced with accurate material before publication.
