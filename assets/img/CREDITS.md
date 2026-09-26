# Image credits

## Brand assets — first-party artwork

`logo.png`, `favicon-32.png` and `favicon-180.png` are the project's own brand
artwork, not stock photography, so they are not covered by the licence below.

| File | Dimensions | Notes |
|---|---|---|
| `logo.png` | 168×105 | Header and footer logo, displayed at 56×35 (exactly 3× for retina). Trimmed to the artwork's bounding box from the supplied source. Keep the 1.6:1 ratio, and keep the `width`/`height` attributes on the `<img>` in step with the `height` in `.brand__logo` — a mismatch makes the logo render at source size and burst out of the header. |
| `favicon-180.png` | 180×180 | Apple touch icon. The mark is composited onto white rather than left transparent so it stays legible on both light and dark browser tab bars. |
| `favicon-32.png` | 32×32 | Browser tab icon, downscaled from the 180px version. |

To change the logo, replace those three files and leave `SITE.brand.logo` in
`assets/js/config.js` as it is. Setting that value to `""` falls back to the
`TT` monogram tile (`.brand__mark`).

## Photography

Every photo in this folder is a real photograph, free for commercial use under
the [Unsplash License](https://unsplash.com/license) (attribution not required,
but given here as a courtesy).

| File | Photographer | Source |
|---|---|---|
| `hero-desk.jpg` | *(see note below)* | https://images.unsplash.com/photo-1555949963-aa79dcee981c |
| `services-hero.jpg` | Alejandro Escamilla | https://unsplash.com/photos/yC-Yzbqy7PY |
| `band-workspace.jpg` | Alejandro Escamilla | https://unsplash.com/photos/LNRyGwIJr5c |
| `band-desk.jpg` | Alejandro Escamilla | https://unsplash.com/photos/ABDTiLqDhJA |
| `band-code.jpg` | Vadim Sherbakov | https://unsplash.com/photos/Hi9GSwWkCJk |
| `about-workspace.jpg` | Alejandro Escamilla | https://unsplash.com/photos/xII7efH1G6o |
| `about-desk.jpg` | Aleks Dorohovich | https://unsplash.com/photos/nJdwUHmaY8A |
| `contact-desk.jpg` | Alejandro Escamilla | https://unsplash.com/photos/N7XodRrbzS0 |

## Hero background — one thing to confirm

`hero-desk.jpg` currently holds a code-editor photo rather than the original
desk shot. Its source is:

    https://images.unsplash.com/photo-1555949963-aa79dcee981c

Unsplash does not serve the public page for this asset to unauthenticated
requests, so **the photographer's name could not be recorded here.** Please open
that URL, confirm the attribution, and fill in the table row above before you go
live. The image is under the Unsplash License either way.

If you would rather restore the previous hero photograph, it was by
Alejandro Escamilla: <https://unsplash.com/photos/y83Je1OC6Wc> — drop it back in
at 1920×1180.

## Swapping in your own photos

**This is strongly recommended.** Real photos of your own team, dashboards and
infrastructure will always beat stock photography for trust — visitors can tell
the difference, and stock images of someone else's desk are the single most
common tell that a site is a template.

Drop your files into this folder using the **same filenames**, matching these
dimensions, and nothing else needs to change:

| Filename | Dimensions | Where it appears |
|---|---|---|
| `hero-desk.jpg` | 1920×1180 | Homepage hero background |
| `services-hero.jpg` | 1920×900 | Services page header |
| `band-workspace.jpg` | 1600×900 | Homepage photo band |
| `band-desk.jpg` | 1600×900 | About page photo band |
| `band-code.jpg` | 1600×900 | Spare — swap into any `.band` |
| `about-workspace.jpg` | 1280×940 | About page, inline figure |
| `about-desk.jpg` | 1100×820 | About page, inline figure |
| `contact-desk.jpg` | 1500×950 | Contact page side panel |

To use different filenames instead, update the `--photo-*` tokens at the top of
`assets/css/styles.css` and the `src` attributes in the page HTML.

## Before you go live

- **Compress your replacements.** Aim for under ~200 KB each. Photoshop's
  "Export As", [Squoosh](https://squoosh.app) with WebP, or `cwebp -q 80` all work.
- **Serve WebP or AVIF** if your host supports it — typically 30–50% smaller
  than JPEG at the same visual quality.
- **Avoid photos of identifiable people** unless you have a signed model
  release. This is why no stock photo of a person's face is used anywhere on
  this site.
- **Never use stock photos in testimonials.** Attaching a stranger's face to a
  quote you wrote is misrepresentation. The testimonials on this site use
  initials instead.
