"use client";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@suzu/ui";

import { useContext, useEffect } from "react";
import { ModalContext } from "@/components/modals/provider";
import { useRouter } from "next/navigation";
import { UserACtion } from "@/modules/user/user.action";

export default function withAuth(Component: React.ComponentType) {
  return async (props: any) => {
    const router = useRouter();
    const { setType, setParentFeedId } = useContext(ModalContext);
    const { user, GetUser, setShowLoginModal } = UserACtion();
    await GetUser();
    useEffect(() => {
      if (!user) {
        router.push("/");
        toast.error("You need to be signed in to view this page");
        setShowLoginModal(true);
        setType(false);
        setParentFeedId(undefined);
      }
    }, [user]);

    return <Component {...props} />;
  };
}
