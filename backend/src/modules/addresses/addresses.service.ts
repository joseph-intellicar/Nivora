import { Injectable } from "@nestjs/common";
import type { Address, AddressInput } from "@nivora/shared/domain/types";
import { ApiError } from "@nivora/shared/errors";
import { PrismaService } from "../../prisma/prisma.service.js";

type AddressRow = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export function toAddress(row: AddressRow): Address {
  return {
    id: row.id,
    fullName: row.fullName,
    phone: row.phone,
    line1: row.line1,
    ...(row.line2 ? { line2: row.line2 } : {}),
    city: row.city,
    state: row.state,
    postalCode: row.postalCode,
    country: "India",
    isDefault: row.isDefault,
  };
}

const TX = { timeout: 20_000, maxWait: 10_000 };

/** Address book (req §21): exactly one default whenever any address exists, listed first. */
@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<Address[]> {
    const rows = await this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
    return [...rows].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)).map(toAddress);
  }

  /** The customer's own address, or NOT_FOUND (another customer's address looks missing). */
  async findOwn(userId: string, id: string): Promise<AddressRow> {
    const row = await this.prisma.address.findFirst({ where: { id, userId } });
    if (!row) throw new ApiError("NOT_FOUND", { entity: "address" });
    return row;
  }

  /** The first address becomes the default. */
  async create(userId: string, input: AddressInput): Promise<Address> {
    return this.prisma.$transaction(async (tx) => {
      const hasAny = (await tx.address.count({ where: { userId } })) > 0;
      const row = await tx.address.create({
        data: { userId, ...fields(input), isDefault: !hasAny },
      });
      return toAddress(row);
    }, TX);
  }

  async update(userId: string, id: string, input: AddressInput): Promise<Address> {
    await this.findOwn(userId, id);
    return toAddress(await this.prisma.address.update({ where: { id }, data: fields(input) }));
  }

  /** Past orders keep their own snapshot, so deleting is always safe; the default moves on. */
  async remove(userId: string, id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const row = await tx.address.findFirst({ where: { id, userId } });
      if (!row) throw new ApiError("NOT_FOUND", { entity: "address" });
      await tx.address.delete({ where: { id } });
      if (row.isDefault) {
        const next = await tx.address.findFirst({
          where: { userId },
          orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        });
        if (next) await tx.address.update({ where: { id: next.id }, data: { isDefault: true } });
      }
    }, TX);
  }

  async setDefault(userId: string, id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const row = await tx.address.findFirst({ where: { id, userId } });
      if (!row) throw new ApiError("NOT_FOUND", { entity: "address" });
      await tx.address.updateMany({
        where: { userId, isDefault: true, NOT: { id } },
        data: { isDefault: false },
      });
      await tx.address.update({ where: { id }, data: { isDefault: true } });
    }, TX);
  }
}

function fields(input: AddressInput) {
  return {
    fullName: input.fullName,
    phone: input.phone,
    line1: input.line1,
    line2: input.line2 ?? null,
    city: input.city,
    state: input.state,
    postalCode: input.postalCode,
    country: "India",
  };
}
