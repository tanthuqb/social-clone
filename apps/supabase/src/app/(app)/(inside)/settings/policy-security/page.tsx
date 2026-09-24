import { redirect } from "next/navigation";

// The former "Policy & security" placeholder now lives at /settings/privacy.
export default function PolicySecurity() {
  redirect("/settings/privacy");
}
