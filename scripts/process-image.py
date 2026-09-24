#!/usr/bin/env python3
"""Process raster images with optional background removal."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Any


SUPPORTED_INPUT_EXTENSIONS = {
    ".bmp",
    ".gif",
    ".jpeg",
    ".jpg",
    ".png",
    ".tif",
    ".tiff",
    ".webp",
}
SUPPORTED_OUTPUT_FORMATS = {"png", "webp"}
DEPENDENCY_INSTALL_COMMAND = 'python3 -m pip install --user "rembg[cpu]" pillow'


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Convert an image to PNG or WebP, optionally removing its background.",
        epilog=(
            "Examples:\n"
            "  python3 scripts/process-image.py input.jpg output.webp --format webp --quality 85\n"
            "  python3 scripts/process-image.py input.png output.png --remove-background --overwrite"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("input", type=Path, help="Input image path")
    parser.add_argument("output", type=Path, help="Output image path")
    parser.add_argument(
        "--remove-background",
        action="store_true",
        help="Remove the background using rembg[cpu] and preserve transparency",
    )
    parser.add_argument(
        "--format",
        choices=sorted(SUPPORTED_OUTPUT_FORMATS),
        help="Output format; if omitted, infer it from OUTPUT's extension",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=85,
        metavar="1-100",
        help="WebP quality (default: 85)",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Allow replacing an existing output file",
    )
    return parser


def resolve_format(parser: argparse.ArgumentParser, output: Path, requested: str | None) -> str:
    if requested:
        return requested

    inferred = output.suffix.lower().removeprefix(".")
    if inferred not in SUPPORTED_OUTPUT_FORMATS:
        parser.error(
            "cannot infer output format from OUTPUT; use a .png or .webp extension "
            "or pass --format png|webp"
        )
    return inferred


def load_pillow() -> Any:
    try:
        from PIL import Image
    except ImportError as error:
        raise RuntimeError(
            "Pillow is required. Install dependencies with: "
            f"{DEPENDENCY_INSTALL_COMMAND}"
        ) from error
    return Image


def remove_background(image: Any) -> Any:
    try:
        from rembg import remove
    except ImportError as error:
        raise RuntimeError(
            "Background removal requires rembg[cpu]. Install dependencies with: "
            f"{DEPENDENCY_INSTALL_COMMAND}"
        ) from error

    return remove(image).convert("RGBA")


def process_image(args: argparse.Namespace, parser: argparse.ArgumentParser) -> None:
    input_path: Path = args.input
    output_path: Path = args.output

    if not input_path.is_file():
        parser.error(f"input file does not exist: {input_path}")
    if input_path.suffix.lower() not in SUPPORTED_INPUT_EXTENSIONS:
        parser.error(
            f"unsupported input format: {input_path.suffix or '[no extension]'}; "
            "supported formats are BMP, GIF, JPEG, PNG, TIFF, and WebP"
        )
    if args.quality < 1 or args.quality > 100:
        parser.error("--quality must be between 1 and 100")
    if output_path.exists() and not args.overwrite:
        parser.error(
            f"output already exists: {output_path}; use --overwrite to replace it"
        )

    output_format = resolve_format(parser, output_path, args.format)
    Image = load_pillow()

    try:
        with Image.open(input_path) as source:
            image = source.copy()
        if args.remove_background:
            image = remove_background(image)
        elif "A" in image.getbands():
            image = image.convert("RGBA")

        output_path.parent.mkdir(parents=True, exist_ok=True)
        save_kwargs: dict[str, Any] = {}
        if output_format == "webp":
            save_kwargs.update(format="WEBP", quality=args.quality, method=6)
        else:
            save_kwargs.update(format="PNG", optimize=True)

        image.save(output_path, **save_kwargs)
    except OSError as error:
        raise RuntimeError(f"could not process image: {error}") from error


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        process_image(args, parser)
    except RuntimeError as error:
        parser.error(str(error))
    return 0


if __name__ == "__main__":
    sys.exit(main())
