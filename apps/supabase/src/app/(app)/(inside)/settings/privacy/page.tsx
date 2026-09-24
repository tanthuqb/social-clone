import { redirect } from "next/navigation";
import PrivacySettingsForm from "@/components/settings/privacy-settings";
import { HeaderCommonSettings } from "@/components/shared/header/local/header-common-settings";
import { getPrivacySettings } from "@/lib/api/moderation/queries";
import { createClient } from "@/lib/supabase/server";

export default async function PrivacyPage() {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) redirect("/");

  const { available, settings } = await getPrivacySettings(session.user.id);

  return (
    <div className="flex h-dvh flex-col">
      <HeaderCommonSettings text="Privacy" />
      <div className="shadow-common-sm h-[calc(100dvh-60px)] overflow-y-auto rounded-none bg-neutral-50 py-4 sm:h-[calc(100dvh-80px)] sm:rounded-3xl">
        <h1 className="sr-only">Privacy</h1>
        <PrivacySettingsForm initial={settings} available={available} />
      </div>
    </div>
  );
}
