# Project brief for coding agents

Dog Walk & Family Adventure Finder is a client-side map that finds dog walks and family points of interest around the user's location. React 19 and Vite in plain JavaScript (no TypeScript), Leaflet through react-leaflet. There is no backend. It is published to GitHub Pages at <https://up160.github.io/dog-walk-finder/> from the `gh-pages` branch.

`README.md` is still the Vite template, so this file is the project description until the README is written.

## How work is done

- Every piece of work is a GitHub issue, opened before any code. One branch and one pull request per issue, based on `main`. The PR body says `Closes #N`.
- **Ideas board.** Anything the owner asks for that isn't being done now becomes an issue labelled `idea` straight away, with their words and context. Mention the issue number in the reply.
- Plan first for anything beyond a small fix: outline the change and get it agreed before writing code. If something is ambiguous, ask; don't choose silently. Ask as multiple-choice questions with the recommended option first, as many as the work needs.
- Stay inside the issue's scope. Anything else found along the way becomes a new issue or a note in the PR, not extra code.
- A decision that is costly to reverse gets an ADR in `docs/adr/` (Nygard style), drafted and agreed with the owner before it is accepted.
- British English in copy, comments, docs and commit messages. Replies to the owner are short but technical: answer first, skip explanations of basics.
- Before opening a PR: `npm run lint` and `npm run build` pass. There are no tests and no CI, so also run `npm run dev` and check the change in the browser. Record what was checked in the PR, and never claim something was verified when it wasn't.
- The agent squash-merges its own PR once those checks pass.
- Merging doesn't publish. `npm run deploy` builds and pushes to `gh-pages`; run it only when the owner asks.

## Rules that matter

- Everything runs in the browser. Preferences are kept in `localStorage` under `dwf_` keys; there is no account and no server to add one to.
- Points of interest come from the public Overpass API (`src/overpass.js`). Keep queries bounded by the selected radius and the active categories, so the app stays a polite user of a free service.
- Walk types, radii and point-of-interest categories are data in `src/constants.js`. Change them there, not in components.
- Map tiles are Ordnance Survey when `VITE_OS_API_KEY` is set and OpenStreetMap otherwise. Both paths must keep working, with the correct attribution shown.
- Any `VITE_` variable is compiled into the public bundle. Treat `VITE_OS_API_KEY` as public once deployed, and never put a secret in a `VITE_` variable.

## Environment

- `npm install`, then `npm run dev`. Copy `.env.example` to `.env` to use Ordnance Survey tiles locally; `.env` is never committed.
- The browser Geolocation API needs HTTPS or `localhost`.
