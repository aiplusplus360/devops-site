# DevOps Marketing Website

A fast, dependency-free marketing site for a DevOps / cloud engineering services
business. Plain HTML, CSS and JavaScript — no build step, no framework, no
`npm install` required.

---

## Quick start

**Option 1 — just open it.** Double-click `index.html`. Everything works.

**Option 2 — run a local server** (recommended, matches production more closely):

```powershell
cd E:\Devops
node serve.js
```

Then open <http://localhost:5173>.

---

## Where to edit things

You almost never need to touch the HTML. Content lives in two files:

| File | What's in it |
| --- | --- |
| `assets/js/config.js` | Company name, logo letters, contact details, social links, nav menu, the **free offer**, headline stats, announcement bar |
| `assets/js/data.js` | Services, process steps, testimonials, FAQ, engagement plans, icon set |
| `assets/js/tech.js` | The technology logos (AWS, Azure, Kubernetes, …) with their brand colours |
| `assets/img/` | Photography and the social preview image — see `CREDITS.md` in there |

### Replace the stock photos with your own

The site ships with real, freely-licensed photography, but **your own photos
will always convert better** — visitors can spot someone else's desk instantly.

Drop your files into `assets/img/` using the same filenames and nothing else
needs changing. Full list of files and dimensions is in
[`assets/img/CREDITS.md`](assets/img/CREDITS.md).

Where each photo is used:

| Photo | Placement |
|---|---|
| `hero-desk.jpg` | Homepage hero backdrop (washed to ~11:1 contrast behind the headline) |
| `band-workspace.jpg` | Homepage full-width photo band |
| `band-code.jpg` | Services page photo band |
| `services-hero.jpg` | Services page header |
| `band-desk.jpg` | About page header |
| `about-workspace.jpg`, `about-desk.jpg` | About page "In practice" figures |
| `contact-desk.jpg` | Contact page panel |
| `og-image.jpg` | Social sharing preview (1200×630) |

To use different filenames, edit the `--photo-*` tokens at the top of
`assets/css/styles.css` and the `src` attributes in the HTML.

> **Two rules worth keeping.** Don't put stock photos of strangers in
> testimonials, and don't use photos of identifiable people without a model
> release. The design deliberately uses initials for testimonials instead.

### Change your company name and contact details

Open `assets/js/config.js` and edit the `brand` and `contact` blocks. Every
header, footer, button and email link on every page updates automatically.

```js
brand: {
  name: "Northwind DevOps",
  monogram: "ND",
  legalName: "Northwind DevOps Ltd",
  ...
}
```

### Edit or disable the free offer

The offer banner is the lead magnet, defined in `config.js`. To remove it from
every page, set `enabled: false`:

```js
offer: {
  enabled: true,
  badge: "100% free · worth $1,500",
  title: "The 2-Hour Pipeline Rescue",
  intro: "...",
  deliverables: [
    { icon: "pulse", title: "Live bottleneck hunt", text: "..." },
    // 2–4 items works best
  ],
  scarcity: "Only 5 free slots each month",
  guarantee: "...",
  ctaLabel: "Claim a free slot",
  ctaHref: "contact.html?service=advisory",
  fine: "No credit card. No obligation.",
}
```

`icon` accepts any key from the `ICONS` map in `data.js`.

> **Keep the promises truthful.** Whatever you put in `guarantee` and `fine`,
> make sure you can genuinely honour it — a broken guarantee costs more trust
> than having none.

### Add a technology logo

Add an entry to `TECHNOLOGIES` in `assets/js/tech.js`:

```js
{
  id: "aws",
  name: "AWS",                              // label under the tile
  group: "Cloud Platforms",                 // see TECH_GROUP_ORDER
  color: "#FF9900",                         // brand hex -> mark + hover tint
  featured: true,                           // also show on the homepage
  svg: '<path d="..." fill="currentColor"/>',   // 24x24 viewBox
}
```

Or point at a real logo file instead of drawing one:

```js
{ id: "aws", name: "AWS", group: "Cloud Platforms", color: "#FF9900",
  file: "assets/logos/aws.svg" }
```

> ⚠️ **About the logos.** The marks shipped in `tech.js` are hand-authored,
> simplified vector representations — **not** the official vendor files.
> AWS, Microsoft and Google in particular publish strict brand guidelines and
> generally restrict logo use to approved partner badges. Before using this
> commercially, download the official assets from each vendor's brand page and
> swap them in via the `file:` field above.

### Add or remove a service

Copy a block inside `SERVICES` in `assets/js/data.js`:

```js
{
  id: "observability",          // used for anchor links + contact-form prefill
  icon: "chart",                // key from the ICONS map in the same file
  category: "Reliability",      // shown as the small pill on the card
  name: "Monitoring & Observability",
  summary: "One-line pitch shown in bold under the title.",
  bullets: ["First proof point", "Second", "Third"],
  featured: true,               // true = also shown on the homepage
}
```

Set `featured: false` to keep a service on the services page but off the homepage.

### Hide a whole section

- **Testimonials** — set `TESTIMONIALS` to `[]` and the section disappears.
- **Stats strip** — set `stats: []` in `config.js` and the strip disappears.
- **Announcement bar** — set `announcement.show` to `false`.

---

## Wiring up the contact form

Out of the box the form has **no backend** — it validates, then opens the
visitor's email client with everything pre-filled. Nothing to configure.

For a proper inbox submission, sign up for a free form endpoint
([Formspree](https://formspree.io), [Basin](https://usebasin.com), or Netlify
Forms) and paste the URL into `config.js`:

```js
contact: {
  form: {
    endpoint: "https://formspree.io/f/xxxxxxxx",
    fallbackEmail: "hello@example.com",
  },
}
```

Spam protection is already included via a hidden honeypot field (`_gotcha`).

---

## Deploying to your VPS

The site is 100% static, so you just need a web server pointed at the folder.
Ready-made configs are in `deploy/`:

| File | For |
| --- | --- |
| `deploy/nginx.conf.example` | nginx (Ubuntu/Debian, most VPS providers) |
| `deploy/htaccess.example` | Apache / cPanel / shared hosting |

### nginx in short

```bash
# 1. Upload the site (exclude the dev-only files)
rsync -av --delete /path/to/Devops/ /var/www/devops-site/ \
  --exclude 'Color pallete' --exclude 'serve.js' --exclude 'deploy' \
  --exclude 'README.md'

chown -R www-data:www-data /var/www/devops-site

# 2. Enable the server block
cp deploy/nginx.conf.example /etc/nginx/sites-available/devops-site
ln -s /etc/nginx/sites-available/devops-site /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 3. Edit the domain in it, then test and reload
nano /etc/nginx/sites-available/devops-site
nginx -t && systemctl reload nginx

# 4. Free HTTPS (also handles the http→https redirect)
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

The nginx config already handles: clean 404s, gzip, security headers, immutable
caching for `/assets/`, and `no-cache` for HTML so edits go live immediately.

### On cPanel

Upload everything into `public_html/`, then rename `deploy/htaccess.example`
to `.htaccess` (turn on "Show Hidden Files" in File Manager first).

### Other hosts

Cloudflare Pages, Netlify, Vercel and GitHub Pages all work too — build command
blank, output directory = root.

### Before you go live

- [ ] Replace `https://example.com` in every page's `<link rel="canonical">`,
      `og:url`, `sitemap.xml` and `robots.txt` with your real domain.
- [ ] Replace `Your Company` / `Your Company LLC` in `config.js`.
- [ ] Update the email, phone and social URLs in `config.js`.
- [ ] Update the `ProfessionalService` JSON-LD block in `index.html` (name, url).
- [ ] Do **not** upload `serve.js`, `README.md`, `deploy/` or `Color pallete/`.
- [ ] Point your host's 404 handler at `404.html`.

---

## Content integrity checks

Two throwaway Node scripts live in `deploy/`. Run them after editing
`data.js` — they catch typos that would otherwise fail silently in the browser.

```powershell
cd deploy
node check-content.js   # every service has a valid icon, unique id, real category
node check-render.js    # all 40 services render, section slugs are unique, HTML hooks exist
```

Both exit non-zero on failure, so you can wire them into a pre-deploy step.

---

## Project structure

```
E:\Devops
├── index.html          Homepage — hero, services, process, proof, plans, FAQ
├── services.html       All 40 services, grouped into 7 categories + tech stack
├── about.html          How we work, principles, engagement models
├── contact.html        Contact form + FAQ
├── 404.html            Not-found page
├── serve.js            Local preview server (dev only, don't upload)
├── robots.txt
├── sitemap.xml
├── README.md
├── deploy/             Server configs + content checks (don't upload)
│   ├── nginx.conf.example
│   ├── htaccess.example
│   ├── check-content.js
│   └── check-render.js
└── assets
    ├── css/styles.css  Design system, all styling
    └── js
        ├── config.js   ← your brand & contact details
        ├── data.js     ← your content (40 services, FAQ, plans…)
        └── main.js     Renders content and wires up interactions
```

---

## Design system notes

Colours were sampled from your brand palette and are defined once at the top of
`assets/css/styles.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--navy-900` | `#1B1B30` | Page background |
| `--navy-700` | `#272743` | Raised surfaces |
| `--steel-600` | `#2D698D` | Primary brand blue |
| `--mint-300` | `#B8E9E6` | Accent / highlights |
| `--ice-100` | `#E3F5F5` | Light tint |

Change a token and it cascades through the whole site.

## Extras already built in

- 40 services on `services.html`, auto-grouped into 7 categories with a jump nav
  and per-section counts — all generated from `data.js`
- Responsive from 320px up, with an animated mobile menu
- Scroll-reveal animations — opt any element in by adding `class="reveal"`
- `prefers-reduced-motion` respected throughout
- Sticky glass header, active-page highlighting
- SEO: canonical URLs, Open Graph tags, JSON-LD structured data, sitemap, robots
- Accessible: skip link, focus-visible rings, ARIA on the nav toggle, semantic landmarks
- Contact form validation, honeypot spam trap, and `?service=` / `?plan=` prefill
  (service cards and plan buttons deep-link into the form with the topic selected)

### Animating a number

Add `data-count` to any element to count it up on scroll:

```html
<span data-count="99.95" data-decimals="2" data-suffix="%"></span>
```
