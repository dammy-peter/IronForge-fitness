# IronForge Fitness — Gym Website Template (Version 1)

A premium, dark-themed, multi-page gym website template built with plain
HTML5, CSS3 and vanilla JavaScript. No frameworks, no backend, no build
step — open `index.html` in a browser and it works.

This template ships with fictional demo content for **IronForge Fitness**,
a gym in Lekki, Lagos, Nigeria. It's designed to be re-branded quickly for
any real gym client.

## 1. Project Overview

- 12 pages: Home, About, Classes, Class Detail, Trainers, Trainer Detail,
  Membership, Gallery, Blog, Blog Detail, Contact, 404.
- Shared design system (colors, type, spacing) driven by CSS custom
  properties in `css/variables.css`.
- All brand data (name, phone, WhatsApp, email, hours, socials) lives in
  one place: `js/config.js`.
- No backend, no database, no payments, no authentication — this is a
  frontend presentation layer only (see section 12).

## 2. How to Run It

No build tools or installs required.

1. Download/unzip the project.
2. Open `index.html` directly in a browser, **or**
3. Serve it locally for the best experience (recommended, avoids any
   browser file:// restrictions):
   ```bash
   # Python 3
   python3 -m http.server 8000
   # then visit http://localhost:8000
   ```
4. Click through the navigation — every page and link in the template is
   wired up.

## 3. Folder Structure

```
gym-template/
├── index.html, about.html, classes.html, class-detail.html,
│   trainers.html, trainer-detail.html, membership.html,
│   gallery.html, blog.html, blog-detail.html, contact.html, 404.html
├── robots.txt
├── sitemap.xml
├── css/
│   ├── reset.css        – element reset
│   ├── variables.css     – design tokens (colors, type, spacing, radius)
│   ├── base.css          – global typography, forms, focus states
│   ├── layout.css        – header, footer, nav, page hero, containers
│   ├── components.css    – buttons, cards, FAQ, gallery, plan cards…
│   ├── pages.css         – page-specific layout (home hero, detail pages…)
│   └── responsive.css    – breakpoint refinements
├── js/
│   ├── config.js         – gymConfig object (brand data) + auto-fill helper
│   ├── navigation.js     – mobile menu, sticky header, active nav link
│   ├── main.js            – scroll reveal, FAQ accordion, back-to-top
│   ├── gallery.js         – gallery filtering + lightbox
│   ├── filters.js         – trainer/blog category filtering
│   └── forms.js           – contact form validation (frontend only)
└── assets/
    ├── images/ (hero, trainers, classes, gallery, blog, facilities)
    └── icons/
```

## 4. How to Change the Gym Name, Tagline & Contact Info

Open `js/config.js` and edit the `gymConfig` object:

```js
const gymConfig = {
  name: "IRONFORGE FITNESS",
  shortName: "IronForge",
  tagline: "Train Hard. Live Strong.",
  location: "Lekki, Lagos, Nigeria",
  phone: "+234 800 000 0000",
  whatsapp: "+234 800 000 0000",
  whatsappHref: "https://wa.me/2348000000000",
  email: "hello@ironforgefitness.com",
  ...
};
```

Elements marked `data-gym-text="phone"` / `data-gym-href="whatsappMessage"`
across every page automatically pick up these values on page load — you
only need to edit them once, in this one file.

The **brand name in the logo, footer heading and copyright line**, plus a
few longer passages of marketing copy, are written directly into the HTML
for full control over wording — update those with find-and-replace across
the HTML files if you rename the gym.

## 5. How to Change Colors

Open `css/variables.css`. The whole palette is defined at the top:

```css
--color-bg: #090909;
--color-surface: #111111;
--color-card: #181818;
--color-text: #ffffff;
--color-muted: #a7a7a7;
--color-accent: #c8ff00;
```

Change `--color-accent` to re-skin every button, active nav link, icon and
highlight across all 12 pages instantly.

## 6. How to Change Images

Every image is a normal `<img src="...">` tag with descriptive `alt` text.
This template uses royalty-free stock photo URLs as realistic placeholders.
To use a real gym's photography:

1. Drop your images into `assets/images/<category>/` (hero, trainers,
   classes, gallery, blog, facilities).
2. Replace the `src` attribute on the relevant `<img>` tag with your local
   path, e.g. `assets/images/hero/hero-main.jpg`.
3. Update the `alt` text to describe your actual photo.

## 7. How to Change Prices

Membership prices appear on `index.html` and `membership.html` inside the
`.plan-card__price` elements (Starter / Pro / Elite), plus the comparison
table and add-ons section on `membership.html`. Search for `&#8358;` (the
Naira sign) to find every price instance and update the figures — these
are clearly demo numbers meant to be replaced for a real client.

## 8. How to Change Trainers

Trainer cards appear on `index.html`, `about.html`, `trainers.html` and
`trainer-detail.html`. Each card has a name, role, specialty tag and photo
— update the text and `src` attributes directly. `trainer-detail.html` is
a reusable template: duplicate it per trainer (or wire it to a CMS in a
future version) and update the bio, certifications and classes taught.

## 9. How to Change Classes

Class cards live on `index.html` and `classes.html`; the weekly timetable
appears in both the desktop `<table>` and the mobile `.day-card` markup —
keep both in sync when you edit the schedule. `class-detail.html` is a
reusable template for any single class.

## 10. How to Change Contact Information

Update `js/config.js` for phone, WhatsApp, email and hours (auto-applied
everywhere), and the `.contact-info-list` block on `contact.html` if you
want to change the icons or add new contact methods. The footer opening
hours are written directly in `layout.css`'s footer markup inside each
HTML file's footer section — update those three lines if hours change.

## 11. How to Change the WhatsApp Number

Edit `whatsappHref` and `whatsappMessage` in `js/config.js`:

```js
whatsappHref: "https://wa.me/2348000000000",
whatsappMessage: "https://wa.me/2348000000000?text=Hi%20IronForge...",
```

This updates the floating WhatsApp button, mobile menu button and every
WhatsApp CTA across the site automatically.

## 12. How to Deploy

This is a fully static site — it can be hosted anywhere that serves plain
files:

- **Netlify / Vercel** — drag and drop the `gym-template` folder, or
  connect a Git repo.
- **GitHub Pages** — push the folder to a repo and enable Pages.
- **Any shared hosting / cPanel** — upload the folder contents to your
  public_html directory.
- Update `sitemap.xml` and the `canonical` / `og:url` meta tags in each
  page's `<head>` with your real production domain before launch.

## 13. Features Intentionally NOT Included in Version 1

This is a **frontend presentation layer only**. The following are
intentionally out of scope for Version 1 and are reserved for later
versions:

- User authentication / accounts
- Database or backend of any kind
- Member dashboard / admin dashboard
- Online payments (Paystack, Flutterwave, etc.)
- Class booking backend (the timetable is static/display-only)
- Membership management or recurring billing
- Trainer login
- Email backend for the contact form (it validates in-browser only)
- AI chatbot / AI fitness assistant
- QR check-in, workout tracking, progress tracking

The frontend has been structured (clear config object, semantic markup,
modular CSS/JS) to make adding these features in Version 2/3 easier —
without needing a rebuild from scratch.

## 14. Browser & Accessibility Notes

- Responsive from 320px up to 1920px+.
- Keyboard-navigable: mobile menu, FAQ accordion and gallery lightbox all
  support Escape to close and Enter/Space to activate.
- Respects `prefers-reduced-motion`.
- Semantic HTML5 landmarks (`header`, `nav`, `main`, `section`, `footer`).

Enjoy building on top of IronForge Fitness!
