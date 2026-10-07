#!/bin/bash
# Usage: api.sh start|stop [port] — runs the built backend (dist/main.js) on a port (default 4100).
# Environment passes through (e.g. ENV_FILE=.env.test FRONTEND_ORIGIN=http://localhost:3100).
SP="$(cd "$(dirname "$0")" && pwd)/.out"; mkdir -p "$SP"
PORT=${2:-4100}
pid_on_port() { ss -ltnpH "sport = :$PORT" 2>/dev/null | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u; }
cd "$(dirname "$0")/../../backend"
if [ "$1" = start ]; then
  if [ -n "$(pid_on_port)" ]; then echo "port $PORT is already in use (pid $(pid_on_port)); run api.sh stop $PORT"; exit 1; fi
  PORT=$PORT setsid node dist/main.js > "$SP/api.log" 2>&1 < /dev/null & echo $! > "$SP/api.pgid"
  for i in $(seq 1 80); do curl -s -o /dev/null localhost:$PORT && exit 0; sleep 0.25; done; echo "api failed"; cat "$SP/api.log"; exit 1
else
  [ -f "$SP/api.pgid" ] && kill -- -"$(cat "$SP/api.pgid")" 2>/dev/null
  for p in $(pid_on_port); do kill "$p" 2>/dev/null; done
  for i in $(seq 1 20); do [ -z "$(pid_on_port)" ] && { echo "api stopped"; exit 0; }; sleep 0.25; done
  echo "WARN: $PORT still in use"; exit 1
fi
