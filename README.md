# mac-transcribe-site

Лендинг [MacTranscribe](https://art-ps.github.io/mac-transcribe-site/) — локальной транскрипции встреч для macOS — и документация к нему.

- Vite + React + TypeScript, одна страница: `src/App.tsx` собирает секции из `src/sections/` (`Hero`, `Scenarios`, `Example`, `Kit`, `Setup`, `Features`, `Trust`, `FinalCta`), стили — `src/styles.css`, шрифты лежат локально (`src/fonts/`).
- Ссылки и факты о релизе (DMG, набор, требования) — `src/site-content.mjs`.
- Фрагменты сквозного примера — `src/demo-content.mjs`: дословно из стартового набора (`product-ai/lite`, коммит указан в шапке файла), без редактуры.
- Документация — VitePress в `docs/`, собирается в `dist/docs/`.
- DMG не хранится в репозитории: кнопка ведёт на `releases/latest/download/MacTranscribe.dmg` в `art-ps/mac-transcribe-releases`.
- Деплой: GitHub Actions → GitHub Pages на пуш в `master`.

```bash
npm ci
npm run dev    # локально
npm test       # проверки контента
npm run lint   # tsc
npm run build  # dist/
```

## Стартовый набор

Кнопка «Скачать набор» ведёт на ассет `mactranscribe-starter-kit.zip` релиза `starter-kit` в `art-ps/mac-transcribe-releases`. Архив собирает `tools/pack-kit.sh` из папки `lite/` репозитория `product-ai`: сначала гоняет его `tools/check-kit.sh`, затем упаковывает содержимое в папку `Смена-исследование/` без `.DS_Store`. Скрипт запускается вручную и в `npm test` не входит.

Обновить набор:

```bash
cd <любая папка вне репозитория>
/path/to/mac-transcribe-site/tools/pack-kit.sh /path/to/product-ai/lite   # [путь к check-kit.sh], по умолчанию <lite>/../tools/check-kit.sh
gh release upload starter-kit mactranscribe-starter-kit.zip --clobber -R art-ps/mac-transcribe-releases
```

Первая публикация — по чеклисту `docs/superpowers/plans/2026-10-28-pm-workflow-landing-publish.md`.
