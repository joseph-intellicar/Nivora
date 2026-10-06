"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { isApiError } from "@nivora/shared/errors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { paths } from "@/config/routes";
import type { SignupInput } from "@nivora/shared/domain/types";
import { PASSWORD_RULE_MESSAGE, signupSchema } from "@nivora/shared/domain/validation";
import { getErrorMessage } from "@nivora/shared/errorMessages";
import { useSignup } from "../hooks/useAuthMutations";
import { useFromParam } from "../useFromParam";
import { AuthCard } from "./AuthCard";
import { FormAlert } from "./FormAlert";
import { GuestOnly } from "./GuestOnly";

/** Signup page body (requirements §7.3). */
export function SignupView() {
  const from = useFromParam();
  return (
    <GuestOnly from={from} title="Create your Nivora account">
      <AuthCard
        title="Create your Nivora account"
        subtitle="Sign up to check out faster, save a wishlist and track your orders."
      >
        <SignupForm from={from} />
      </AuthCard>
    </GuestOnly>
  );
}

const FIELDS = ["name", "email", "password", "confirmPassword"] as const;

function SignupForm({ from }: { from: string | null }) {
  const signup = useSignup(from);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  // Data-layer field errors (e.g. "email already exists") go back onto the form fields.
  useEffect(() => {
    const error = signup.error;
    if (!isApiError(error) || !error.details.fields) return;
    for (const field of FIELDS) {
      const message = error.details.fields[field];
      if (message) setError(field, { message }, { shouldFocus: true });
    }
  }, [signup.error, setError]);

  const fieldError = isApiError(signup.error) && signup.error.details.fields;
  const formError = signup.error && !fieldError ? getErrorMessage(signup.error) : null;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => signup.mutate(values))}
      className="flex flex-col gap-4"
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
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        hint={PASSWORD_RULE_MESSAGE}
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        required
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" size="lg" fullWidth loading={signup.isPending || signup.isSuccess}>
        Signup
      </Button>
      <p className="text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link
          href={paths.login(from ?? undefined)}
          className="font-semibold text-brand-700 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
