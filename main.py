import asyncio
import base64
import json
import os
import random
import re
import socket
import struct
import urllib.parse
import urllib.request
from datetime import datetime, timezone

import decky


DEFAULT_SETTINGS = {
    "location": "Milano",
    "units": "metric",
    "compact": False,
    "topbar_enabled": True,
    "topbar_show_icon": True,
    "topbar_left": False,
    "language": "it",
    "location_set": False,
    "version": 2,
}

GEOCODING_LANGUAGES = {
    "it": "it",
    "en": "en",
    "fr": "fr",
    "es": "es",
    "pt": "pt",
    "pt-BR": "pt",
    "de": "de",
    "nl": "nl",
    "uk": "uk",
    "zh": "zh",
    "ja": "ja",
}

BACKEND_MESSAGES = {
    "invalid_coordinates": {
        "it": "Coordinate non valide.",
        "en": "Invalid coordinates.",
        "fr": "Coordonnées non valides.",
        "es": "Coordenadas no válidas.",
        "pt": "Coordenadas inválidas.",
        "pt-BR": "Coordenadas inválidas.",
        "de": "Ungültige Koordinaten.",
        "nl": "Ongeldige coördinaten.",
        "uk": "Недійсні координати.",
        "zh": "坐标无效。",
        "ja": "座標が無効です。",
    },
    "location_not_found": {
        "it": "Nessuna località trovata per '{location}'.",
        "en": "No location found for '{location}'.",
        "fr": "Aucun lieu trouvé pour « {location} ».",
        "es": "No se encontró ninguna ubicación para «{location}».",
        "pt": "Nenhuma localização encontrada para «{location}».",
        "pt-BR": "Nenhum local encontrado para “{location}”.",
        "de": "Kein Ort für „{location}“ gefunden.",
        "nl": "Geen locatie gevonden voor '{location}'.",
        "uk": "Не знайдено локацію для «{location}».",
        "zh": "未找到“{location}”的位置。",
        "ja": "「{location}」の場所が見つかりません。",
    },
}

WEATHER_CODES = {
    0: ("Sereno", "clear"),
    1: ("Quasi sereno", "clear"),
    2: ("Poco nuvoloso", "cloud"),
    3: ("Coperto", "cloud"),
    45: ("Nebbia", "fog"),
    48: ("Nebbia gelata", "fog"),
    51: ("Pioggerella", "rain"),
    53: ("Pioggerella", "rain"),
    55: ("Pioggerella intensa", "rain"),
    56: ("Pioggia gelata", "rain"),
    57: ("Pioggia gelata", "rain"),
    61: ("Pioggia leggera", "rain"),
    63: ("Pioggia", "rain"),
    65: ("Pioggia intensa", "rain"),
    66: ("Pioggia gelata", "rain"),
    67: ("Pioggia gelata", "rain"),
    71: ("Neve leggera", "snow"),
    73: ("Neve", "snow"),
    75: ("Neve intensa", "snow"),
    77: ("Nevischio", "snow"),
    80: ("Rovesci leggeri", "rain"),
    81: ("Rovesci", "rain"),
    82: ("Rovesci forti", "rain"),
    85: ("Rovesci nevosi", "snow"),
    86: ("Rovesci nevosi", "snow"),
    95: ("Temporale", "storm"),
    96: ("Temporale con grandine", "storm"),
    99: ("Temporale con grandine", "storm"),
}


TOPBAR_REFRESH_SECONDS = 600
TOPBAR_REINJECT_SECONDS = 10
TOPBAR_CEF_PORT = 8080
TOPBAR_STYLE_ID = "decky-weather-topbar-style"
TOPBAR_BADGE_ID = "decky-weather-topbar-badge"
TOPBAR_CLOCK_SELECTORS = [
    "._1HhLUvHH6BZLIOyOE80TVh",
    "#header ._1HhLUvHH6BZLIOyOE80TVh",
]

class Plugin:
    async def _main(self):
        decky.logger.info("Weather loaded")
        os.makedirs(self._settings_dir(), exist_ok=True)
        self._topbar_task = asyncio.create_task(self._topbar_loop())

    async def _unload(self):
        decky.logger.info("Weather unloaded")
        task = getattr(self, "_topbar_task", None)
        if task:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass
        await self._inject_topbar_badge("", False, False)

    async def _uninstall(self):
        decky.logger.info("Weather uninstalled")

    async def _migration(self):
        pass

    async def get_settings(self):
        return self._read_settings()

    async def save_settings(self, settings):
        normalized = self._normalize_settings(settings)
        os.makedirs(self._settings_dir(), exist_ok=True)
        with open(self._settings_path(), "w", encoding="utf-8") as settings_file:
            json.dump(normalized, settings_file, ensure_ascii=False, indent=2)
        asyncio.create_task(self._refresh_topbar_once())
        return normalized

    async def refresh_topbar(self):
        return await self._refresh_topbar_once()

    async def get_weather(self, settings=None):
        normalized = self._normalize_settings(settings or self._read_settings())
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._fetch_weather_sync, normalized)

    def _settings_dir(self):
        return getattr(
            decky,
            "DECKY_SETTINGS_DIR",
            os.path.join(os.path.dirname(__file__), "settings"),
        )

    def _settings_path(self):
        return os.path.join(self._settings_dir(), "minimal-weather.json")

    def _read_settings(self):
        try:
            with open(self._settings_path(), "r", encoding="utf-8") as settings_file:
                return self._normalize_settings(json.load(settings_file))
        except FileNotFoundError:
            return DEFAULT_SETTINGS.copy()
        except Exception as error:
            decky.logger.warning(f"Cannot read Weather settings: {error}")
            return DEFAULT_SETTINGS.copy()

    def _normalize_settings(self, settings):
        if not isinstance(settings, dict):
            settings = {}

        if (
            settings.get("location") == "Roma"
            and not settings.get("location_set")
            and not settings.get("version")
        ):
            settings = {**settings, "location": DEFAULT_SETTINGS["location"]}

        location = str(settings.get("location") or DEFAULT_SETTINGS["location"]).strip()
        if not location:
            location = DEFAULT_SETTINGS["location"]

        units = str(settings.get("units") or DEFAULT_SETTINGS["units"]).lower()
        if units not in ("metric", "imperial"):
            units = DEFAULT_SETTINGS["units"]

        language = self._normalize_language(settings.get("language"))

        return {
            "location": location[:80],
            "units": units,
            "compact": bool(settings.get("compact", DEFAULT_SETTINGS["compact"])),
            "topbar_enabled": bool(settings.get("topbar_enabled", DEFAULT_SETTINGS["topbar_enabled"])),
            "topbar_show_icon": True,
            "topbar_left": bool(settings.get("topbar_left", DEFAULT_SETTINGS["topbar_left"])),
            "language": language,
            "location_set": bool(settings.get("location_set", False)),
            "version": 2,
        }

    def _normalize_language(self, language):
        value = str(language or DEFAULT_SETTINGS["language"]).replace("_", "-").lower()

        if value.startswith("pt-br"):
            return "pt-BR"
        if value.startswith("it"):
            return "it"
        if value.startswith("fr"):
            return "fr"
        if value.startswith("es"):
            return "es"
        if value.startswith("pt"):
            return "pt"
        if value.startswith("de"):
            return "de"
        if value.startswith("nl"):
            return "nl"
        if value.startswith("uk") or value.startswith("ua"):
            return "uk"
        if value.startswith("zh"):
            return "zh"
        if value.startswith("ja"):
            return "ja"
        return "en"

    def _message(self, key, language, **values):
        translations = BACKEND_MESSAGES.get(key) or {}
        template = translations.get(language) or translations.get("en") or key
        return template.format(**values)

    def _fetch_weather_sync(self, settings):
        location = self._resolve_location(settings["location"], settings.get("language", "en"))
        forecast = self._fetch_forecast(location, settings["units"])
        current = forecast.get("current") or {}
        daily = forecast.get("daily") or {}
        hourly = forecast.get("hourly") or {}
        current_condition = self._condition(current.get("weather_code"))

        daily_items = []
        dates = daily.get("time") or []
        max_temps = daily.get("temperature_2m_max") or []
        min_temps = daily.get("temperature_2m_min") or []
        precipitation = daily.get("precipitation_probability_max") or []
        weather_codes = daily.get("weather_code") or []
        hourly_items = self._next_hourly_items(hourly)

        for index, date_value in enumerate(dates[:5]):
            condition = self._condition(self._safe_index(weather_codes, index))
            daily_items.append(
                {
                    "date": date_value,
                    "label": condition["label"],
                    "tone": condition["tone"],
                    "weather_code": self._safe_int(self._safe_index(weather_codes, index)),
                    "temp_max": self._safe_number(self._safe_index(max_temps, index)),
                    "temp_min": self._safe_number(self._safe_index(min_temps, index)),
                    "precipitation_probability": self._safe_int(
                        self._safe_index(precipitation, index)
                    ),
                }
            )

        return {
            "location": location["name"],
            "country": location.get("country", ""),
            "timezone": forecast.get("timezone", ""),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "source": "Open-Meteo",
            "units": {
                "temperature": "degF" if settings["units"] == "imperial" else "degC",
                "wind": "mph" if settings["units"] == "imperial" else "km/h",
                "precipitation": "in" if settings["units"] == "imperial" else "mm",
            },
            "current": {
                "temperature": self._safe_number(current.get("temperature_2m")),
                "apparent": self._safe_number(current.get("apparent_temperature")),
                "humidity": self._safe_int(current.get("relative_humidity_2m")),
                "wind": self._safe_number(current.get("wind_speed_10m")),
                "precipitation": self._safe_number(current.get("precipitation")),
                "is_day": bool(current.get("is_day", 1)),
                "weather_code": self._safe_int(current.get("weather_code")),
                "label": current_condition["label"],
                "tone": current_condition["tone"],
            },
            "daily": daily_items,
            "hourly": hourly_items,
        }


    async def _topbar_loop(self):
        self._ensure_cef_remote_debugging_flag()
        label = ""
        enabled = False
        last_fetch = 0.0
        loop = asyncio.get_event_loop()

        while True:
            try:
                now = loop.time()
                settings = self._read_settings()
                enabled = bool(settings.get("topbar_enabled", True))

                if not enabled:
                    label = ""
                    await self._inject_topbar_badge("", False, bool(settings.get("topbar_left", False)))
                    await asyncio.sleep(TOPBAR_REINJECT_SECONDS)
                    continue

                if not label or now - last_fetch >= TOPBAR_REFRESH_SECONDS:
                    try:
                        weather = await loop.run_in_executor(None, self._fetch_weather_sync, settings)
                        label = self._format_topbar_label(weather, settings)
                        last_fetch = now
                    except Exception as error:
                        decky.logger.warning(f"Weather top bar update failed: {error}")

                await self._inject_topbar_badge(label, enabled, bool(settings.get("topbar_left", False)))
            except asyncio.CancelledError:
                raise
            except Exception as error:
                decky.logger.warning(f"Weather top bar loop error: {error}")

            await asyncio.sleep(TOPBAR_REINJECT_SECONDS)

    async def _refresh_topbar_once(self):
        self._ensure_cef_remote_debugging_flag()
        settings = self._read_settings()
        if not settings.get("topbar_enabled", True):
            await self._inject_topbar_badge("", False, bool(settings.get("topbar_left", False)))
            return {"enabled": False, "label": ""}

        loop = asyncio.get_event_loop()
        try:
            weather = await loop.run_in_executor(None, self._fetch_weather_sync, settings)
            label = self._format_topbar_label(weather, settings)
            await self._inject_topbar_badge(label, True, bool(settings.get("topbar_left", False)))
            return {"enabled": True, "label": label}
        except Exception as error:
            decky.logger.warning(f"Weather top bar manual refresh failed: {error}")
            return {"enabled": True, "label": "", "error": str(error)}

    def _format_topbar_label(self, weather, settings):
        current = (weather or {}).get("current") or {}
        try:
            temperature = round(float(current.get("temperature")))
        except Exception:
            return ""

        unit = ((weather or {}).get("units") or {}).get("temperature")
        suffix = "F" if unit == "degF" else ""
        temp = f"{temperature}°{suffix}"

        return f"{self._topbar_emoji(current)} {temp}"

    def _topbar_emoji(self, current):
        code = self._safe_int(current.get("weather_code"))
        tone = current.get("tone")
        if tone == "storm" or code in (95, 96, 99):
            return "🌩️"
        if tone == "snow" or 71 <= code <= 86:
            return "❄️"
        if tone == "rain" or 51 <= code <= 67 or 80 <= code <= 82:
            return "🌧️"
        if tone == "fog" or code in (45, 48):
            return "🌫️"
        if code == 3:
            return "☁️"
        if code in (1, 2) or tone == "cloud":
            return "🌤️"
        if current.get("is_day") is False:
            return "🌙"
        return "☀️"

    async def _inject_topbar_badge(self, label, enabled=True, left=False):
        targets = await asyncio.get_event_loop().run_in_executor(None, self._steam_browser_targets)
        if not targets:
            return False

        script = self._topbar_injection_script(label, enabled, left)
        results = await asyncio.gather(
            *[
                asyncio.get_event_loop().run_in_executor(
                    None, self._evaluate_steam_target, target, script
                )
                for target in targets
            ],
            return_exceptions=True,
        )
        return any(result is True for result in results)

    def _topbar_injection_script(self, label, enabled=True, left=False):
        label_value = str(label or "")
        icon_value = ""
        temp_value = label_value
        if label_value:
            parts = label_value.split(" ", 1)
            if len(parts) == 2:
                icon_value, temp_value = parts[0], parts[1]

        label_json = json.dumps(label_value, ensure_ascii=False)
        icon_json = json.dumps(icon_value, ensure_ascii=False)
        temp_json = json.dumps(temp_value, ensure_ascii=False)
        enabled_json = "true" if enabled and label_value else "false"
        left_json = "true" if left else "false"
        selectors_json = json.dumps(TOPBAR_CLOCK_SELECTORS)
        return f"""
(function() {{
  const badgeId = {json.dumps(TOPBAR_BADGE_ID)};
  const styleId = {json.dumps(TOPBAR_STYLE_ID)};
  const label = {label_json};
  const iconText = {icon_json};
  const tempText = {temp_json};
  const enabled = {enabled_json};
  const moveLeft = {left_json};
  const selectors = {selectors_json};

  function removeWeatherBadge() {{
    document.querySelectorAll('#' + badgeId).forEach((node) => node.remove());
    document.documentElement.removeAttribute('data-decky-weather-topbar');
    document.documentElement.removeAttribute('data-decky-weather-left');
    const previousClock = document.querySelector('[data-decky-weather-clock="1"]');
    if (previousClock) {{
      previousClock.removeAttribute('data-decky-weather-clock');
      previousClock.style.removeProperty('order');
    }}
  }}

  function ownClockText(node) {{
    return Array.from(node.childNodes)
      .filter((child) => child.nodeType === Node.TEXT_NODE)
      .map((child) => child.textContent || '')
      .join(' ')
      .trim();
  }}

  function findClock() {{
    for (const selector of selectors) {{
      const match = document.querySelector(selector);
      if (match) return match;
    }}
    const header = document.querySelector('#header') || document.querySelector('.BasicUIHeader_Header_1E_SL');
    if (!header) return null;
    const nodes = Array.from(header.querySelectorAll('div, span, button'));
    return nodes.find((node) => {{
      const text = ownClockText(node) || (node.textContent || '').trim();
      return /^\d{{1,2}}:\d{{2}}(?:\s|$)/.test(text);
    }}) || null;
  }}

  function installStyle() {{
    const style = document.getElementById(styleId) || document.createElement('style');
    style.id = styleId;
    style.textContent = `
      #${{badgeId}} {{
        display: inline-flex !important;
        align-items: baseline !important;
        justify-content: center !important;
        gap: 0.16em !important;
        margin-left: 0.34em !important;
        padding: 0 !important;
        width: auto !important;
        min-width: max-content !important;
        max-width: none !important;
        height: auto !important;
        line-height: inherit !important;
        font: inherit !important;
        font-size: 1em !important;
        font-weight: inherit !important;
        letter-spacing: inherit !important;
        color: inherit !important;
        opacity: 0.98 !important;
        white-space: nowrap !important;
        overflow: visible !important;
        transform: none !important;
        pointer-events: none !important;
        vertical-align: baseline !important;
      }}
      #${{badgeId}} .decky-weather-topbar-icon {{
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 auto !important;
        width: 1em !important;
        height: 1em !important;
        font-size: calc(0.82em + 5px) !important;
        line-height: 1 !important;
        transform: translateY(0.04em) !important;
        margin: 0 !important;
      }}
      #${{badgeId}} .decky-weather-topbar-temp {{
        display: inline-block !important;
        font: inherit !important;
        font-size: 1em !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        letter-spacing: inherit !important;
        color: inherit !important;
        transform: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }}
      html[data-decky-weather-left="1"] #header ._1HhLUvHH6BZLIOyOE80TVh,
      html[data-decky-weather-left="1"] #header [data-decky-weather-clock="1"] {{
        order: -2 !important;
      }}
    `;
    if (!style.parentNode) document.head.appendChild(style);
  }}

  function ensureWeatherBadge() {{
    const state = window.__deckyWeatherTopbarState || {{ label, iconText, tempText, enabled, moveLeft }};
    if (!state.enabled || !state.label) {{
      removeWeatherBadge();
      return false;
    }}

    installStyle();
    const clock = findClock();
    if (!clock) return false;

    clock.setAttribute('data-decky-weather-clock', '1');
    clock.style.display = 'inline-flex';
    clock.style.alignItems = 'baseline';
    clock.style.justifyContent = 'center';
    clock.style.gap = '0';
    clock.style.whiteSpace = 'nowrap';
    clock.style.overflow = 'visible';
    clock.style.textOverflow = 'clip';
    clock.style.minWidth = 'max-content';
    clock.style.maxWidth = 'none';

    if (state.moveLeft) {{
      clock.style.order = '-2';
      document.documentElement.setAttribute('data-decky-weather-left', '1');
    }} else {{
      clock.style.removeProperty('order');
      document.documentElement.removeAttribute('data-decky-weather-left');
    }}

    let badge = clock.querySelector('#' + badgeId);
    if (!badge) {{
      badge = document.createElement('span');
      badge.id = badgeId;
      badge.setAttribute('aria-hidden', 'true');
      clock.appendChild(badge);
    }}

    let icon = badge.querySelector('.decky-weather-topbar-icon');
    if (!icon) {{
      icon = document.createElement('span');
      icon.className = 'decky-weather-topbar-icon';
      badge.appendChild(icon);
    }}

    let temp = badge.querySelector('.decky-weather-topbar-temp');
    if (!temp) {{
      temp = document.createElement('span');
      temp.className = 'decky-weather-topbar-temp';
      badge.appendChild(temp);
    }}

    icon.textContent = state.iconText || '';
    temp.textContent = state.tempText || state.label || '';
    badge.title = state.label || '';
    document.documentElement.setAttribute('data-decky-weather-topbar', '1');
    return true;
  }}

  window.__deckyWeatherTopbarState = {{
    label,
    iconText,
    tempText,
    enabled,
    moveLeft,
    updatedAt: Date.now(),
  }};

  if (!enabled || !label) {{
    removeWeatherBadge();
    return 'Weather top bar removed';
  }}

  installStyle();
  ensureWeatherBadge();

  if (!window.__deckyWeatherTopbarObserver) {{
    let queued = false;
    const queueEnsure = () => {{
      if (queued) return;
      queued = true;
      window.setTimeout(() => {{
        queued = false;
        try {{ ensureWeatherBadge(); }} catch (error) {{}}
      }}, 60);
    }};

    window.__deckyWeatherTopbarObserver = new MutationObserver(queueEnsure);
    window.__deckyWeatherTopbarObserver.observe(document.documentElement, {{
      childList: true,
      subtree: true,
    }});

    window.__deckyWeatherTopbarInterval = window.setInterval(() => {{
      try {{ ensureWeatherBadge(); }} catch (error) {{}}
    }}, 1000);

    document.addEventListener('visibilitychange', queueEnsure, true);
    window.addEventListener('focus', queueEnsure, true);
  }}

  return 'Weather top bar ok';
}})();
"""

    def _steam_browser_targets(self):
        self._ensure_cef_remote_debugging_flag()
        try:
            request = urllib.request.Request(
                f"http://127.0.0.1:{TOPBAR_CEF_PORT}/json/list",
                headers={"User-Agent": "Decky Weather/2.0.0"},
            )
            with urllib.request.urlopen(request, timeout=2) as response:
                targets = json.loads(response.read().decode("utf-8"))
        except Exception:
            return []

        result = []
        for target in targets if isinstance(targets, list) else []:
            if not isinstance(target, dict):
                continue
            websocket_url = target.get("webSocketDebuggerUrl")
            target_type = target.get("type")
            if target_type and target_type != "page":
                continue
            if websocket_url and websocket_url not in result:
                result.append(websocket_url)
        return result

    def _evaluate_steam_target(self, websocket_url, script):
        try:
            parsed = urllib.parse.urlparse(websocket_url)
            if parsed.scheme != "ws":
                return False

            host = parsed.hostname or "127.0.0.1"
            port = parsed.port or TOPBAR_CEF_PORT
            path = parsed.path or "/"
            if parsed.query:
                path += "?" + parsed.query

            with socket.create_connection((host, port), timeout=3) as sock:
                sock.settimeout(3)
                key = base64.b64encode(os.urandom(16)).decode("ascii")
                request = (
                    f"GET {path} HTTP/1.1\r\n"
                    f"Host: {host}:{port}\r\n"
                    "Upgrade: websocket\r\n"
                    "Connection: Upgrade\r\n"
                    f"Sec-WebSocket-Key: {key}\r\n"
                    "Sec-WebSocket-Version: 13\r\n\r\n"
                )
                sock.sendall(request.encode("ascii"))
                headers = b""
                while b"\r\n\r\n" not in headers and len(headers) < 8192:
                    chunk = sock.recv(1024)
                    if not chunk:
                        break
                    headers += chunk

                if b" 101 " not in headers.split(b"\r\n", 1)[0]:
                    return False

                command = {
                    "id": random.randint(1, 2_000_000_000),
                    "method": "Runtime.evaluate",
                    "params": {
                        "expression": script,
                        "awaitPromise": False,
                        "returnByValue": True,
                    },
                }
                payload = json.dumps(command, ensure_ascii=False).encode("utf-8")
                sock.sendall(self._websocket_text_frame(payload))
                try:
                    sock.recv(4096)
                except Exception:
                    pass
                return True
        except Exception as error:
            decky.logger.debug(f"Weather top bar target injection failed: {error}")
            return False

    def _websocket_text_frame(self, payload):
        frame = bytearray([0x81])
        length = len(payload)
        if length < 126:
            frame.append(0x80 | length)
        elif length < 65536:
            frame.append(0x80 | 126)
            frame.extend(struct.pack("!H", length))
        else:
            frame.append(0x80 | 127)
            frame.extend(struct.pack("!Q", length))

        mask = os.urandom(4)
        frame.extend(mask)
        frame.extend(byte ^ mask[index % 4] for index, byte in enumerate(payload))
        return bytes(frame)

    def _ensure_cef_remote_debugging_flag(self):
        try:
            steam_path = self._steam_path()
            if not steam_path:
                return
            flag_path = os.path.join(steam_path, ".cef-enable-remote-debugging")
            if not os.path.exists(flag_path):
                with open(flag_path, "w", encoding="utf-8"):
                    pass
        except Exception as error:
            decky.logger.debug(f"Cannot create Steam CEF remote debugging flag: {error}")

    def _steam_path(self):
        if os.name == "nt":
            try:
                import winreg

                registry = winreg.ConnectRegistry(None, winreg.HKEY_LOCAL_MACHINE)
                key = winreg.OpenKey(registry, r"SOFTWARE\Wow6432Node\Valve\Steam")
                value, value_type = winreg.QueryValueEx(key, "InstallPath")
                if value_type == winreg.REG_SZ and value:
                    return value
            except Exception:
                return r"C:\Program Files (x86)\Steam"

        home = os.path.expanduser("~")
        candidates = [
            os.path.join(home, ".steam", "steam"),
            os.path.join(home, ".local", "share", "Steam"),
        ]
        for candidate in candidates:
            if os.path.exists(candidate):
                return candidate
        return candidates[0]

    def _next_hourly_items(self, hourly):
        times = hourly.get("time") or []
        temps = hourly.get("temperature_2m") or []
        precipitation = hourly.get("precipitation_probability") or []
        weather_codes = hourly.get("weather_code") or []
        now_key = datetime.now().strftime("%Y-%m-%dT%H:00")
        start_index = 0

        for index, time_value in enumerate(times):
            if str(time_value) >= now_key:
                start_index = index
                break

        hourly_items = []
        for index, time_value in enumerate(times[start_index : start_index + 24], start_index):
            hour = self._hour_from_time(time_value)

            condition = self._condition(self._safe_index(weather_codes, index))
            hourly_items.append(
                {
                    "time": time_value,
                    "hour": f"{hour:02d}:00",
                    "label": condition["label"],
                    "tone": condition["tone"],
                    "temperature": self._safe_number(self._safe_index(temps, index)),
                    "precipitation_probability": self._safe_int(
                        self._safe_index(precipitation, index)
                    ),
                }
            )

        return hourly_items

    def _resolve_location(self, raw_location, language="en"):
        coordinate_match = re.match(
            r"^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$",
            raw_location,
        )
        if coordinate_match:
            latitude = float(coordinate_match.group(1))
            longitude = float(coordinate_match.group(2))
            if latitude < -90 or latitude > 90 or longitude < -180 or longitude > 180:
                raise ValueError(self._message("invalid_coordinates", language))
            return {
                "name": f"{latitude:.4f}, {longitude:.4f}",
                "country": "",
                "latitude": latitude,
                "longitude": longitude,
            }

        params = urllib.parse.urlencode(
            {
                "name": raw_location,
                "count": 1,
                "language": GEOCODING_LANGUAGES.get(language, "en"),
                "format": "json",
            }
        )
        data = self._fetch_json(f"https://geocoding-api.open-meteo.com/v1/search?{params}")
        results = data.get("results") or []

        if not results:
            raise ValueError(
                self._message("location_not_found", language, location=raw_location)
            )

        result = results[0]
        admin = result.get("admin1") or ""
        country = result.get("country") or ""
        label_parts = [result.get("name") or raw_location]
        if admin and admin != label_parts[0]:
            label_parts.append(admin)

        return {
            "name": ", ".join(label_parts),
            "country": country,
            "latitude": result["latitude"],
            "longitude": result["longitude"],
        }

    def _fetch_forecast(self, location, units):
        params = {
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "current": ",".join(
                [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "apparent_temperature",
                    "is_day",
                    "precipitation",
                    "weather_code",
                    "wind_speed_10m",
                ]
            ),
            "daily": ",".join(
                [
                    "weather_code",
                    "temperature_2m_max",
                    "temperature_2m_min",
                    "precipitation_probability_max",
                ]
            ),
            "hourly": ",".join(
                [
                    "temperature_2m",
                    "weather_code",
                    "precipitation_probability",
                ]
            ),
            "forecast_days": 5,
            "timezone": "auto",
        }

        if units == "imperial":
            params.update(
                {
                    "temperature_unit": "fahrenheit",
                    "wind_speed_unit": "mph",
                    "precipitation_unit": "inch",
                }
            )

        return self._fetch_json(
            "https://api.open-meteo.com/v1/forecast?"
            + urllib.parse.urlencode(params)
        )

    def _fetch_json(self, url):
        request = urllib.request.Request(
            url,
            headers={"User-Agent": "Decky Weather/2.0.0"},
        )
        with urllib.request.urlopen(request, timeout=12) as response:
            return json.loads(response.read().decode("utf-8"))

    def _condition(self, weather_code):
        code = self._safe_int(weather_code)
        label, tone = WEATHER_CODES.get(code, ("Variabile", "cloud"))
        return {"label": label, "tone": tone}

    def _safe_index(self, values, index):
        try:
            return values[index]
        except Exception:
            return None

    def _safe_int(self, value):
        try:
            return int(value)
        except Exception:
            return 0

    def _safe_number(self, value):
        try:
            return round(float(value), 1)
        except Exception:
            return 0

    def _hour_from_time(self, value):
        try:
            return int(str(value)[11:13])
        except Exception:
            return 0
