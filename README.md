# Your Name — Personal Site

A hand-built personal site: a life/work timeline on the home page, plus
career, personal, gallery, and garage sections. No build step, no
framework — just HTML, CSS, and vanilla JS, served straight from GitHub
Pages.

**Live at:** https://nimawithacomputa.github.io/

## Structure

```
.
├── index.html              home — the life/work timeline
├── career.html             roles, projects, skills
├── personal.html           hobbies, "right now" widgets
├── gallery.html            photo grid + video grid, with a lightbox
├── garage.html             car ownership / build stories
├── contact.html            links to reach you
├── posts/                  full write-ups linked from career/garage cards
│   ├── example-project.html
│   └── first-car.html
├── images/
│   ├── gallery/             photos for gallery.html
│   ├── videos/              self-hosted video files (if not using YouTube/etc.)
│   ├── garage/               car photos
│   └── posts/                cover images for post write-ups
├── style.css                all styles, incl. dark mode + every section
└── script.js                nav transitions, timeline filter/year-jump,
                              dark mode toggle, lightbox
```

## Features

- **Timeline** (`index.html`) — chronological entries tagged `work` /
  `life` / `win`. Filter chips show just one category; year pills jump
  to a given year (and clear the filter first if needed so you don't
  jump to a hidden entry). The 🎲 **Surprise me** button scrolls to a
  random entry.
- **Gallery** (`gallery.html`) — a photo grid and a video grid, both
  wired to the same lightbox. Click anything to open it full-size;
  arrow keys or the on-screen arrows move between items; Esc or a
  click outside closes it.
- **Garage** (`garage.html`) — one card per car, each optionally
  linking to a full build story in `/posts/`.
- **Blog-style posts** (`/posts/`) — standalone detail pages for a
  project or car that's worth more than a card's worth of text.
- **Dark mode** — toggle button (🌙/☀️) in the nav. Remembers your
  choice in `localStorage`; falls back to the visitor's system
  preference if they haven't chosen; applied before first paint so
  there's no flash of the wrong theme.
- **Page transitions** — a screen-wipe effect between pages (an
  overlay grows from a line to full coverage, then shrinks away on
  the new page). Automatically skipped for anyone with "reduce
  motion" set.

## Customizing

### The basics

Search each HTML file for these placeholders and swap them for your
own — they're repeated in the footer of every page and the header of
a few:

- `Your Name`
- `you@example.com`
- `https://github.com/yourusername`
- `https://www.linkedin.com/in/yourusername`

### Add a timeline entry (`index.html`)

Copy an `.entry` block inside `<main id="timeline">`. Newest goes at
the top. Each one needs:

```html
<div class="entry" data-tag="work" data-year="2026">
  <div class="dot"></div>
  <div class="card">
    <span class="chip">🎯 work</span>
    <time>September 2026</time>
    <h2>Title</h2>
    <p>What happened.</p>
  </div>
</div>
```

`data-tag` must be `work`, `life`, or `win` (controls the dot color
and the filter chips). If you start a new year, add a matching
`<button class="year-pill" data-year="2027">2027</button>` to the year
nav.

### Add a career role (`career.html`)

Copy a `.role` block. Add a `<a class="read-more" href="posts/your-file.html">Read the full story →</a>`
line if you want it to link out to a full write-up.

### Add a car (`garage.html`)

Copy a `.car-card` block. Replace the placeholder `<div
class="placeholder-fill">` inside `.car-photo` with a real image:

```html
<img src="images/garage/your-car.jpg" alt="Your car, description">
```

### Add gallery photos/videos (`gallery.html`)

Each photo is a `.gallery-item`; each video is a `.video-item`. Copy
one and swap the placeholder for a real image the same way as above.

For videos, pick one:

```html
<!-- Hosted elsewhere (YouTube, Vimeo, etc.) -->
<div class="video-item" data-embed="https://www.youtube.com/embed/VIDEO_ID">

<!-- A file in images/videos/ -->
<div class="video-item" data-video="images/videos/your-clip.mp4">
```

### Add a full write-up (`/posts/`)

Duplicate `posts/example-project.html` (or `first-car.html`), rename
it, edit the content, and link to it from the matching card with a
`read-more`/`back-link` pair — see either existing post for the
pattern. Pages in `/posts/` sit one folder deeper, so their links to
CSS/JS/other pages all start with `../`.

## Local development

No build step needed — just serve the folder and open it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

(Opening `index.html` directly as a `file://` URL mostly works too,
but a local server avoids occasional relative-path quirks.)

## Deployment

This repo *is* the deployment — it's a `<username>.github.io` repo, so
whatever's on `main` is live at https://nimawithacomputa.github.io/
within a minute or two of pushing. No Actions or build config needed.
