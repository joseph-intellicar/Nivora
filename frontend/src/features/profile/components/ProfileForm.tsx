"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { api, queryKeys } from "@/api/client";
import { isApiError } from "@nivora/shared/errors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ProfileInput } from "@nivora/shared/domain/types";
import { profileSchema } from "@nivora/shared/domain/validation";
import { FormAlert } from "@/features/auth/components/FormAlert";
import { useSession } from "@/features/auth/hooks/useSession";
import { getErrorMessage } from "@nivora/shared/errorMessages";
import { toast } from "@/stores/toastStore";

type FormValues = z.input<typeof profileSchema>;

/** Profile (requirements §26): name and phone are editable; email is the login id and read-only. */
export function ProfileForm() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: (input: ProfileInput) => api.profile.update(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.session(), updated);
      toast.success("Profile saved.");
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<FormValues, unknown, ProfileInput>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  useEffect(() => {
    const fields = isApiError(update.error) ? update.error.details.fields : undefined;
    if (fields?.name) setError("name", { message: fields.name });
    if (fields?.phone) setError("phone", { message: fields.phone });
  }, [update.error, setError]);

  if (!user) return null;
  const formError =
    update.error && !(isApiError(update.error) && update.error.details.fields)
      ? getErrorMessage(update.error)
      : null;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((input) =>
        update.mutate(input, { onSuccess: (u) => reset({ name: u.name, phone: u.phone ?? "" }) }),
      )}
      className="flex max-w-xl flex-col gap-4 rounded-card bg-surface p-5 shadow-card ring-1 ring-line sm:p-6"
    >
      {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}
      <Input
        label="Name"
        autoComplete="name"
        required
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Email"
        type="email"
        value={user.email}
        readOnly
        aria-readonly="true"
        hint="Your email is your login and can't be changed."
      />
      <Input
        label="Phone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        hint="Optional · 10-digit mobile number"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Button type="submit" className="self-start" loading={update.isPending} disabled={!isDirty}>
        Save Changes
      </Button>
    </form>
  );
}
