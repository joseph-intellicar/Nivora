"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { isApiError } from "@/api/errors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { INDIAN_STATES } from "@/config/indianStates";
import type { Address, AddressInput } from "@/domain/types";
import { addressSchema } from "@/domain/validation";
import { FormAlert } from "@/features/auth/components/FormAlert";
import { getErrorMessage } from "@/lib/errorMessages";
import { useSaveAddress } from "../hooks/useAddresses";

type FormValues = z.input<typeof addressSchema>;
const FIELDS = ["fullName", "phone", "line1", "line2", "city", "state", "postalCode"] as const;

const emptyValues = (address?: Address): FormValues => ({
  fullName: address?.fullName ?? "",
  phone: address?.phone ?? "",
  line1: address?.line1 ?? "",
  line2: address?.line2 ?? "",
  city: address?.city ?? "",
  state: (address?.state ?? "") as FormValues["state"],
  postalCode: address?.postalCode ?? "",
  country: "India",
});

/** Add / edit address (requirements §21): all fields validated per the shared schema. */
export function AddressForm({
  address,
  onSaved,
  onCancel,
  submitLabel = "Save Address",
}: {
  address?: Address;
  onSaved: (address: Address) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const save = useSaveAddress();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues, unknown, AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyValues(address),
  });

  // Field errors from the data layer go back onto the fields.
  useEffect(() => {
    const fields = isApiError(save.error) ? save.error.details.fields : undefined;
    if (!fields) return;
    for (const field of FIELDS)
      if (fields[field]) setError(field, { message: fields[field] }, { shouldFocus: true });
  }, [save.error, setError]);

  const formError =
    save.error && !(isApiError(save.error) && save.error.details.fields)
      ? getErrorMessage(save.error)
      : null;

  return (
    <form
      noValidate
      aria-label={address ? "Edit address" : "Add a new address"}
      onSubmit={handleSubmit((input) =>
        save.mutate({ id: address?.id, input }, { onSuccess: onSaved }),
      )}
      className="flex flex-col gap-4"
    >
      {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full Name"
          autoComplete="name"
          required
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label="Phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          required
          hint="10-digit mobile number"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>
      <Input
        label="Address Line 1"
        autoComplete="address-line1"
        required
        hint="House number, building, street"
        error={errors.line1?.message}
        {...register("line1")}
      />
      <Input
        label="Address Line 2"
        autoComplete="address-line2"
        hint="Area, landmark (optional)"
        error={errors.line2?.message}
        {...register("line2")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="City"
          autoComplete="address-level2"
          required
          error={errors.city?.message}
          {...register("city")}
        />
        <Select
          label="State"
          autoComplete="address-level1"
          required
          error={errors.state?.message}
          {...register("state")}
        >
          <option value="" disabled>
            Select a state
          </option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Postal Code"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          required
          hint="6-digit PIN code"
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
        <Input
          label="Country"
          value="India"
          readOnly
          hint="Nivora delivers within India"
          {...register("country")}
        />
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" loading={save.isPending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
