# Digital Works Rebuild Notes

## Structure

The rebuilt `DIGITAL WORKS` chapter follows the reference interaction as a three-layer scene:

1. Fixed layer: `CONTACTS`, `MENU`, and the large bottom `DIGITAL` word.
2. Background layer: full-screen looping project videos, dimmed with black overlays.
3. Content layer: a homepage-yellow panel rises from the bottom, the active project video card opens from a small clipped rectangle into a large center frame, and the project title fades in over the card.
4. Review layer: clicking the active project video opens a full-screen video viewer and restarts the selected video from `0s`.

## New Video Assets

The chapter now uses the newly provided videos:

- `/videos/digital/light-tide-field.mp4`
- `/videos/digital/pink-lily-new.mp4`
- `/videos/digital/metahuman-trailer.mp4`

Generated poster frames live in:

- `/images/digital/light-tide-field-cover.jpg`
- `/images/digital/pink-lily-new-cover.jpg`
- `/images/digital/metahuman-trailer-cover.jpg`

## Scroll Motion

The section uses scroll progress to drive CSS variables from `src/App.jsx`:

- `--digital-panel-y`: yellow panel rise, from `62vh` to `0`.
- `--digital-card-width` / `--digital-card-height`: card opens from `52vw x 30vh` to `92vw x 74vh`.
- `--digital-card-y`: card moves from `40vh` to `0`.
- `--digital-card-scale`: card scale moves from `.88` to `1`.
- `--digital-title-opacity` and `--digital-title-y`: title fades up using an expo-out feel.
- Tail handoff: after the last project scene, cards and titles fade out and the page proceeds directly into the portfolio tail.

## Video Clarity And Playback

The inline project cards prioritize the actual video layer over poster frames:

- The card video is fully opaque and uses only light contrast/saturation tuning.
- Heavy dark overlays, screen blending, and strong brightness reduction are avoided.
- The full-screen viewer uses `object-fit: contain` so the video is not cropped or enlarged beyond its natural framing.
- Each click creates a fresh selected video state and resets playback to the beginning.

The easing follows the supplied reference:

- Main panel: `cubic-bezier(0.22, 1, 0.36, 1)` equivalent.
- Card opening: expo-out equivalent.
- Title: delayed ease-out fade and upward settle.

## Edit Points

Project data is in `src/App.jsx` under `digitalWorks`.

Final visual rules are appended at the end of `src/styles.css` under:

```css
/* Digital works final rebuild: yellow motion-stage interaction. */
```

Changing the section timing is easiest through the section height:

```css
.digital-works-section {
  height: 360svh !important;
}
```

Increasing this value slows the chapter down. Reducing it makes project transitions happen faster.
