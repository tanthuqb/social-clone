"use client";
import { useRouter } from "next/navigation";
import { UserACtion } from "@/modules/user/user.action";

export default async function SignIn() {
  const { SignOut, FormSignIWithOAuth, GetUser, user } = UserACtion();
  await GetUser();

  if (user) {
    return (
      <div className="space-y-3">
        <p>
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
        <button
          onClick={SignOut}
          className="rounded-md bg-red-500 px-3.5 py-2.5 text-sm text-white hover:opacity-80"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p>Not signed in </p>
      <button
        onClick={() => FormSignIWithOAuth("google")}
        className="rounded-md bg-neutral-900 px-3.5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Sign in
      </button>
    </div>
  );
}
