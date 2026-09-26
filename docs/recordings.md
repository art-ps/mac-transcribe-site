# Работа с записями

## Где хранятся записи

Каждая запись — отдельная папка в `~/Library/Application Support/mac-transcribe/conversations`, внутри аудио и транскрипт (`Sources/ConversationStore.swift:4, 12-14`).

Аудио пишется сразу в аудиокодек Opus, в контейнере `.ogg` (`Sources/OggRecorder.swift:3, 92-94`).

## Прослушивание

Клик по фразе в транскрипте перематывает аудио на её начало (`Sources/TranscriptView.swift:106`). Фраза, которая играет сейчас, подсвечивается (`Sources/TranscriptView.swift:37-40, 81-87`).

Кнопка «Скачать» сохраняет аудио отдельным файлом `.ogg` — через системное окно сохранения (`Sources/PlayerView.swift:38-43, 53-59`).

## Перетранскрибировать

Кнопка «Перетранскрибировать» открывает меню со скачанными моделями обоих движков — Whisper и GigaAM (`Sources/MacTranscribeApp.swift:394-395, 397-403`; `Sources/RetranscribeMenu.swift:31-48`). Подробнее о движках и моделях — на странице [«Запись и транскрипция»](/transcription).

В том же меню есть галка «Разделить собеседников»: она запускает отдельный проход с разделением по спикерам, это не поведение по умолчанию (`Sources/MacTranscribeApp.swift:411, 434-435`).

## Импорт готовых файлов

Импортировать можно аудио или видео файл — перетащить его в окно приложения или выбрать через меню «+» → «Импортировать аудио/видео файл» (`Sources/MacTranscribeApp.swift:201-209`; `Sources/SidebarView.swift:116-121`). За один раз — только один файл (`Sources/MacTranscribeApp.swift:206`).

После импорта файл перекодируется в тот же формат, что и запись — аудиокодек Opus в `.ogg` (`Sources/OggRecorder.swift:51-73`). Первый проход по импортированной записи идёт без разделения по спикерам (`Sources/MacTranscribeApp.swift:836`).

## Несколько записей сразу

Выделить несколько записей в списке можно ⇧ Shift или ⌘ Cmd — так же, как в любом нативном списке macOS (`Sources/MacTranscribeApp.swift:79-82`).

Над выделением работают три действия (`Sources/SidebarView.swift:134-177`):

- «В вольт: N» — экспортирует по очереди все выбранные записи, у которых уже есть транскрипт (`Sources/SidebarView.swift:138-145`; `Sources/MacTranscribeApp.swift:911-926`);
- «Транскрибировать: N» — ставит подходящие записи в очередь проходов (`Sources/SidebarView.swift:147-155`; `Sources/MacTranscribeApp.swift:939-950`);
- «Удалить: N» — удаляет выбранные записи, кроме тех, что сейчас пишутся или транскрибируются (`Sources/SidebarView.swift:170-177`; `Sources/MacTranscribeApp.swift:952-965`).

## Экспорт

Транскрипт текущей записи экспортируется в TXT, Markdown или SRT — формат выбирается расширением файла в системном окне сохранения (`Sources/MacTranscribeApp.swift:841-859`; `Sources/Export.swift:6-29`).

Кнопка «В вольт» пишет markdown-файл с полным транскриптом в вольт Obsidian (`Sources/VaultExport.swift:10-43`). По умолчанию файл уходит в ту же папку, где лежат записи, пока в Настройках не выбрана отдельная папка вольта (`Sources/AppSettings.swift:94-97`; `Sources/ConversationStore.swift:10-14`); сменить папку можно там же кнопкой «Выбрать папку…» (`Sources/SettingsView.swift:91, 99-106`).

Имя файла — `MT-ГГГГ-ММ-ДД-ЧЧММ Название.md` (`Sources/VaultExport.swift:45-52`).
