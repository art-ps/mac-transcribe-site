#!/usr/bin/env bash
# Упаковка стартового набора: tools/pack-kit.sh LITE_DIR [CHECK_KIT]
# Архив ./mactranscribe-starter-kit.zip в текущей папке, внутри — Смена-исследование/ = содержимое LITE_DIR.
set -euo pipefail

[ $# -ge 1 ] || { echo "использование: tools/pack-kit.sh LITE_DIR [CHECK_KIT]" >&2; exit 1; }
lite="$1"
[ -d "$lite" ] || { echo "FAIL: нет папки $lite" >&2; exit 1; }
lite="$(cd -- "$lite" >/dev/null && pwd)"
check="${2:-$lite/../tools/check-kit.sh}"
[ -f "$check" ] || { echo "FAIL: нет check-kit.sh ($check)" >&2; exit 1; }
bash "$check" "$lite" || { echo "FAIL: check-kit.sh не прошёл" >&2; exit 1; }

out="$(pwd)/mactranscribe-starter-kit.zip"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cp -Rp "$lite" "$tmp/Смена-исследование"
find "$tmp" -name .DS_Store -delete
rm -f "$out"
# zipfile ставит UTF-8 флаг для кириллических имён; фиксированные дата и права — архив побайтно одинаков.
python3 -I - "$tmp" "$out" <<'PY'
import os, sys, zipfile
root, out = sys.argv[1], sys.argv[2]
paths = []
for d, dirs, files in os.walk(os.path.join(root, "Смена-исследование")):
    paths += [os.path.join(d, f) for f in files]
with zipfile.ZipFile(out, "w") as z:
    for p in sorted(paths):
        info = zipfile.ZipInfo(os.path.relpath(p, root), date_time=(2026, 10, 28, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        with open(p, "rb") as f:
            z.writestr(info, f.read())
PY

echo "$out"
unzip -l "$out"
du -h "$out" | cut -f1
