# Intro page

- `webui/src/pages/intro.js`: discover, share, points and login chapters, navigation and scroll effects.
- `webui/src/styles/intro.css`: layout, animations and responsive styles.
- `webui/src/App.js`: renders the intro at `/`.
- `webui/public/index.html`: page title, metadata and React mounting point.
- `docs/design/intro_desktop.html`: original standalone design reference.

The login form is a preview. It does not authenticate or send credentials. Password visibility, chapter navigation, reduced motion and cleanup are covered by the existing tests in `webui/src/App.test.js`.

Keep shared routes in `App.js` as more pages are added. The styles are scoped to `.skilltrade-intro`.

See the [project README](../README.md) for run and test commands, or [Docker setup](docker.md) for container details.
