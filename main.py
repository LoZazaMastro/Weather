import asyncio
import json
import os
import re
import urllib.parse
import urllib.request
from datetime import datetime, timezone

import decky


DEFAULT_SETTINGS = {
    "location": "Milano",
    "units": "metric",
    "compact": False,
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


class Plugin:
    async def _main(self):
        decky.logger.info("Weather loaded")
        os.makedirs(self._settings_dir(), exist_ok=True)

    async def _unload(self):
        decky.logger.info("Weather unloaded")

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
        return normalized

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
            headers={"User-Agent": "Decky Weather/0.1.0"},
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
