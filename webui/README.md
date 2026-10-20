# Frontend

The React app lives here. Start with `src/pages/intro.js` for the intro, `src/styles/intro.css` for styling, and `src/App.js` for routes.

For Docker commands and the project map, see the [project README](../README.md).

## Run without Docker

From this folder:

```sh
npm ci
npm start
```

Open http://localhost:3000. Stop with Ctrl+C.

## Check changes

```sh
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

`build/` is generated output; don't commit it. Login is still a preview.
