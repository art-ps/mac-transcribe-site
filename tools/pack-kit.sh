#!/usr/bin/env bash
# Упаковка стартового набора: tools/pack-kit.sh LITE_DIR [CHECK_KIT]
# Архив ./mactranscribe-starter-kit.zip в текущей папке, внутри — Смена-исследование/ = содержимое LITE_DIR.
set -euo pipefail

lite="${1:?использование: tools/pack-kit.sh LITE_DIR [CHECK_KIT]}"
lite="$(cd "$lite" && pwd)"
check="${2:-$lite/../tools/check-kit.sh}"
[ -f "$check" ] || { echo "FAIL: нет check-kit.sh ($check)" >&2; exit 1; }
bash "$check" "$lite" || { echo "FAIL: check-kit.sh не прошёл" >&2; exit 1; }

out="$(pwd)/mactranscribe-starter-kit.zip"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cp -Rp "$lite" "$tmp/Смена-исследование"
find "$tmp" -name .DS_Store -delete
rm -f "$out"
(cd "$tmp" && find Смена-исследование | LC_ALL=C sort | zip -X -q "$out" -@)

echo "$out"
unzip -l "$out"
du -h "$out" | cut -f1
