import { defineConfig } from "vitepress";
import { sidebar } from "../sidebar.mjs";

const landing = "https://art-ps.github.io/mac-transcribe-site/";

// Собирается после лендинга прямо в dist/docs: один деплой GitHub Pages несёт и
// страницу, и документацию. Сайт живёт на подпути github.io, отсюда base.
export default defineConfig({
  title: "MacTranscribe",
  description:
    "Документация MacTranscribe: установка, запись и транскрипция, работа с записями, настройки и приватность.",
  lang: "ru-RU",
  base: "/mac-transcribe-site/docs/",
  outDir: "../dist/docs",
  // Спеки и планы лежат рядом, но это рабочие документы, а не часть сайта.
  srcExclude: ["superpowers/**"],
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", type: "image/png", href: "/mac-transcribe-site/docs/mac-transcribe-icon.png" }],
    [
      "script",
      {
        // async, не defer: defer-скрипт выполнился бы строго по порядку и задержал бы страницу,
        // пока stats.pisarev.me не ответит.
        async: "",
        src: "https://stats.pisarev.me/script.js",
        "data-website-id": "8dab4e02-8bda-4cb5-a41a-a9ac3ff01ca4",
      },
    ],
  ],
  themeConfig: {
    logo: "/mac-transcribe-icon.png",
    nav: [
      { text: "Документация", link: "/" },
      { text: "Скачать", link: landing },
    ],
    sidebar,
    outline: { label: "На этой странице", level: [2, 3] },
    docFooter: { prev: "Назад", next: "Дальше" },
    darkModeSwitchLabel: "Оформление",
    returnToTopLabel: "Наверх",
    sidebarMenuLabel: "Разделы",
    lastUpdatedText: "Обновлено",
    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "Поиск", buttonAriaLabel: "Поиск по документации" },
          modal: {
            noResultsText: "Ничего не найдено",
            resetButtonTitle: "Сбросить",
            footer: { selectText: "выбрать", navigateText: "переход", closeText: "закрыть" },
          },
        },
      },
    },
    footer: {
      message:
        'Локальная транскрипция встреч для macOS. Проект <a href="https://vibecoded.ru" target="_blank" rel="noopener">vibecoded.ru</a>.',
      copyright: '<a href="https://art-ps.github.io/mac-transcribe-site/">MacTranscribe</a>',
    },
  },
});
