# SkillTrade React intro

The final `intro_desktop.html` is preserved at the repository root as the design reference.
The React app structure was copied from `jane's-branch` (b2e51d05ee5de567502253f76d438da85a3b0f3a), without merging or changing that branch.

- `src/pages/introp1.js`: four chapter components, login preview, navigation, scroll effects, and lifecycle cleanup.
- `src/styles/intro.css`: original design and responsive styles scoped to `.skilltrade-intro`.
- `src/App.js`: renders the intro at `/`, using the existing router structure.
- `public/index.html`: document metadata and React mounting point.

Run from `webui/`:

```sh
npm ci
npm start
```

Verify with `CI=true npm test -- --watchAll=false --runInBand` and `npm run build`.

The login form remains a preview, as in the original HTML; it does not authenticate or send credentials. Backend login integration is separate work.

When combining with teammates' React work, keep their latest app shell and routes. Bring across this intro component and stylesheet, import the component, and render it at the agreed intro route. Avoid replacing unrelated routes. Dependencies match Jane's existing `webui/package.json` and lockfile.
