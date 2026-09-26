export const release = Object.freeze({
  fileName: "MacTranscribe.dmg",
  sizeLabel: "60 МБ",
  macOS: "macOS 26.4+, Apple Silicon",
  modelLabel: "модель 483–626 МБ загружается при первом запуске",
});

// DMG живёт в GitHub Releases публичного репо (код приватный — ссылки туда отдают 404),
// ссылка всегда на последний релиз.
export const releasesUrl = "https://github.com/art-ps/mac-transcribe-releases/releases";
export const downloadUrl = `${releasesUrl}/latest/download/MacTranscribe.dmg`;
