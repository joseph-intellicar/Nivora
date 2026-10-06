import type { INestApplication } from "@nestjs/common";
import { createTestApp } from "./app-factory.js";
import { browser, uniqueEmail } from "./http-client.js";

describe("profile (e2e, P2-020)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  async function customer() {
    const client = browser(app);
    const email = uniqueEmail("profile");
    await client
      .post("/api/v1/auth/signup")
      .send({ name: "Asha", email, password: "password123", confirmPassword: "password123" })
      .expect(201);
    return { client, email };
  }

  it("guests get 401 UNAUTHENTICATED", async () => {
    const guest = browser(app);
    expect((await guest.get("/api/v1/me").expect(401)).body.error.code).toBe("UNAUTHENTICATED");
    expect(
      (await guest.patch("/api/v1/me").send({ name: "X" }).expect(401)).body.error.message,
    ).toBe("Please log in to continue.");
  });

  it("reads the profile", async () => {
    const { client, email } = await customer();
    expect((await client.get("/api/v1/me").expect(200)).body).toEqual({
      id: expect.any(String),
      name: "Asha",
      email,
    });
  });

  it("updates name and phone, clears the phone, never changes the email", async () => {
    const { client, email } = await customer();
    const updated = await client
      .patch("/api/v1/me")
      .send({ name: "  Asha Rao ", phone: "9876543210", email: "hijack@example.com" })
      .expect(200);
    expect(updated.body).toEqual({
      id: expect.any(String),
      name: "Asha Rao",
      email,
      phone: "9876543210",
    });
    expect((await client.get("/api/v1/auth/session")).body.user).toEqual(updated.body);

    const cleared = await client
      .patch("/api/v1/me")
      .send({ name: "Asha Rao", phone: "" })
      .expect(200);
    expect(cleared.body).toEqual({ id: expect.any(String), name: "Asha Rao", email });
  });

  it("rejects an invalid phone and an empty name with req §28 messages (422)", async () => {
    const { client } = await customer();
    const res = await client.patch("/api/v1/me").send({ name: "", phone: "123" }).expect(422);
    expect(res.body.error.details.fields.phone).toBe(
      "Please enter a valid 10-digit mobile number.",
    );
    expect(res.body.error.details.fields).toHaveProperty("name");
    expect((await client.get("/api/v1/me")).body.name).toBe("Asha");
  });
});
