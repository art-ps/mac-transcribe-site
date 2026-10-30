export const release = Object.freeze({
  fileName: "MacTranscribe.dmg",
  sizeLabel: "40 МБ",
  macOS: "macOS 26.0+, Apple Silicon",
  modelLabel: "модели выбираются при первом запуске",
});

// DMG живёт в GitHub Releases публичного репо (код приватный — ссылки туда отдают 404),
// ссылка всегда на последний релиз.
export const releasesUrl = "https://github.com/art-ps/mac-transcribe-releases/releases";
export const downloadUrl = `${releasesUrl}/latest/download/MacTranscribe.dmg`;

// Стартовый набор промптов и инструкций лежит релизом в том же публичном репо.
export const kitUrl = `${releasesUrl}/download/starter-kit/mactranscribe-starter-kit.zip`;
export const kitSizeLabel = "около 70 КБ";
export const contactUrl = "https://github.com/art-ps/mac-transcribe-releases/issues";
export const authorUrl = "https://vibecoded.ru";
