# Protected routes (TASK-060 version): server HTML is the guard skeleton, contains no customer data, and is noindex.
import re,urllib.request
fail=0
for p in ["/wishlist","/account","/account/orders","/account/orders/NIV-2026-000001","/account/addresses","/checkout","/order-confirmation/NIV-2026-000001"]:
    h=urllib.request.urlopen("http://localhost:3100"+p).read().decode()
    visible=re.sub(r"<script.*?</script>","",h,flags=re.S)
    customer=re.search(r"NIV-2026-0000\d\d\b(?!\")|Joseph|joseph@example|Bengaluru|560038|9876543210",visible)
    good="Loading…" in visible and not customer and 'content="noindex, nofollow"' in h
    fail+=not good; print(("PASS " if good else "FAIL ")+f"{p}: guard skeleton, no customer data, noindex")
print("ALL PASS" if not fail else f"{fail} FAILED")
