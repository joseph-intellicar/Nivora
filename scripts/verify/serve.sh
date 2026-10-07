#!/bin/bash
# Usage: serve.sh start|stop — `next start` of the current frontend build on port 3100 (never 3000).
# Pass BACKEND_URL for http-mode builds. Refuses to start if the port is taken (a stale server
# would silently serve an old build); stop kills whatever listens on the port.
SP="$(cd "$(dirname "$0")" && pwd)/.out"; mkdir -p "$SP"
PORT=3100
pid_on_port() { ss -ltnpH "sport = :$PORT" 2>/dev/null | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u; }
cd "$(dirname "$0")/../../frontend"
if [ "$1" = start ]; then
  if [ -n "$(pid_on_port)" ]; then echo "port $PORT is already in use (pid $(pid_on_port)); run serve.sh stop"; exit 1; fi
  setsid npx next start -p $PORT > "$SP/start.log" 2>&1 < /dev/null & echo $! > "$SP/serve.pgid"
  for i in $(seq 1 60); do curl -s -o /dev/null localhost:$PORT && exit 0; sleep 0.5; done; echo "server failed"; cat "$SP/start.log"; exit 1
else
  [ -f "$SP/serve.pgid" ] && kill -- -"$(cat "$SP/serve.pgid")" 2>/dev/null
  for p in $(pid_on_port); do kill "$p" 2>/dev/null; done
  for i in $(seq 1 20); do [ -z "$(pid_on_port)" ] && { echo "server stopped"; exit 0; }; sleep 0.25; done
  echo "WARN: $PORT still in use"; exit 1
fi
