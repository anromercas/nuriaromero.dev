#!/usr/bin/env bash
# Generate one comic panel with Codex image generation (owner's ChatGPT login).
# Usage: generar-vineta.sh <out.png> <ref1.png> [ref2.png ...] -- "<prompt>"
# Exit codes: 0 ok, 2 bad usage, 3 codex not logged in, 4 no image produced.
# A previous <out.png> is kept as <out>.tryN.png; Codex logs go to <dir>/logs/.
set -euo pipefail

if [[ $# -lt 4 ]]; then
  echo "usage: generar-vineta.sh <out.png> <ref.png>... -- \"<prompt>\"" >&2
  exit 2
fi

out="$1"; shift
refs=()
while [[ $# -gt 0 && "$1" != "--" ]]; do refs+=("$1"); shift; done
[[ "${1:-}" == "--" ]] || { echo "missing -- before the prompt" >&2; exit 2; }
shift
prompt="$*"
[[ -n "$prompt" && ${#refs[@]} -gt 0 ]] || { echo "need at least one reference and a prompt" >&2; exit 2; }
for r in "${refs[@]}"; do [[ -f "$r" ]] || { echo "reference not found: $r" >&2; exit 2; }; done

# "Not logged in" also contains "logged in": match the positive line only.
codex login status 2>&1 | grep -q "^Logged in" || { echo "codex is not logged in" >&2; exit 3; }

mkdir -p "$(dirname "$out")"
out_dir="$(cd "$(dirname "$out")" && pwd)"
base="$(basename "$out" .png)"
out_abs="$out_dir/$base.png"
mkdir -p "$out_dir/logs"

# Keep the previous attempt instead of overwriting it.
if [[ -e "$out_abs" ]]; then
  n=1
  while [[ -e "$out_dir/$base.try$n.png" ]]; do n=$((n + 1)); done
  mv "$out_abs" "$out_dir/$base.try$n.png"
fi
log="$out_dir/logs/$base.$(date +%Y%m%dT%H%M%S).log"

gen_root="$HOME/.codex/generated_images"
marker="$(mktemp)"
img_args=()
for r in "${refs[@]}"; do img_args+=(--image "$r"); done

full_prompt="Generate ONE image with your image generation tool and save it as $out_abs. $prompt"

# The prompt must come after "--": --image takes several values and would swallow it.
codex exec --skip-git-repo-check -s workspace-write -C "$out_dir" "${img_args[@]}" -- "$full_prompt" >"$log" 2>&1 || true

# Codex sometimes generates the image but fails to write it. Every generated image
# also lands under ~/.codex/generated_images/<session>/: recover the newest one
# created during this run. Run panels one at a time so the newest one is ours.
if [[ ! -s "$out_abs" ]]; then
  newest="$(find "$gen_root" -name '*.png' -newer "$marker" -print0 2>/dev/null | xargs -0 ls -t 2>/dev/null | head -1 || true)"
  if [[ -n "$newest" ]]; then
    cp "$newest" "$out_abs"
    echo "recovered from $newest" >>"$log"
  fi
fi
rm -f "$marker"

[[ -s "$out_abs" ]] || { echo "no image produced; see $log" >&2; exit 4; }

# Image generation returns about 1122x1402: scale to 1350 high, then crop the
# width to 1080 (centred) so the drawing is never stretched.
sips --resampleHeight 1350 "$out_abs" >/dev/null
sips --cropToHeightWidth 1350 1080 "$out_abs" >/dev/null
echo "$out_abs"
