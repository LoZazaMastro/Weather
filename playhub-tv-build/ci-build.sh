#!/usr/bin/env bash
set -euo pipefail

PAYLOAD_DIR="playhub-tv-build"
RESULT="/tmp/result"
IPK="$RESULT/Playhub-TV_1.2.0_arm.ipk"
PROJECT="$RESULT/Playhub-TV_Project_1.2.0.zip"
REPORT="$RESULT/Build-Verification.txt"

printf 'Reconstructing private build payload...\n'
test "$(find "$PAYLOAD_DIR" -maxdepth 1 -type f -name 'payload.*' | wc -l)" -eq 9
cat \
  "$PAYLOAD_DIR/payload.00" \
  "$PAYLOAD_DIR/payload.01" \
  "$PAYLOAD_DIR/payload.02" \
  "$PAYLOAD_DIR/payload.03" \
  "$PAYLOAD_DIR/payload.04" \
  "$PAYLOAD_DIR/payload.05" \
  "$PAYLOAD_DIR/payload.06" \
  "$PAYLOAD_DIR/payload.07" \
  "$PAYLOAD_DIR/payload.08" \
  | tr -d '\r\n' | base64 --decode > /tmp/playhub-ci-payload.tar.gz
test "$(stat -c '%s' /tmp/playhub-ci-payload.tar.gz)" -eq 146877
gzip -t /tmp/playhub-ci-payload.tar.gz
rm -rf /tmp/playhub-build
mkdir -p /tmp/playhub-build
tar -xzf /tmp/playhub-ci-payload.tar.gz -C /tmp/playhub-build
test -f /tmp/playhub-build/build.sh
test -f /tmp/playhub-build/playhub.patch
test -f /tmp/playhub-build/prepare.py

printf 'Installing host build dependencies...\n'
sudo apt-get update
sudo apt-get install -y \
  binutils cmake curl file gettext git make python3 python3-pil \
  rsync unzip xz-utils zip

printf 'Installing webOS ARM SDK...\n'
curl --fail --location --retry 5 --retry-delay 3 \
  'https://github.com/openlgtv/buildroot-nc4/releases/download/webos-b17b4cc/arm-webos-linux-gnueabi_sdk-buildroot.tar.gz' \
  --output /tmp/webos-sdk.tar.gz
rm -rf /tmp/arm-webos-linux-gnueabi_sdk-buildroot
tar -xzf /tmp/webos-sdk.tar.gz -C /tmp
/tmp/arm-webos-linux-gnueabi_sdk-buildroot/relocate-sdk.sh
test -f /tmp/arm-webos-linux-gnueabi_sdk-buildroot/share/buildroot/toolchainfile.cmake
test -x /tmp/arm-webos-linux-gnueabi_sdk-buildroot/bin/arm-webos-linux-gnueabi-g++

printf 'Compiling Playhub TV...\n'
export TOOLCHAIN_FILE=/tmp/arm-webos-linux-gnueabi_sdk-buildroot/share/buildroot/toolchainfile.cmake
chmod +x /tmp/playhub-build/build.sh
/tmp/playhub-build/build.sh

printf 'Verifying generated packages...\n'
test -s "$IPK"
test -s "$PROJECT"
unzip -t "$PROJECT" >/tmp/project-zip-test.txt

rm -rf /tmp/ipk-check
mkdir -p /tmp/ipk-check/ar /tmp/ipk-check/control /tmp/ipk-check/data
(
  cd /tmp/ipk-check/ar
  ar x "$IPK"
)
test -f /tmp/ipk-check/ar/debian-binary
CONTROL_ARCHIVE="$(find /tmp/ipk-check/ar -maxdepth 1 -type f -name 'control.tar*' | head -n1)"
DATA_ARCHIVE="$(find /tmp/ipk-check/ar -maxdepth 1 -type f -name 'data.tar*' | head -n1)"
test -n "$CONTROL_ARCHIVE"
test -n "$DATA_ARCHIVE"
tar -xf "$CONTROL_ARCHIVE" -C /tmp/ipk-check/control
tar -xf "$DATA_ARCHIVE" -C /tmp/ipk-check/data

CONTROL_FILE="$(find /tmp/ipk-check/control -type f -name control | head -n1)"
APPINFO="$(find /tmp/ipk-check/data -type f -name appinfo.json | head -n1)"
test -n "$CONTROL_FILE"
test -n "$APPINFO"
grep -Eq '^Version:[[:space:]]*1\.2\.0([[:space:]]|$)' "$CONTROL_FILE"

python3 - "$APPINFO" <<'PY'
import json
import sys
from pathlib import Path
appinfo = Path(sys.argv[1])
data = json.loads(appinfo.read_text(encoding='utf-8'))
assert data.get('title') == 'Playhub TV', data
assert data.get('version') == '1.2.0', data
assert data.get('main'), data
PY

ELF_FILE="$(find /tmp/ipk-check/data -type f -exec file {} \; | awk -F: '/ELF .* ARM/{print $1; exit}')"
test -n "$ELF_FILE"
file "$ELF_FILE" | grep -q 'ELF.*ARM'

VISIBLE_BRANDING_STATUS='PASS: no visible Aurora TV / Quit Aurora / AURORA text found.'
if grep -RInaE 'Aurora TV|Quit Aurora|AURORA' /tmp/ipk-check/data >/tmp/visible-branding-leftovers.txt; then
  cat /tmp/visible-branding-leftovers.txt
  echo 'Visible Aurora branding remains in packaged files.' >&2
  exit 1
fi

{
  echo 'Playhub TV 1.2.0 - Build Verification'
  echo '========================================'
  echo
  echo "GitHub run ID: ${GITHUB_RUN_ID:-unknown}"
  echo "GitHub run attempt: ${GITHUB_RUN_ATTEMPT:-unknown}"
  echo "Build ref: ${GITHUB_REF_NAME:-unknown}"
  echo "Build commit: ${GITHUB_SHA:-unknown}"
  echo 'Upstream source: GuiDev1994/aurora-tv'
  echo 'Upstream source commit: 8c0c62e4abf98ccd511e015105f062576d793342'
  echo 'Target: LG webOS / ARM'
  echo
  echo 'Required files:'
  stat -c '  %n | %s bytes' "$IPK" "$PROJECT"
  echo
  echo 'IPK archive members:'
  ar t "$IPK" | sed 's/^/  /'
  echo
  echo 'Package control metadata:'
  sed 's/^/  /' "$CONTROL_FILE"
  echo
  echo 'webOS appinfo metadata:'
  python3 - "$APPINFO" <<'PY'
import json
import sys
from pathlib import Path
data = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
for key in ('id', 'title', 'version', 'main', 'icon', 'largeIcon', 'splashBackground'):
    print(f'  {key}: {data.get(key, "")}')
PY
  echo
  echo 'Compiled application binary:'
  file "$ELF_FILE" | sed 's/^/  /'
  echo
  echo 'Project archive integrity:'
  tail -n 1 /tmp/project-zip-test.txt | sed 's/^/  /'
  echo
  echo 'Visible branding checks in packaged files:'
  echo "  $VISIBLE_BRANDING_STATUS"
  echo
  echo 'Mandatory verification gates: PASS'
} > "$REPORT"

rm -f "$RESULT/SHA256SUMS.txt"
(
  cd "$RESULT"
  sha256sum \
    Playhub-TV_1.2.0_arm.ipk \
    Playhub-TV_Project_1.2.0.zip \
    Build-Verification.txt \
    > SHA256SUMS.txt
  sha256sum -c SHA256SUMS.txt
)

printf 'Build and verification complete.\n'
