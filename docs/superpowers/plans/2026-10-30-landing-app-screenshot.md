# Лендинг: скриншот приложения — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** под первым экраном секция «снимок окна слева, текст справа».

**Architecture:** одна секция прямо в `src/App.tsx` после `<Hero />`, стили — в конец `src/styles.css`, картинка — в `public/`.

**Tech Stack:** Vite 8, React 19, TypeScript, `node --test`.

**Spec:** `docs/superpowers/specs/2026-10-30-landing-app-screenshot-design.md`

## Global Constraints

- Исходник скриншота: `/private/tmp/claude-501/-Users-artem-projects-mac-transcribe/7becc1de-0c99-4cc7-b66a-ccd314b8a711/scratchpad/app-shot/app-transcript.png`. Не ретушировать, не обрезать.
- Тексты, alt, класс, `id` — дословно из спеки.
- Floor Hallmark (см. спеку «Ограничения»); тесты только добавлять.
- Никогда не запускать MacTranscribe и не читать `~/Library/Application Support/mac-transcribe/`, `~/Obsidian`.
- Новых npm-зависимостей нет; нужна установка — стоп, BLOCKED.
- Коммиты без трейлеров `Co-Authored-By` и `Claude-Session`. Не пушить.
- Проверки из `/Users/artem/projects/mac-transcribe-site`: `npm test`, `npm run lint`, `npm run build`, `node /Users/artem/.claude/skills/hallmark/scripts/sloplint.mjs src/styles.css src/base.css src/tokens.css --genre modern-minimal`.

## Review Focus

1. Горизонтальный скролл на 390px из-за картинки (нет `minmax(0, 1fr)` или `max-width`).
2. `width`/`height` в разметке не совпадают с файлом — сдвиг макета при загрузке.
3. Новая секция ломает отступ между hero и «Сценариями» (двойной padding).
4. Литерал цвета или шрифта вне токенов.
5. Файл картинки больше ~400 КБ.

---

### Task 1: Секция со скриншотом

**Files:**
- Create: `public/app-transcript.jpg`
- Modify: `src/App.tsx`, `src/styles.css`
- Test: `tests/site-content.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
test("landing shows the app screenshot", () => {
  assert.ok(tsx.includes("app-transcript.jpg"));
  assert.ok(tsx.includes("Транскрипт с говорящими и таймкодами"));
  assert.ok(existsSync(new URL("../public/app-transcript.jpg", import.meta.url)));
});
```
(`existsSync` добавить в импорт из `node:fs`.)

- [ ] **Step 2: Run** `npm test` — FAIL на новом тесте.

- [ ] **Step 3: Картинка:** `sips -s format jpeg -s formatOptions 82 --resampleWidth 1400 <исходник> --out public/app-transcript.jpg`; размеры взять из `sips -g pixelWidth -g pixelHeight`.

- [ ] **Step 4: Секция** по спеке в `src/App.tsx` после `<Hero />`; стили: `.app-shot { padding-block: var(--section-gap-s) 0; }`, сетка `repeat(2, minmax(0, 1fr))` с `gap: var(--gap-columns)`, `align-items: center`, ниже `60rem` — одна колонка; картинка `width: 100%; height: auto`; h2 — как заголовки других секций (переиспользовать их правило, если подходит).

- [ ] **Step 5: Run** `npm test && npm run lint && npm run build` — PASS; sloplint 0 FAIL; скриншоты 1440 и 390 (headless Brave, как в `docs/superpowers/plans/2026-10-30-landing-hallmark-redesign.md` Global Constraints) — секция видна, без горизонтального скролла на 390.

- [ ] **Step 6: Commit** `git commit -m "feat: app screenshot section under the hero"`
