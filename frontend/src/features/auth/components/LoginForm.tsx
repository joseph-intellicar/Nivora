"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { isApiError } from "@nivora/shared/errors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { paths } from "@/config/routes";
import type { LoginInput } from "@nivora/shared/domain/types";
import { loginSchema } from "@nivora/shared/domain/validation";
import { getErrorMessage } from "@nivora/shared/errorMessages";
import { useLogin } from "../hooks/useAuthMutations";
import { useFromParam } from "../useFromParam";
import { AuthCard } from "./AuthCard";
import { FormAlert } from "./FormAlert";
import { GuestOnly } from "./GuestOnly";

/** Login page body (requirements §7.2). */
export function LoginView() {
  const from = useFromParam();
  return (
    <GuestOnly from={from} title="Login to Nivora">
      <AuthCard
        title="Login to Nivora"
        subtitle="Welcome back! Log in to shop, track orders and use your wishlist."
      >
        <LoginForm from={from} />
      </AuthCard>
    </GuestOnly>
  );
}

function LoginForm({ from }: { from: string | null }) {
  const login = useLogin(from);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const formError = login.error
    ? isApiError(login.error) && login.error.code === "INVALID_CREDENTIALS"
      ? "Incorrect email or password."
      : getErrorMessage(login.error)
    : null;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => login.mutate(values))}
      className="flex flex-col gap-4"
    >
      {from && !formError ? <FormAlert tone="info">Please log in to continue.</FormAlert> : null}
      {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}
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
        autoComplete="current-password"
        required
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" size="lg" fullWidth loading={login.isPending || login.isSuccess}>
        Login
      </Button>
      <p className="text-center text-sm text-ink-muted">
        New to Nivora?{" "}
        <Link
          href={paths.signup(from ?? undefined)}
          className="font-semibold text-brand-700 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
