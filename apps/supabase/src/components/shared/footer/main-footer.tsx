import { createClient } from "@/lib/supabase/server";
import {NavbarMobile} from "../navbar/navmobile";

export default async function  MainFooter() {
  const supabase = createClient();
  const { data: user, error } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.user?.id as string)
    .single();
  let notifications = null;
  if (user?.user?.id) {
    const { count: totalCount, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("status", false)
      .eq("user_noti_id", user?.user?.id)
      .neq("user_id", user?.user?.id);
    if (totalCount) notifications = totalCount;
  }
  return <NavbarMobile
      user={user}
      notifications={notifications!}
      profile={profile}
  />;
}
