# Personal site

Editorial dark personal CV/portfolio. React + Vite + Tailwind CSS v4. Fraunces serif display type, copper accents, Lenis smooth scrolling, custom cursor, marquee, line-mask reveals.

## Run locally

Requires [Node.js](https://nodejs.org) 20+.

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Edit your content

All content lives in two files — no need to touch components:

- `src/data/profile.js` — name, role, tagline, about, skills, experience, socials, portal URL
- `src/data/projects.js` — project cards

Drop your CV at `public/cv.pdf` to make the download button work.

## Deploy (Cloudflare Pages)

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build command: `npm run build` — output directory: `dist`.
4. Optional: add your custom domain under the project's Custom domains tab.

## Home server portal

`portalUrl` in `src/data/profile.js` points to the lock icon in the nav and the
`portal --auth` link in the footer. Set it to your Cloudflare Tunnel hostname
(e.g. `https://portal.yourdomain.com`) once that's set up.
