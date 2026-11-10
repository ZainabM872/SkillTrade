# Location shared

React adaptation of the saved `Desktop-layouts/location-shared.html`, CSS, and
JavaScript. Keeps the illustrative map, selectable markers, stop-sharing dialog,
private state, resume control, meeting instructions, and arrival confirmation.
The sample details match the existing in-person Skating basics session with Sara.

## Flow

`/teaching-session-details` → **Share / view location** → `/location-shared`

The session passes its edited instructions and arrival state through React Router.
The back link carries these values back so they remain consistent during this
round trip. Direct visits use the same default meeting details. These values are
preview state, not backend records.

Select a marker to see its description. **Stop sharing** opens a native dialog;
**Keep sharing** or Escape cancels it, and confirmation hides the sample map.
**Share location again** restores it. The written meeting instructions remain
visible while sharing is off. **I've arrived** shows a local confirmation and
becomes disabled. The separate Arrived page is not integrated yet.

## Reading the code

The component uses ordinary `useState` values for sharing, the selected marker,
and arrival. `markerDetails` holds the three descriptions. Named functions handle
stopping/resuming sharing and marking arrival. Two refs open/close the native
`dialog` and return focus to its trigger. There are no new dependencies or map
services, and no geolocation requests or notifications are sent.

## Feedback and design

- Matches Teaching locations and Rate session: navy text, purple accents,
  off-white background, rounded cards, 1184px desktop container.
- Two columns use desktop space; below 760px the controls stack below the map.
- CSS variables define page colors; styles are scoped to `.location-shared-page`.
- Markers and links meet 44px minimum targets; action buttons are 52px tall.
- Markers expose pressed state; status regions announce selection and arrival.

| Control | States |
| --- | --- |
| Map markers | Normal, hover, keyboard focus, selected, disabled when sharing is off |
| Sharing | On, confirmation dialog, cancelled, off, resumed |
| Dialog | Native modal focus, Tab navigation, Escape dismissal, focus returned to trigger |
| Arrival | Ready, marked, disabled after confirmation |

Automated checks cover markers, stop/cancel/resume, arrival, and navigation with
edited instructions and arrival state. Browser checks cover desktop/mobile
layout, minimum targets, modal keyboard controls, and sharing states.
