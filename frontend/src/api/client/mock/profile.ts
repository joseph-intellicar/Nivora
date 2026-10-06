import { profileSchema } from "@nivora/shared/domain/validation";
import type { ProfileApi } from "@nivora/shared/contracts";
import { request } from "./latency";
import { readUsers, requireUser, toPublicUser } from "./session";
import { KEYS, write } from "./storage";
import { validate } from "@nivora/shared/validate";

export const mockProfile: ProfileApi = {
  get: () => request(() => toPublicUser(requireUser())),

  update: (input) =>
    request(() => {
      const user = requireUser();
      const { name, phone } = validate(profileSchema, input);
      // Email is the login identifier and stays read-only in Phase 1 (req §26).
      const updated = { ...user, name };
      if (phone) updated.phone = phone;
      else delete updated.phone;
      write(
        KEYS.users,
        readUsers().map((candidate) => (candidate.id === user.id ? updated : candidate)),
      );
      return toPublicUser(updated);
    }),
};
