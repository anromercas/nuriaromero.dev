# Google Flow: verified controls and limits

Verified by hand on 2026-11-19 with a free account at `https://flow.google.com`. The interface changes often: re-check costs on screen before every generation and update this file when something differs.

## Account and points

- Free plan: 50 points per day, not cumulative. The account panel (avatar, top right) shows the balance and the daily reset time.
- The same panel has a "Marca de agua visible" toggle. Leave it as the owner set it.
- First use shows an onboarding dialog (optional marketing and user-study boxes, then a privacy notice). Only the owner can accept it.

## Prompt box

- A chip labelled "Agente" switches between agent mode (chat that picks the model itself) and the manual panel. In agent mode, asking for the cheapest option produced a 360p clip with Omni 1.2 Flash. Use the manual panel.
- With agent mode off, a chip at the right of the box (for example "Nano Banana 2.1 ▭ x1") opens the panel: tabs "Imagen" and "Vídeo", aspect ratio, model, count x1 to x4, and the line "La generación consumirá N puntos".

## Images

- Model Nano Banana 2.1 (also Nano Banana Pro and Nano Banana 2 Lite): 0 points.
- Aspect ratios: 16:9, 4:3, 1:1, 3:4, 9:16.
- Download menu: 1K (original) and 2K (enhanced) are free; 4K asks for an upgrade.
- Measured: a 9:16 image downloads at 1536x2752 as JPEG; about 30 seconds to generate.

## Video

- Model Veo 3.1 Lite: 720p, 8 seconds, 16:9 or 9:16, 10 points per clip (x2 costs 20).
- Modes: "Ingredientes" (references) and "Fotogramas" (start and optional end frame). In "Fotogramas", click "Inicio", pick a project image and "Añadir a petición".
- Download menu: 270p GIF and 720p (original) are free; 1080p and 4K ask for an upgrade.
- Measured: 720x1280, 24 fps, 7.9 s, H.264 with an AAC audio track, about 3 Mbps; about 80 seconds to generate. No visible watermark in the downloaded file.
- With 50 points: five clips per day. A 21-second video needs three.

## Downloads

- The Download menu saves straight to Chrome's configured download folder with no dialog, as long as Chrome's setting "Preguntar dónde se guardará cada archivo antes de descargarlo" is off. On 2026-11-19 the files landed in `posts-redes/2026/11 - Noviembre` (the owner's folder, outside the project), not in `~/Downloads`.
- If that setting is on, Chrome opens a native "save as" window that the browser tools cannot see or click. Treat it as a blocker; the owner turns the setting off once (Chrome, Configuración, Descargas).
- The download folder can change (it is named by month). Read it from the harness config when present (`social.downloadsDir`); otherwise search the owner's usual folders for files changed in the last minutes.
- File names: asset title plus a short id, for example `Closed_shop_in_Seville_dusk_30268c61_2K.jpg` and `Christmas_lights_twinkle_on_sign_d7ec93ab.mp4`. Match by name and modification time, copy, and leave the original in place.

## Known issues

- Camera drift: a clip asked for "static camera, very slow push-in" panned away and the sign left the frame by second 4. Keep the motion request minimal, check frames at start, middle and end, and trim the clip to the usable part.
- Generated passers-by can appear even when not requested. Check for recognisable faces.
- Downloads land in Chrome's configured download folder, which may not be `~/Downloads`. Find the file by its name (Flow uses the asset title plus a short id) and modification time.
- The viewport can change size between screenshots; take a fresh screenshot before clicking by coordinates, or use element references.
- A cookie notice can cover the bottom controls. Do not dismiss it without the owner's permission; use element references or the keyboard instead.
- There is no official API for Flow. Automated use and commercial-use terms of the free tier have not been verified.
