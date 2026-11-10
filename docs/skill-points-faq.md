# Skill points FAQ

React adaptation of the saved `Desktop-layouts/skill-points-faq.html`, CSS, and
JavaScript. Preserves the six answers, search/reset, empty results, points-cycle
sidebar, example session cost, and booking checklist. The standalone source is unchanged.

## Flow

- Help → **How do skill points work?** → `/skill-points-faq`.
- Profile → **How points work** or the points link → the same article.
- The older `/points` address redirects to `/skill-points-faq`.
- Article links open Profile, Contact support, the rating preview, and Meeting location.

The example cost is clearly separate from the user's balance. No point transfers,
refund amounts, or cancellation penalties are invented. The article describes
where to review those conditions in the session flow; no backend was added.

## Reading the code

A plain `questions` array holds the saved copy, paragraphs, and optional links.
The component has one search state value and one ref for restoring input focus.
It trims the query, ignores case, and filters both questions and answer text.
Native `details` and `summary` provide expandable answers and keyboard behavior.
The key includes the query so a changed search opens matching answers and clearing
returns to the initial view with the introductory answer open. `clearSearch`
resets the field and focuses it. No search package or custom accordion is needed.

## Feedback and design

Matches the integrated pages' navy/purple palette, light background, rounded cards,
header, and 1184px desktop container. Desktop uses two columns; below 760px the
points-cycle and example cards stack below the answers. Scoped CSS variables and
selectors prevent changes to other pages. Saved CSS is expanded into readable rules.

| Control | States |
| --- | --- |
| Search | Empty, typing, hover, visible keyboard focus, clear |
| Answers | Introductory answer open, collapsed, expanded, hover, keyboard focus |
| Results | All six, matching count, matches open, no results, reset |
| Links and reset | Hover/focus, at least 44px targets |

Search is immediate and local, so no artificial loading indicator is needed.
The result count uses a status region. Empty results offer a reset action that
returns focus to search. Native summary targets are at least 60px tall and action
buttons/links at least 44px tall.

Tests cover initial content, matching answer text, case/whitespace, clearing,
empty/reset states, navigation from Help/Profile, and article destinations.
Browser checks cover keyboard expansion, search/reset, 1280px/320px layouts,
minimum targets, Help/Profile entry, and the `/points` redirect. All existing
page tests and the production build pass.
