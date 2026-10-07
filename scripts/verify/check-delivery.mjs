const { deliveryWindow } = await import("@/features/orders/delivery");
const { canCancel } = await import("@nivora/shared/domain/orders");
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
ok(deliveryWindow("standard", "2026-10-06T10:00:00.000Z") === "10 Oct 2026 – 12 Oct 2026", `standard from 6 Oct → ${deliveryWindow("standard", "2026-10-06T10:00:00.000Z")} (4–6 days)`);
ok(deliveryWindow("express", "2026-10-06T10:00:00.000Z") === "7 Oct 2026 – 8 Oct 2026", `express from 6 Oct → ${deliveryWindow("express", "2026-10-06T10:00:00.000Z")} (1–2 days)`);
ok(deliveryWindow("standard", "2026-12-29T10:00:00.000Z") === "2 Jan 2027 – 4 Jan 2027", "window crosses the year boundary correctly");
ok(["Placed","Confirmed"].every(canCancel) && !["Shipped","Delivered","Cancelled"].some(canCancel), "Cancel Order shown only for Placed/Confirmed");
console.log(fail ? `${fail} FAILED` : "ALL PASS");
