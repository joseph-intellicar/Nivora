import type { Address } from "@/domain/types";
import { addressSchema } from "@/domain/validation";
import { createId } from "@/lib/ids";
import type { AddressApi } from "../../contracts";
import { ApiError } from "../../errors";
import { request } from "./latency";
import type { AddressRecord } from "./records";
import { requireUser } from "./session";
import { isRecord, KEYS, read, write } from "./storage";
import { validate } from "./validate";

export function readAddresses(userId: string): Address[] {
  const list = read<AddressRecord>(KEYS.addresses, {}, isRecord)[userId];
  return Array.isArray(list) ? list : [];
}

function writeAddresses(userId: string, list: Address[]): void {
  const record = read<AddressRecord>(KEYS.addresses, {}, isRecord);
  record[userId] = list;
  write(KEYS.addresses, record);
}

/** Exactly one default whenever any address exists (requirements §21). */
function withDefault(list: Address[]): Address[] {
  if (list.length === 0 || list.some((address) => address.isDefault)) return list;
  return list.map((address, index) => ({ ...address, isDefault: index === 0 }));
}

function find(list: Address[], id: string): Address {
  const address = list.find((item) => item.id === id);
  if (!address) throw new ApiError("NOT_FOUND", { entity: "address" });
  return address;
}

const defaultFirst = (list: Address[]) =>
  [...list].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));

export const mockAddresses: AddressApi = {
  list: () => request(() => defaultFirst(readAddresses(requireUser().id))),

  create: (input) =>
    request(() => {
      const user = requireUser();
      const data = validate(addressSchema, input, "INVALID_ADDRESS");
      const list = readAddresses(user.id);
      const address: Address = { id: createId("addr"), ...data, isDefault: list.length === 0 };
      writeAddresses(user.id, [...list, address]);
      return address;
    }),

  update: (id, input) =>
    request(() => {
      const user = requireUser();
      const data = validate(addressSchema, input, "INVALID_ADDRESS");
      const list = readAddresses(user.id);
      const existing = find(list, id);
      const updated: Address = { id, ...data, isDefault: existing.isDefault };
      writeAddresses(
        user.id,
        list.map((address) => (address.id === id ? updated : address)),
      );
      return updated;
    }),

  remove: (id) =>
    request(() => {
      const user = requireUser();
      const list = readAddresses(user.id);
      find(list, id);
      // Past orders keep their own address snapshot, so deleting is always safe (req §21).
      writeAddresses(user.id, withDefault(list.filter((address) => address.id !== id)));
    }),

  setDefault: (id) =>
    request(() => {
      const user = requireUser();
      const list = readAddresses(user.id);
      find(list, id);
      writeAddresses(
        user.id,
        list.map((address) => ({ ...address, isDefault: address.id === id })),
      );
    }),
};
