# SupeRR Pressure Lab

Rajasthan Royals inspired analytics dashboard for **Kartikey Gupta's SupeRR Selector Season 2 Round 1 entry**. An independent participant project, with no official endorsement.

The study ranks historical late-innings pressure performance. It is not a retention or auction eligibility shortlist. The official final twenty remain fixed throughout every interactive view.

## Run locally

From this directory:

```sh
npm run dev
```

Open **http://127.0.0.1:4173/**. This command needs Python 3; the checks need Node.js 22 or later. No npm installation or runtime dependencies are required. Opening index.html directly as a file will not load the JSON data; use the HTTP server.

## Verify

```sh
npm test
npm run build
```

The tests reproduce the beta lower-tail index for every supported record, lock the verified final twenty, check pressure boundaries and bowling perspective, and verify search, sorting and data integrity. The build command checks the existing static output; it does not need the original competition files.

## Features

- RR inspired pink, navy, royal blue and gold design; self-hosted Manrope font.
- Responsive layouts, animated charts and transitions, light/dark themes, reduced-motion support.
- Auction-inspired selection room with holographic player cards, evidence on the reverse, stadium beams and an animated ranking ticker.
- A browser-local review board with add/remove, clear, player evidence and comparison actions. This never changes official selections or represents auction availability.
- A persistent animation pause control, with automatic respect for the device's reduced-motion setting.
- Immersive Cinema view, split-door entrance, stadium backdrop, broadcast name reveals, lens flares and a lit auction podium.
- An optional 7.5-second showreel, with play/pause, and a scrollable player vault for direct card selection. Cinema mode supports left/right arrows and Escape; no sound or automatic showreel playback.
- Real, locally hosted player portraits for the final twenty and Kohli's comparison profile. Photos appear on player cards, the vault, the review board, rankings, comparisons and player details; official source profiles are listed under Image credits.
- Official top tens and searchable full supported cohort: 117 batters and 132 bowlers.
- Player profiles with exposure, ordinary-state baseline, uncertainty and alternate scenario ranks.
- Same-role player comparisons, pressure-mask calculator and live index sandbox.
- Methodology, robustness, scope and the specific Kohli World Cup coverage gap.
- Derived-view CSV export and a downloadable submission report.

## GitHub Pages deployment

The included workflow validates the project and publishes **dist/** when main changes. In the GitHub repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**. Then push main (or run the workflow manually from Actions).

The expected GitHub Pages address for this repository is `https://kartikeyg0104.github.io/rr-dashboard/`. This address is only live after a successful deployment; confirm the returned Pages URL in GitHub before submitting it.

All assets use relative paths, including JSON, PDF, fonts and the icon. Navigation uses URL hashes, so GitHub Pages needs no SPA rewrites and supports the repository subdirectory.

For Vercel, import the repository; vercel.json sets the output to dist. For Netlify, netlify.toml does the same. No application server, API key, database or paid service is required.

## Data and limits

Only aggregate analytical outputs and the derived submission PDF are included. **Do not add the original proprietary CSV files, ball-by-ball data, model prediction arrays or the complete competition data pack to this repository.** Exported view CSVs are created only in the visitor's browser. The app has no tracking, remote fonts or analytics API calls.

There are 249 eligible **player-role records**, not necessarily 249 unique people. The score is the 10th percentile of Beta(w + 4, n − w + 4), multiplied by 100; it is not a future-success probability. Pressure uses the pre-delivery side-win proxy with the declared late-innings mask. Conditional bootstrap results keep models, labels and cohort fixed. The study is retrospective, with definition and coverage sensitivity.

The report PDF preserves the verified final list. The dashboard adds the explicit note that the supplied match inventory lacks Kohli's 2022 India–Pakistan World Cup fixture and 2024 World Cup final. That specific coverage note is not in the earlier PDF. Consistent augmentation across all players would be needed before making a broader claim.

Follow the competition's data-use rules and use the submission rationale only after personally reviewing and understanding it. Public hosting makes the derived analysis and PDF publicly readable; the original data pack remains excluded.

## Project structure

```text
dist/                     Deploy this directory
  index.html
  styles.css
  app.js                  UI and interactions
  lib.js                  Pure analysis helpers
  auction.js              Selection room and browser-local review board
  auction.css             Player cards, lighting and motion
  cinema.js               Cinematic presentation helpers
  cinema.css              Stadium, opening and immersive view
  photos.js               Portrait rendering and image credits
  photo-data.js           Player ID to verified photograph mapping
  photos.css              Cutout composition and portrait layouts
  assets/                 Derived aggregates, report, font and icon
tests/                    Reproducible analysis checks
scripts/verify.mjs         Static output checks
.github/workflows/pages.yml
```

Local source export utilities, source verification notes, QA output and optional private Sites metadata are ignored by Git and are not required to host the app. Manrope and Bebas Neue are distributed under the SIL Open Font License; their licenses are included in dist/assets/.

Player photographs remain copyright their respective owners. Credits and original source URLs are recorded in dist/assets/image-credits.json; uniforms in source photos do not imply current team membership, auction availability or Rajasthan Royals affiliation. No synthetic player likenesses are used.

The main spotlight card alone tilts gently and follows the pointer on desktop. Click/tap the card, use its flip button, or focus it and press Enter/Space to switch between the portrait and evidence. Hovering never flips it. All surrounding cards and controls remain level and stationary. Reduced-motion and Effects off disable pointer tilt while keeping manual evidence access available.
