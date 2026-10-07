#!/bin/bash
# Counts SQL statements per API request (API started with PRISMA_LOG_QUERIES=1 via api.sh).
# Usage: query-count.sh  — logs in as Joseph and exercises the main endpoints once each.
V="$(cd "$(dirname "$0")" && pwd)"; LOG="$V/.out/api.log"; B=http://localhost:4100/api/v1; J="$V/.out/qc-jar"; rm -f "$J"
O="Origin: http://localhost:3100"; H="Content-Type: application/json"
clean() { sed 's/\x1b\[[0-9;]*m//g' "$LOG"; }
step() {
  local name="$1"; shift; local before; before=$(clean | wc -l); "$@" > /dev/null; sleep 0.3
  local new; new=$(clean | tail -n +$((before + 1)) | grep -F "[PrismaService] query")
  printf "%-26s %2s statements\n" "$name" "$(printf "%s" "$new" | grep -c query)"
  [ -z "$VERBOSE" ] || printf "%s\n" "$new" | sed -E 's/.*query [0-9.]+ms /    /' | cut -c1-110
}
curl -s -c "$J" -b "$J" -H "$O" -H "$H" -d '{"email":"joseph@example.com","password":"password123"}' $B/auth/login > /dev/null
ADDR=$(curl -s -c "$J" -b "$J" -H "$O" -H "$H" -d '{"fullName":"Q","phone":"9876543210","line1":"1","city":"B","state":"Karnataka","postalCode":"560038","country":"India"}' $B/addresses | python3 -c 'import json,sys;print(json.load(sys.stdin)["id"])')
step "GET /products (listing)" curl -s "$B/products?in_category=fashion&sort=price-asc"
step "GET /products/:slug" curl -s $B/products/apple-iphone-15
step "GET /auth/session" curl -s -b "$J" $B/auth/session
step "GET /cart" curl -s -b "$J" $B/cart
step "POST /cart/items" curl -s -c "$J" -b "$J" -H "$O" -H "$H" -d '{"variantId":"northline-pique-polo-t-shirt-black-l","quantity":1}' $B/cart/items
step "GET /checkout" curl -s -b "$J" "$B/checkout?deliveryOption=standard"
step "GET /wishlist" curl -s -b "$J" $B/wishlist
step "GET /orders" curl -s -b "$J" $B/orders
step "POST /orders (cart)" curl -s -b "$J" -H "$O" -H "$H" -d "{\"addressId\":\"$ADDR\",\"deliveryOption\":\"standard\"}" $B/orders
