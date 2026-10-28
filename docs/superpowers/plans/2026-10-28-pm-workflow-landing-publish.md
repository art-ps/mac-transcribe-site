# Публикация лендинга «от созвона к продуктовым решениям» — чеклист

Всё ниже меняет публичные ресурсы. **Каждый шаг выполняется только по «да» владельца** на этот конкретный шаг. Порядок важен: релиз `starter-kit` должен появиться до пуша сайта, иначе кнопка «Скачать набор» отдаёт 404.

Локально уже сделано: коммиты сайта в ветке `pm-workflow-landing`, правка `lite/README.md` в `product-ai` (коммит на `master`, не запушен).

## 1. Собрать архив набора — только по «да» владельца

Сначала: `git -C /Users/artem/projects/product-ai status --short lite` пуст (в архив уходит рабочая папка, не git-дерево).

```bash
cd /path/to/scratch   # не в репозиторий сайта: *.zip в .gitignore, но архиву там не место
/Users/artem/projects/mac-transcribe-site/tools/pack-kit.sh /Users/artem/projects/product-ai/lite
```

Ожидается: `OK: набор корректен`, путь к `mactranscribe-starter-kit.zip`, в `unzip -l` — `Смена-исследование/AGENTS.md`, `CLAUDE.md`, `README.md`, три `_prompts/*.md`, четыре `Встречи/*.md`, без `.DS_Store`; размер около 70 КБ.

## 2. Создать релиз `starter-kit` с архивом — только по «да» владельца

```bash
gh release create starter-kit mactranscribe-starter-kit.zip \
  -R art-ps/mac-transcribe-releases \
  --latest=false \
  --title "Стартовый набор продакта для работы со встречами" \
  --notes "Папка с промптами, правилами для Claude Code и Codex и демо-исследованием: три интервью и командная встреча с готовыми разборами.
Как пользоваться — https://art-ps.github.io/mac-transcribe-site/#kit"
```

`--latest=false` обязателен: иначе `starter-kit` станет «Latest» и кнопка DMG (`releases/latest/download/…`) начнёт отдавать 404. Проверить: `releases/latest/download/MacTranscribe.dmg` должен по-прежнему вести на релиз приложения. Если `starter-kit` стал Latest — вернуть флаг: `gh release edit <тег последнего релиза приложения> --latest -R art-ps/mac-transcribe-releases`.

Обновление набора позже: шаг 1, затем `gh release upload starter-kit mactranscribe-starter-kit.zip --clobber -R art-ps/mac-transcribe-releases`.

## 3. Обновить README `art-ps/mac-transcribe-releases` — только по «да» владельца

Новый текст целиком:

```markdown
# MacTranscribe

Транскрибация встреч на Mac. Приложение записывает микрофон и системный звук — вас и собеседников в любом созвоне, — расшифровывает разговор локально, со спикерами и таймкодами, и экспортирует результат в TXT, Markdown и SRT или кнопкой «В хранилище» кладёт транскрипт markdown-файлом в выбранную папку проекта.

Скачать последнюю версию: https://github.com/art-ps/mac-transcribe-releases/releases/latest/download/MacTranscribe.dmg

Установка: перетащить в «Программы»; при первом запуске приложение скачает модели и попросит доступ к микрофону и записи экрана. Требования: macOS 26.0+, Apple Silicon.

- Сайт: https://art-ps.github.io/mac-transcribe-site/
- Документация: https://art-ps.github.io/mac-transcribe-site/docs/
- Стартовый набор продакта для работы со встречами: https://github.com/art-ps/mac-transcribe-releases/releases/download/starter-kit/mactranscribe-starter-kit.zip
```

Применение (текст выше сохранить в `README.md` в scratch-папке):

```bash
sha=$(gh api repos/art-ps/mac-transcribe-releases/contents/README.md --jq .sha)
gh api -X PUT repos/art-ps/mac-transcribe-releases/contents/README.md \
  -f message="docs: README — macOS 26.0+, links to the site, docs and starter kit" \
  -f content="$(base64 -i README.md)" \
  -f sha="$sha"
```

## 4. Пуш сайта → GitHub Pages — только по «да» владельца

Ветка `pm-workflow-landing` вливается в `master` (как именно — решение владельца), затем:

```bash
cd /Users/artem/projects/mac-transcribe-site
git push origin master
```

Деплой — GitHub Actions на пуш в `master`. Пуш `product-ai` — отдельным «да».

## 5. Проверка живого сайта — только по «да» владельца

```bash
curl -s https://art-ps.github.io/mac-transcribe-site/ | grep -c "от созвона к продуктовым решениям"
curl -sI https://github.com/art-ps/mac-transcribe-releases/releases/download/starter-kit/mactranscribe-starter-kit.zip | head -1   # ожидается 302
curl -sI https://github.com/art-ps/mac-transcribe-releases/releases/latest/download/MacTranscribe.dmg | head -1                 # ожидается 302
```

Первое число больше нуля — новый `<title>` на месте. Текст страницы («Ваши встречи — …») рисует React, в HTML его нет: смотреть в браузере. Превью ссылки (og-карточка) — в любом мессенджере или через отладчик соцсети.
