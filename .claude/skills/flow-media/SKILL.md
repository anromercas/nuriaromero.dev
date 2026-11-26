---
name: flow-media
description: "Trigger: Google Flow, generate image, background image, cover image, ambience clip, AI video clip for a social piece. Generate free images and 720p clips in Flow through the owner's Chrome."
license: Apache-2.0
metadata:
  author: "nuriaromerodev"
  version: "0.2"
---

## Activation Contract

Use when a social piece (carousel, cover, faceless video) needs a generated still or a short ambience clip and the brand has a Google account with Flow free tier. Built for the harness production agents (carousel, video) running unattended. Not for explanatory scenes: brand graphic scenes carry the message, Flow only adds ambience.

## Hard Rules

- Run unattended: no questions and no narration while working. Log each action and its cost in the piece's `flow/log.md`; speak only in the final report or when blocked.
- Budget replaces per-clip approval: spend at most the clips allowed for the piece (default 3 video clips per piece, 1 retry each) and never more than the day's remaining points. Images are free and uncapped within reason (max 4 per scene).
- Drive Flow only in the owner's signed-in Chrome session; confirm the account shown is the brand's before acting. If it is not signed in, stop and report.
- Never click "Actualizar", upgrade, subscribe or any paid control. Never sign in, accept terms or cookie banners, or change account settings (including the visible-watermark toggle). These are blockers: stop and report.
- Never hide, crop or remove a watermark.
- Prompts: no real people, no brands or logos, no client or confidential data (Flow states human reviewers may read prompts and outputs).
- Images must show "0 puntos" before generating; otherwise stop and report.
- Download only from the Download menu at a free size. Never bulk-move files: identify each download by name and time, copy it into the piece folder, leave the original.
- Review every result before delivery; reject clips where the subject leaves the frame or a face is recognisable. Stop after two failed attempts at the same step.
- Nothing produced here is published: the piece still goes through the owner's approval batch.
- Commercial-use terms of the free tier are unverified: state it in the report until the owner confirms them.

## Decision Gates

| Need                                      | Action                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| Background, cover or still scene          | Image, aspect as the piece needs, x1, download 2K                      |
| Ambience clip                             | Generate the image first, then video in "Fotogramas" mode from it      |
| Motion matters more than realism          | Prefer the still plus a push-in done in the edit over a generated clip |
| Prompt box shows the "Agente" chip active | Turn it off to get the manual panel                                    |
| Not enough points or budget reached       | Stop; report the daily reset time                                      |
| A native "save as" dialog appears         | Blocker: the browser tools cannot drive it; stop and report            |
| Clip needed at 1080x1920                  | Download 720p and upscale locally; never the paid 1080p                |

## Execution Steps

1. Read `references/flow-ui.md` for the verified controls, costs, download handling and known issues.
2. Open the brand's Flow project (or create one named after the piece).
3. Set the panel (type, aspect, model, count) and check the stated cost against the budget.
4. Write the prompt in English: subject, setting, light, lens, composition; for video, one simple motion and "static camera".
5. Generate, wait, open the result and inspect it.
6. Download, locate the file in the download folder, copy it to `social/piezas/<piece>/flow/` with a descriptive name.
7. Probe it (`ffprobe`), extract three frames for video, and look at them.
8. Add source, model, prompt and date to the piece's credits file.

## Output Contract

Return: files saved with size and resolution, points spent and remaining, the prompts used, what the frames show (including defects and rejected attempts), blockers hit, and anything unverified.

## References

- `references/flow-ui.md` — Flow controls, costs, download handling, limits and known issues verified on 2026-11-19.
