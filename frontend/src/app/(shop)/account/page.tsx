import type { Metadata } from "next";
import { ProfileForm } from "@/features/profile/components/ProfileForm";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <>
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-ink">Profile</h1>
      <ProfileForm />
    </>
  );
}
