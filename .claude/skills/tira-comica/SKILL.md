---
name: tira-comica
description: "Trigger: tira cómica, viñetas, cómic, monigotes, comic strip carousel for a social piece. Generate the panels of a humorous comic-strip carousel (black-and-white stick figures, Spanish speech bubbles) with Codex image generation on the owner's ChatGPT account, with Google Flow as fallback."
license: Apache-2.0
metadata:
  author: "nuriaromerodev"
  version: "0.2"
---

## Activation Contract

Use when a social piece is a comic strip: a carousel of 4 humorous panels about a situation a local business owner lives through, ending with one lesson card. The panel script (scene, characters, exact dialogue, caption and screen text per panel) comes from the piece's copy file, written by the copywriter from the brief. This skill only draws the panels; it never writes or changes any text.

Pending strip ideas live in `social/ideas-pendientes.md`.

## Hard Rules

- Every text in the image (bubbles, caption boxes, phone screens, shop signs) is copied verbatim from the piece's copy file. A missing or ambiguous line: stop and report; never invent text.
- Characters must be identical across panels and strips: always pass their sheet from `social/tiras/personajes/`.
- No logos, no brand marks, no stripes on clothing (they read as a sports brand), no real app interfaces: phones show a generic map, call or review screen. A character may say "Google"; the Google logo is never drawn.
- No real people, no client data, no real business names: shops are invented ("Ferretería Paco").
- Only our own images as references (sheets and panels of our strips). Never a third-party comic.
- Generate panels one at a time, in order: the script's recovery step needs it, and approved panels feed the next ones.
- Review every panel yourself before keeping it (step 4). At most 2 retries per panel, whatever the reason; then stop and report which check fails.
- Nothing here is published. The piece still goes through `/team-harness:social` (`produce`, `submit`, owner approval). Never edit `state.json`.
- Image generation spends the owner's ChatGPT quota: generate only the panels of the requested piece.

## Characters

| Sheet                                 | Who                                                                                            |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `social/tiras/personajes/paco.png`    | Paco, recurring protagonist, shop owner: bald, thick black moustache, white shirt, green apron |
| `social/tiras/personajes/clienta.png` | A customer: ponytail, plain white t-shirt, trousers, shoulder bag, no colour                   |
| `social/tiras/personajes/cunado.png`  | Paco's brother-in-law: white cap, spiky hair, blue t-shirt, shorts                             |

Colour accents identify characters: green is Paco's only. A new character gets a colour no one else has.

**New character.** Before its first panel, generate its sheet with the script (template below), passing an existing sheet as style reference and saying in the prompt that the reference is for style only and that its character must not appear. Review it, save it to `social/tiras/personajes/<name>.png` and add a row here. Until the owner approves the strip, the sheet is provisional.

## Decision Gates

| Situation                                                  | Action                                                                                  |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Script exits 0                                             | Review the panel (step 4)                                                               |
| Script exits 3 (not logged in), or ChatGPT quota exhausted | Flow fallback: load the `flow-media` skill, image mode, same sheets and prompt          |
| Flow shows a points cost above 0 for images, or no credit  | Stop and report; never pay                                                              |
| Script exits 4 (no image)                                  | Retry once; counts as a retry                                                           |
| A text misspelled (accent, ¿¡, wrong word)                 | Retry with the line repeated after "EXACT TEXT:"; counts as a retry                     |
| A character drifts (nose, ears, hair, clothes, colour)     | Retry passing only that character's sheet plus the last approved panel where it appears |
| Style drifts (hatching, shading, realistic detail)         | Retry adding "same flat line style as the sheet, no hatching or shading"                |

## Execution Steps

1. Read the piece's copy file and list, per panel: scene, characters, exact bubble lines, caption box, screen or sign text.
2. Panels go to `<piece>/vinetas/panel-0N.png`. The script creates the folder, keeps a replaced attempt as `panel-0N.tryK.png` and writes Codex logs to `<piece>/vinetas/logs/`.
3. For each panel, in order:

```bash
.claude/skills/tira-comica/scripts/generar-vineta.sh <piece>/vinetas/panel-0N.png \
  social/tiras/personajes/<each character in the panel>.png \
  [<last approved panel of this strip where that character appears>] -- "<prompt>"
```

References: the sheet of every character in the panel, plus at most one earlier approved panel of the strip that shows one of them. A panel with no recurring character still needs one reference: pass a sheet and add "the reference is for style only; that character does not appear".

Panel prompt template (English instructions, Spanish text verbatim):

> Style: match EXACTLY the attached reference images: black and white hand-drawn stick figures, plain circle heads with no nose and no ears, thick ink lines, no hatching or shading, handwritten lettering, speech bubbles, flat white background; colour only as small accents (each character's own colour, yellow stars or sun, red map pins). Each character must look identical to its sheet. Portrait 4:5. No logos, no brand marks, no stripes on clothes, no real app interfaces. Spell every Spanish text exactly as given, with accents and inverted marks. No text other than the texts listed here. Scene: <scene>. Speech bubble of <character>: '<exact line>'. [Caption box top-left: '<caption>'.] [Screen text: '<text on the phone>'.] [Sign text: '<text on a sign>'.]

Sheet prompt template:

> Character reference sheet. Black and white hand-drawn stick-figure style with thick ink lines, exactly like the attached images (style only). Plain circle head, no nose, no ears, no hatching or shading. One single character, full body, standing, front view, neutral friendly expression, centred, plain white background. No speech bubbles, no text, no logos, no stripes, no props, no scenery. Portrait 4:5. Character: <description, with its one colour accent>.

The script saves the image, recovers it from `~/.codex/generated_images/` when Codex fails to write it, and scales it to 1080x1350 (scaled to height and cropped at the sides, never stretched). Each panel takes about 50 seconds. 4. Open each panel (Read) and check:

- every text matches the copy file letter by letter, accents, ¿¡, ñ and … included, and there is no other text;
- each character matches its sheet: no nose or ears, same hair, clothes and colour;
- no logo, no stripes, no hatching; nothing cut at the edges; bubbles inside the frame;
- the joke reads in order: setup, escalation, consequence, punchline.

5. Write `<piece>/vinetas/creditos.md`: per panel, the tool (Codex image generation on the owner's ChatGPT account, or Flow), date, references used and retries. State that the commercial-use terms of the generator are the owner's to confirm.
6. Report: the panel paths, retries and why, any check that failed, and that the lesson card and the assembly into `export/` remain for `produce`. Only the final `panel-0N.png` files go to `produce`; `tryK` files and `logs/` never do. The lesson card of a comic strip is rendered with the light theme (`"theme": "light"` in its `carrusel.json`, owner's choice of 2026-11-20) so it matches the white panels.

## Lessons learned

- 2026-11-20, 8 panels in two strips: Spanish text came out right first time in every attempt.
- The most common drift: a nose and ears appear on their own (2 of 4 panels in one strip). Hence "no nose, no ears" in every prompt.
- "No logos" did not stop three stripes on a sleeve: "no stripes" is now explicit.
- Codex sometimes says it could not save the file while the image exists under `~/.codex/generated_images/<session>/`: the script recovers it.
- `codex exec --image` takes several values: the prompt must come after `--`, or Codex waits for stdin.
