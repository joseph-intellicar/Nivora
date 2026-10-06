import type { INestApplication } from "@nestjs/common";
import type { Address } from "@nivora/shared/domain/types";
import { browser, uniqueEmail } from "./http-client.js";

export const GOOD_ADDRESS = {
  fullName: "Joseph",
  phone: "9876543210",
  line1: "42, 3rd Cross",
  line2: "",
  city: "Bengaluru",
  state: "Karnataka",
  postalCode: "560038",
  country: "India",
};

/** A new logged-in customer (cookie jar). */
export async function signedUpCustomer(app: INestApplication, prefix = "customer") {
  const client = browser(app);
  const email = uniqueEmail(prefix);
  const res = await client
    .post("/api/v1/auth/signup")
    .send({ name: "Test Customer", email, password: "password123", confirmPassword: "password123" })
    .expect(201);
  return { client, email, userId: res.body.user.id as string };
}

export async function addAddress(
  client: ReturnType<typeof browser>,
  over: Partial<typeof GOOD_ADDRESS> = {},
): Promise<Address> {
  return (
    await client
      .post("/api/v1/addresses")
      .send({ ...GOOD_ADDRESS, ...over })
      .expect(201)
  ).body;
}
