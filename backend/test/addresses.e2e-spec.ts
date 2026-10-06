import type { INestApplication } from "@nestjs/common";
import { createTestApp } from "./app-factory.js";
import { browser } from "./http-client.js";
import { addAddress, GOOD_ADDRESS, signedUpCustomer } from "./test-data.js";

describe("addresses (e2e, P2-024)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("guests get 401", async () => {
    await browser(app).get("/api/v1/addresses").expect(401);
    await browser(app).post("/api/v1/addresses").send(GOOD_ADDRESS).expect(401);
  });

  it("invalid PIN / phone / state → INVALID_ADDRESS 422 with field messages", async () => {
    const { client } = await signedUpCustomer(app, "addr");
    const pin = await client
      .post("/api/v1/addresses")
      .send({ ...GOOD_ADDRESS, postalCode: "000000" })
      .expect(422);
    expect(pin.body.error).toMatchObject({
      code: "INVALID_ADDRESS",
      message: "Please check the delivery address and try again.",
      details: { fields: { postalCode: "Please enter a valid 6-digit PIN code." } },
    });
    const phone = await client
      .post("/api/v1/addresses")
      .send({ ...GOOD_ADDRESS, phone: "12345" })
      .expect(422);
    expect(phone.body.error.details.fields.phone).toBe(
      "Please enter a valid 10-digit mobile number.",
    );
    const country = await client
      .post("/api/v1/addresses")
      .send({ ...GOOD_ADDRESS, state: "Atlantis", country: "Nepal" })
      .expect(422);
    expect(country.body.error.details.fields).toEqual({
      state: "Please select a state.",
      country: "Nivora delivers within India only.",
    });
    expect((await client.get("/api/v1/addresses")).body).toEqual([]);
  });

  it("first address is the default; set default, edit, delete promote — exactly one default", async () => {
    const { client } = await signedUpCustomer(app, "addr");
    const a1 = await addAddress(client);
    const a2 = await addAddress(client, {
      line1: "7 MG Road",
      city: "Mysuru",
      postalCode: "570001",
    });
    expect(a1).toEqual({
      id: expect.any(String),
      ...GOOD_ADDRESS,
      line2: undefined,
      isDefault: true,
    });
    expect(a1).not.toHaveProperty("line2");
    expect(a2.isDefault).toBe(false);

    await client.post(`/api/v1/addresses/${a2.id}/default`).expect(204);
    let list = (await client.get("/api/v1/addresses")).body;
    expect(list.map((a: { id: string }) => a.id)).toEqual([a2.id, a1.id]);
    expect(list.filter((a: { isDefault: boolean }) => a.isDefault)).toHaveLength(1);

    const updated = (
      await client
        .put(`/api/v1/addresses/${a1.id}`)
        .send({ ...GOOD_ADDRESS, city: "Bangalore", line2: "Near park" })
        .expect(200)
    ).body;
    expect(updated).toMatchObject({
      id: a1.id,
      city: "Bangalore",
      line2: "Near park",
      isDefault: false,
    });

    await client.delete(`/api/v1/addresses/${a2.id}`).expect(204);
    list = (await client.get("/api/v1/addresses")).body;
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id: a1.id, isDefault: true });
  });

  it("unknown and other customers' addresses are NOT_FOUND (no leaks, no changes)", async () => {
    const owner = await signedUpCustomer(app, "owner");
    const other = await signedUpCustomer(app, "other");
    const mine = await addAddress(owner.client);
    for (const client of [owner.client, other.client]) {
      await client.put("/api/v1/addresses/nope").send(GOOD_ADDRESS).expect(404);
      await client.delete("/api/v1/addresses/nope").expect(404);
    }
    const res = await other.client
      .put(`/api/v1/addresses/${mine.id}`)
      .send({ ...GOOD_ADDRESS, city: "Hacked" })
      .expect(404);
    expect(res.body.error).toMatchObject({
      code: "NOT_FOUND",
      message: "We couldn't find that address.",
    });
    await other.client.delete(`/api/v1/addresses/${mine.id}`).expect(404);
    await other.client.post(`/api/v1/addresses/${mine.id}/default`).expect(404);
    expect((await other.client.get("/api/v1/addresses")).body).toEqual([]);
    expect((await owner.client.get("/api/v1/addresses")).body).toEqual([mine]);
  });
});
