#!/bin/bash
# Usage: shot.sh <path> <width> <height> <out.png>  — headless Chrome screenshot of the verification server.
SP="$(cd "$(dirname "$0")" && pwd)/.out"; mkdir -p "$SP"
google-chrome --headless=new --disable-gpu --hide-scrollbars --no-first-run --user-data-dir=$SP/chrome-profile \
  --window-size=$2,$3 --virtual-time-budget=6000 --screenshot=$4 "http://localhost:3100$1" >/dev/null 2>&1
echo "saved $4"
