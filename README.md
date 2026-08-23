# mac-transcribe-site

Лендинг [MacTranscribe](https://github.com/art-ps/mac-transcribe) — локальной транскрипции встреч для macOS.

- Vite + React + TypeScript, один экран (`src/App.tsx` + `src/styles.css`).
- DMG не хранится в репозитории: кнопка ведёт на `releases/latest/download/MacTranscribe.dmg`.
- Деплой: GitHub Actions → GitHub Pages на пуш в `master`.

```bash
npm ci
npm run dev    # локально
npm test       # проверки контента
npm run build  # dist/
```
