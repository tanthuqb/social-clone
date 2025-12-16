
import { ContentDrawer } from "@/components/notifications/content-drawer";
import MainFooter from "@/components/shared/footer/main-footer";
import { createClient } from "@/lib/supabase/server";

export default async function Notifications() {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser();
  return (
    <div>
      <ContentDrawer user={session} />
      <MainFooter />
    </div>
  )
}
