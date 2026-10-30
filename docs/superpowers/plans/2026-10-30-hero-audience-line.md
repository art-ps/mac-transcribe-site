# Строка «Для продактов…» на первом экране — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** строка аудитории переезжает из «Сценариев» в hero.

**Architecture:** перенос одного `<p>` между двумя компонентами и одно CSS-правило.

**Tech Stack:** React 19, `node --test`.

**Spec:** `docs/superpowers/specs/2026-10-30-hero-audience-line-design.md`

## Global Constraints

- Текст строки дословно из спеки. Остальные тексты, ссылки, `id`, `data-umami-*` не трогать.
- Существующие тесты не менять, новый — добавить в `tests/site-content.test.mjs`.
- Новых зависимостей нет. Коммит без трейлеров `Co-Authored-By`/`Claude-Session`. Не пушить.
- Никогда не запускать MacTranscribe, не читать `~/Library/Application Support/mac-transcribe/`, `~/Obsidian`.

## Review Focus

1. Первый экран 1280×800: кнопка «Скачать для Mac» ушла ниже сгиба.
2. Строка осталась и в «Сценариях» (дубль).
3. «Сценарии» без lead-строки: у заголовка не осталось висящего пустого отступа.

---

### Task 1: Перенос строки

**Files:**
- Modify: `src/sections/Hero.tsx`, `src/sections/Scenarios.tsx`, `src/styles.css`
- Test: `tests/site-content.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
test("hero names the audience", () => {
  const line = "Для продактов: интервью, созвоны с командой, демо";
  assert.ok(read("src/sections/Hero.tsx").includes(line));
  assert.ok(!read("src/sections/Scenarios.tsx").includes(line));
});
```

- [ ] **Step 2: Run** `npm test` — FAIL.
- [ ] **Step 3:** перенос по спеке; правило `.hero .lead + .lead { margin-top: var(--space-xs); }` рядом с `.hero .lead` в `src/styles.css`; правило `.scenarios .lead` удалить, если больше не используется.
- [ ] **Step 4: Run** `npm test && npm run lint && npm run build` — PASS; `node /Users/artem/.claude/skills/hallmark/scripts/sloplint.mjs src/styles.css src/base.css src/tokens.css --genre modern-minimal` — 0 FAIL; скриншот 1280×800 с `--force-prefers-reduced-motion` (Brave headless, команда — в `docs/superpowers/plans/2026-10-30-landing-hallmark-redesign.md`, Global Constraints) — кнопка видна.
- [ ] **Step 5: Commit** `git commit -m "feat: audience line back on the first screen"`
