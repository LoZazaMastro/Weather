# Weather for Decky

Weather is a compact Decky Loader plugin that brings current weather, daily forecasts, and hourly forecasts into the Quick Access Menu.

It is built for Steam Big Picture and controller navigation, with a narrow QAM-safe layout that avoids clipped text and awkward overflow.

## Features

- Current weather, 5-day forecast, and the next 24 hours.
- Open-Meteo backend with no API key.
- Metric and imperial units.
- Dedicated settings view for city or coordinate search.
- Default city set to Milan.
- Automatic interface language detection.
- Supported languages: English, Italian, French, Spanish, Portuguese, Brazilian Portuguese, German, Dutch, Ukrainian, Chinese, and Japanese.
- Controller-friendly navigation with up, down, left, and right.
- Minimal dark UI with small motion details.

## Build on Windows

Decky recommends `pnpm`, but this project also builds with `npm` on Windows.

```powershell
npm install
npm run build
```

The build creates `dist/index.js`, which Decky needs at runtime.

## Manual Install

Copy the ready folder:

```text
release/weather/
```

It must include:

- `plugin.json`
- `package.json`
- `main.py`
- `README.md`
- `LICENSE`
- `dist/index.js`

Then reload Decky Loader.

## Notes

The default location is Milan. Open Weather in the QAM, go to Settings, change the city field, and press Save location. Coordinates also work, for example `45.4642,9.19`.
