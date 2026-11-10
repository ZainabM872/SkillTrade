# Meeting location

React adaptation of the saved `Desktop-layouts/meeting-location.html`, CSS, and
JavaScript. Keeps Alex's two approved places, selectable cards, live booking
preview, saved confirmation, and change-location action.

## Flow

Profile → **Preview a guitar meeting location** → `/meeting-location`

Choose Mac Hall or TFDL, then **Confirm meeting location**. The confirmation offers
**Change location** and **Continue to finding each other**. The latter opens
`/location-shared` with Alex's session, chosen venue, and matching instructions.
The sharing page's back link returns here. The existing teaching-session entry
still shows Sara's separate skating session.

This is a frontend preview. The chosen ID is saved only in this browser under
`skilltrade.meetingLocation.demo.v1`; no booking request or point transfer is sent.
The two options are the sample teacher's approved places, not the current user's
Teaching locations entries.

## Reading the code

`places` holds the two choices. Ordinary React state tracks the selected and
saved IDs, confirmation, saving, and errors. Named handlers keep each action
separate:

- `readSavedLocation` accepts only a known ID from browser storage.
- `chooseLocation` updates the draft and clears errors.
- `confirmLocation` validates, saves, then shows confirmation; failed writes keep
  the selection available for retry.
- `changeLocation` reopens the form with the saved choice selected.

Radio inputs provide native Tab/arrow-key controls. Refs focus the missing choice,
saved choice, or success heading. A plain `meetingSession` object passes the
booking context to the existing sharing page through React Router. No new
packages or services are needed.

## Design and feedback

Uses the same off-white background, navy text, purple accents, card rounding, and
1184px desktop container as the previously integrated pages. Page colors use CSS
variables; selectors are scoped to `.meeting-location-page`. Desktop uses two
columns with a sticky summary. Below 760px it stacks into one column. The entire
location card is clickable; links are at least 44px tall and buttons 52px tall.
The saved preview is preserved and CSS is expanded into readable rules.

| Control | States |
| --- | --- |
| Location cards | Empty, hover, keyboard focus, selected, disabled while saving |
| Confirm | Hover/focus, saving label, disabled, missing-choice error, failed-save retry |
| Preview | Empty guidance, live chosen place and instructions |
| Confirmation | Saved choice, focused heading, change action, continue link |

Automated tests cover validation, preview updates, saving/reload, changing a saved
choice, invalid stored IDs, failed writes/retry, and both choices continuing into
sharing and returning. Existing sharing, rating, intro, and teaching-location
tests also pass. Browser checks cover 1280px/320px layouts, minimum targets,
arrow-key selection, reload, and both meeting places in the sharing view.
