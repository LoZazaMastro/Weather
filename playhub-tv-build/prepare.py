#!/usr/bin/env python3
"""Prepare pristine Aurora TV 1.1.5 source as Playhub TV 1.2.0.

The patch deliberately leaves the webOS package ID and all streaming/discovery
code untouched so existing settings, server discovery, pairing and Wake-on-LAN
continue to use Aurora's proven implementation.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont

VERSION = "1.2.0"
ACCENT = (238, 204, 0, 255)  # #EECC00
RESAMPLE_LANCZOS = getattr(Image, "Resampling", Image).LANCZOS
ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd().resolve()
LOGO_PATH = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else ROOT / "playhub-logo.png"


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, text: str) -> None:
    p = ROOT / path
    p.write_text(text, encoding="utf-8", newline="\n")


def replace_required(path: str, old: str, new: str, count: int = -1) -> None:
    text = read(path)
    if old not in text:
        raise RuntimeError(f"Expected text not found in {path}: {old!r}")
    write(path, text.replace(old, new, count))


def iter_brand_text_files() -> Iterable[Path]:
    roots = [ROOT / "src", ROOT / "deploy"]
    suffixes = {".c", ".h", ".po", ".pot", ".json", ".yml", ".yaml", ".desktop", ".txt", ".md", ".in"}
    for base in roots:
        for path in base.rglob("*"):
            if path.is_file() and path.suffix.lower() in suffixes:
                yield path


def replace_brand_text() -> None:
    # Upper-case/lower-case technical identifiers (com.aurora.gamestream,
    # binary name aurora, repository URLs) intentionally remain unchanged.
    for path in iter_brand_text_files():
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        updated = text.replace("AURORA", "PLAYHUB TV").replace("Aurora TV", "Playhub TV").replace("Aurora", "Playhub TV")
        if updated != text:
            path.write_text(updated, encoding="utf-8", newline="\n")


def contain(image: Image.Image, size: tuple[int, int], pad: int = 0) -> Image.Image:
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    max_w = max(1, size[0] - pad * 2)
    max_h = max(1, size[1] - pad * 2)
    src = image.convert("RGBA")
    src.thumbnail((max_w, max_h), RESAMPLE_LANCZOS)
    x = (size[0] - src.width) // 2
    y = (size[1] - src.height) // 2
    canvas.alpha_composite(src, (x, y))
    return canvas


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask


def make_square_icon(wordmark: Image.Image, size: int) -> Image.Image:
    # Prefer the left, square portion of the official Playhub wordmark. This
    # keeps the artwork proportional and avoids stretching it into a square.
    src = wordmark.convert("RGBA")
    bbox = src.getbbox() or (0, 0, src.width, src.height)
    src = src.crop(bbox)
    crop_w = min(src.width, max(src.height, int(src.width * 0.42)))
    mark = src.crop((0, 0, crop_w, src.height))

    background = Image.new("RGBA", (size, size), (8, 8, 8, 255))
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    r = int(size * 0.34)
    cx = cy = size // 2
    gd.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(238, 204, 0, 72))
    glow = glow.filter(ImageFilter.GaussianBlur(max(3, size // 14)))
    background.alpha_composite(glow)
    background.alpha_composite(contain(mark, (size, size), max(6, size // 7)))
    background.putalpha(rounded_mask((size, size), max(8, size // 5)))
    return background


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size=size)
    return ImageFont.load_default()


def make_dark_brand_canvas(size: tuple[int, int], wordmark: Image.Image, subtitle: bool = False) -> Image.Image:
    w, h = size
    canvas = Image.new("RGBA", size, (0, 0, 0, 255))

    # Subtle yellow glow behind the logo; deliberately restrained for OLED.
    glow = Image.new("RGBA", size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    radius = max(30, min(w, h) // 3)
    gd.ellipse((w // 2 - radius, h // 2 - radius, w // 2 + radius, h // 2 + radius), fill=(238, 204, 0, 52))
    glow = glow.filter(ImageFilter.GaussianBlur(max(12, min(w, h) // 18)))
    canvas.alpha_composite(glow)

    logo_box_h = int(h * (0.25 if subtitle else 0.34))
    logo_box_w = int(w * 0.58)
    logo = contain(wordmark, (logo_box_w, logo_box_h), 2)
    logo_x = (w - logo.width) // 2
    logo_y = (h - logo.height) // 2 - (int(h * 0.055) if subtitle else 0)
    canvas.alpha_composite(logo, (logo_x, logo_y))

    if subtitle and w >= 640 and h >= 360:
        draw = ImageDraw.Draw(canvas)
        text = "PLAYHUB TV"
        fnt = font(max(18, h // 30), bold=True)
        box = draw.textbbox((0, 0), text, font=fnt)
        tw = box[2] - box[0]
        y = min(h - h // 8, logo_y + logo.height + h // 18)
        draw.text(((w - tw) // 2, y), text, font=fnt, fill=ACCENT)
    return canvas


def save_like(path: Path, image: Image.Image) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG", optimize=True)


def write_png_header(png_path: Path, header_path: Path, var_name: str) -> None:
    data = png_path.read_bytes()
    lines = ["#pragma once", f"const unsigned char {var_name}_data[] = {{"]
    for i in range(0, len(data), 16):
        chunk = data[i:i + 16]
        lines.append("  " + ", ".join(f"0x{b:02x}" for b in chunk) + ",")
    lines.extend(["};", f"const unsigned int {var_name}_size = sizeof({var_name}_data);", ""])
    header_path.write_text("\n".join(lines), encoding="utf-8", newline="\n")


def generate_assets() -> None:
    if not LOGO_PATH.is_file():
        raise FileNotFoundError(f"Playhub logo not found: {LOGO_PATH}")
    wordmark = Image.open(LOGO_PATH).convert("RGBA")

    # webOS launcher assets and platform splash.
    deploy = ROOT / "deploy/webos"
    save_like(deploy / "icon.png", make_square_icon(wordmark, 130))
    save_like(deploy / "icon_large.png", make_square_icon(wordmark, 256))
    save_like(deploy / "splash.png", make_dark_brand_canvas((1920, 1080), wordmark, subtitle=True))

    # In-app icon. Keep it square because LVGL uses it as both icon and window icon.
    embedded_icon = make_square_icon(wordmark, 96)
    embedded_path = ROOT / "src/app/res/img/moonlight.png"
    save_like(embedded_path, embedded_icon)
    write_png_header(embedded_path, ROOT / "src/app/res/gen/moonlight.h", "res_moonlight")

    # Replace all Aurora-specific branding images while preserving each source
    # image's native dimensions and aspect ratio contract.
    branding_dir = ROOT / "src/app/res/branding"
    for path in branding_dir.glob("aurora_*.png"):
        with Image.open(path) as old:
            size = old.size
        if "icon" in path.stem:
            art = make_square_icon(wordmark, max(size))
            art = contain(art, size)
        elif "splash" in path.stem or "hero" in path.stem:
            art = make_dark_brand_canvas(size, wordmark, subtitle=("splash" in path.stem))
        else:
            art = contain(wordmark, size, max(2, min(size) // 12))
        save_like(path, art)


def patch_sources() -> None:
    replace_required("CMakeLists.txt", 'set(MOONLIGHT_VERSION "1.1.5")', f'set(MOONLIGHT_VERSION "{VERSION}")')

    # Preserve package ID com.aurora.gamestream. Changing it would orphan the
    # user's stored host/pairing settings and create a second app installation.
    replace_brand_text()

    # Five-second minimum platform splash before any application window is
    # initialized. Streaming/discovery code is not touched.
    main = read("src/main.c")
    if "sleep(5); /* Playhub TV minimum splash */" not in main:
        main = main.replace("#include \"logging.h\"\n", "#include \"logging.h\"\n#ifdef TARGET_WEBOS\n#include <unistd.h>\n#endif\n")
        main = main.replace("int main(int argc, char *argv[]) {\n", "int main(int argc, char *argv[]) {\n#ifdef TARGET_WEBOS\n    sleep(5); /* Playhub TV minimum splash */\n#endif\n")
        write("src/main.c", main)

    # Playhub palette: OLED-black foundation, translucent graphite surfaces and
    # the requested yellow accent.
    colors = read("src/app/lvgl/theme/lv_theme_moonlight_colors.h")
    colors = re.sub(r"/\*\*.*?palette.*?\*/", "/** Playhub TV OLED glass palette with #EECC00 accent. */", colors)
    replacements = {
        "0x000000": "0x000000",
        "0x121212": "0x101010",
        "0x1A1A1A": "0x181818",
        "0x242424": "0x242424",
        "0x2A2A2A": "0x3A3A3A",
        "0x8B5CF6": "0xEECC00",
        "0x6D28D9": "0xA88F00",
        "0xF5F5F5": "0xF7F7F7",
        "0x9CA3AF": "0xA8A8A8",
    }
    for old, new in replacements.items():
        colors = colors.replace(old, new)
    write("src/app/lvgl/theme/lv_theme_moonlight_colors.h", colors)

    theme = read("src/app/lvgl/theme/lv_theme_moonlight.c")
    theme = theme.replace("lv_obj_set_style_radius(obj, LV_DPX(10), 0);", "lv_obj_set_style_radius(obj, LV_DPX(14), 0);")
    theme = theme.replace("lv_obj_set_style_bg_opa(obj, LV_OPA_COVER, 0);", "lv_obj_set_style_bg_opa(obj, LV_OPA_80, 0);", 1)
    theme = theme.replace("lv_obj_set_style_outline_width(obj, LV_DPX(2), LV_STATE_FOCUS_KEY);", "lv_obj_set_style_outline_width(obj, LV_DPX(3), LV_STATE_FOCUS_KEY);")
    write("src/app/lvgl/theme/lv_theme_moonlight.c", theme)

    launcher = read("src/app/ui/launcher/launcher.view.c")
    launcher = launcher.replace("lv_obj_set_style_bg_color(topbar, lv_color_black(), 0);", "lv_obj_set_style_bg_color(topbar, ml_color_hex(ML_COLOR_SURFACE), 0);")
    launcher = launcher.replace("lv_obj_set_style_bg_opa(topbar, LV_OPA_COVER, 0);", "lv_obj_set_style_bg_opa(topbar, LV_OPA_80, 0);")
    launcher = launcher.replace("LV_DPX(NAV_LOGO_SIZE), LV_DPX(NAV_LOGO_SIZE)", "LV_DPX((NAV_LOGO_SIZE * 7) / 10), LV_DPX((NAV_LOGO_SIZE * 7) / 10)")
    launcher = launcher.replace('lv_label_set_text_static(title_label, "PLAYHUB TV");', 'lv_label_set_text_static(title_label, "PLAYHUB TV");')
    write("src/app/ui/launcher/launcher.view.c", launcher)

    # 600x900 (2:3) game artwork, centered in the existing responsive grid.
    apps = read("src/app/ui/launcher/apps.controller.c")
    apps = apps.replace("600x800 (3:4, width:height)", "600x900 (2:3, width:height)")
    apps = apps.replace("row_height * 600 / 800", "row_height * 600 / 900")
    write("src/app/ui/launcher/apps.controller.c", apps)

    cards = read("src/app/ui/launcher/appitem.view.c")
    cards = cards.replace("lv_style_set_radius(&style->cover, LV_DPX(6));", "lv_style_set_radius(&style->cover, LV_DPX(14));")
    cards = cards.replace("lv_style_set_border_width(&style->cover, 0);", "lv_style_set_border_width(&style->cover, LV_DPX(1));\n    lv_style_set_border_color(&style->cover, ml_color_hex(ML_COLOR_BORDER));\n    lv_style_set_border_opa(&style->cover, LV_OPA_70);")
    cards = cards.replace("lv_style_set_shadow_opa(&style->cover, LV_OPA_TRANSP);", "lv_style_set_shadow_width(&style->cover, LV_DPX(14));\n    lv_style_set_shadow_color(&style->cover, lv_color_black());\n    lv_style_set_shadow_opa(&style->cover, LV_OPA_40);")
    write("src/app/ui/launcher/appitem.view.c", cards)

    keyboard = read("src/app/ui/streaming/soft_keyboard.c")
    keyboard = keyboard.replace("0xd4820a", "0xeecc00")
    write("src/app/ui/streaming/soft_keyboard.c", keyboard)


def verify() -> None:
    cmake = read("CMakeLists.txt")
    if f'set(MOONLIGHT_VERSION "{VERSION}")' not in cmake:
        raise RuntimeError("Version patch failed")
    if 'set(WEBOS_APPINFO_ID "com.aurora.gamestream")' not in cmake:
        raise RuntimeError("Stable webOS package ID was changed")
    appinfo = read("deploy/webos/appinfo.json")
    for required in ('"title": "Playhub TV"', '"dialAppName": "Playhub TV"'):
        if required not in appinfo:
            raise RuntimeError(f"Missing appinfo branding: {required}")
    if "row_height * 600 / 900" not in read("src/app/ui/launcher/apps.controller.c"):
        raise RuntimeError("600x900 cover aspect patch failed")
    if "0xEECC00" not in read("src/app/lvgl/theme/lv_theme_moonlight_colors.h"):
        raise RuntimeError("Playhub accent patch failed")
    if "sleep(5); /* Playhub TV minimum splash */" not in read("src/main.c"):
        raise RuntimeError("Minimum splash delay patch failed")

    residual = []
    for path in iter_brand_text_files():
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        # Technical lowercase identifiers and URLs are intentionally allowed;
        # remaining title-case strings would still be visible to users.
        if re.search(r"\bAurora(?: TV)?\b|\bAURORA\b", text):
            residual.append(str(path.relative_to(ROOT)))
    if residual:
        raise RuntimeError("Residual user-facing Aurora branding: " + ", ".join(residual[:30]))


if __name__ == "__main__":
    patch_sources()
    generate_assets()
    verify()
    print(f"Prepared Playhub TV {VERSION} from pristine Aurora source at {ROOT}")
