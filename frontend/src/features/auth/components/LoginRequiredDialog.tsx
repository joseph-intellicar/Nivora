"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { paths } from "@/config/routes";
import { useLoginPromptStore } from "@/stores/loginPromptStore";
import { intentReason, intentReturnPath } from "../intent";

/** "Login required" prompt for guests (requirements §6.1). Mounted once in Providers. */
export function LoginRequiredDialog() {
  const { isOpen, intent, cancel, proceed } = useLoginPromptStore();
  const router = useRouter();
  if (!intent) return null;

  const goTo = (pathFor: (from: string) => string) => {
    proceed();
    router.push(pathFor(intentReturnPath(intent)));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={cancel}
      size="sm"
      title="Login required"
      description={intentReason(intent)}
      footer={
        <>
          <Button variant="secondary" onClick={cancel}>
            Cancel
          </Button>
          <Button onClick={() => goTo((from) => paths.login(from))} data-autofocus>
            Login
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-muted">
        New to Nivora?{" "}
        <button
          type="button"
          onClick={() => goTo((from) => paths.signup(from))}
          className="font-semibold text-brand-700 hover:underline"
        >
          Create an account
        </button>
      </p>
    </Dialog>
  );
}
