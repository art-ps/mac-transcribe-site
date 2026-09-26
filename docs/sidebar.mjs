// Сайдбар отдельно от config.mts, чтобы node-тесты могли сверить его со страницами.
export const sidebar = [
  {
    text: "Начало",
    items: [
      { text: "Обзор", link: "/" },
      { text: "Установка", link: "/install" },
    ],
  },
  {
    text: "Как это работает",
    items: [
      { text: "Запись и транскрипция", link: "/transcription" },
      { text: "Работа с записями", link: "/recordings" },
    ],
  },
];
