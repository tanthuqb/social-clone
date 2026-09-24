"use client";

import { Button, cn, toast } from "@suzu/ui";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { unblockUserAction } from "@/lib/actions/moderation/actions";

export function UnblockButton({
  userId,
  name,
  className,
}: {
  userId: string;
  name: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const unblock = () =>
    startTransition(async () => {
      const { error } = await unblockUserAction(userId);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success(`${name} unblocked`);
      router.refresh();
    });

  return (
    <Button
      size="sm"
      variant="ghost"
      className={cn("rounded-full border border-slate-300", className)}
      onClick={unblock}
      disabled={pending}
    >
      Unblock
    </Button>
  );
}
