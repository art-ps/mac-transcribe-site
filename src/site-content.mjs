export const release = Object.freeze({
  version: "build-13",
  fileName: "MacTranscribe.dmg",
  sizeLabel: "40 МБ",
  macOS: "macOS 26, Apple Silicon",
  modelLabel: "модель 626 МБ загружается при первом запуске",
});

// DMG живёт в GitHub Releases (39+ МБ — не для git), ссылка всегда на последний билд.
export const downloadUrl =
  "https://github.com/art-ps/mac-transcribe/releases/latest/download/MacTranscribe.dmg";
