# Reliability FAQ

React adaptation of the saved `Desktop-layouts/reliability-faq.html`. Preserves all
seven answers, search/reset, expandable answers, the rating-versus-reliability
comparison, the clearly labelled example score, and meetup guidance.

## Flow

Help → **How does reliability work?** → `/reliability-faq`.

The rating page's reliability explanation links to the same article. The two FAQ
articles link to each other. Support, rating, meeting-location, location-sharing,
and arrival preview links all use existing React routes.

No reliability score is calculated or changed. The 4.5/5 score is explicitly an
illustration, and the copy does not invent a formula, update schedule, cancellation
penalty, or guaranteed score correction. The original standalone page is unchanged.

## Reading the code

A plain `questions` array holds the saved article's questions, paragraphs, and
optional links. One state variable tracks search; a ref returns focus to the
search field after clearing. Filtering checks the question and answer text,
ignores case, and trims extra whitespace. Native `details`/`summary` provide the
expand/collapse behavior and keyboard support. The query in each key resets
matching answers to open after searching, then restores the initial first-answer
view when cleared. No new packages or custom accordion framework are used.

## Design and feedback

Like the saved HTML, this page reuses the Skill points FAQ stylesheet. That keeps
its typography, spacing, card rounding, colors, and control states consistent
without a duplicate stylesheet. Scoped classes contain the styles. Desktop has
two columns in an 1184px container; below 760px the sidebar stacks beneath answers.
Links/inputs meet 44px minimum targets and summaries are at least 60px tall.

| Control | States |
| --- | --- |
| Search | Empty, typing, hover/focus, clear |
| Answers | Initial first answer open, collapsed, expanded, keyboard focus |
| Results | Seven answers, filtered/open matches, live count, no matches, reset |
| Navigation | Help entry, rating entry, related FAQ, support, meetup previews |

Search is immediate and local. Reset restores the answers and focuses search.
The result count uses a status region. Focus and hover states match the existing
FAQ, and the sample score is distinguished from the user's account score.

Tests cover initial content, answer-text filtering, case/whitespace, clear/reset,
empty results, entry from Help/rating/Skill points, and article destinations.
Browser checks cover 1280px/320px layouts, no horizontal overflow, minimum targets,
keyboard expansion, searching, and connected help links. All existing tests and
the production build pass.

The integration starts after main's merge-and-revert pair ending in 8d0f353;
it does not restore the reverted teammate changes.
