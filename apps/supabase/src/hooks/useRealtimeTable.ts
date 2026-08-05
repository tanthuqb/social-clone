"use client";

import { useEffect, useRef } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function useRealtimeTable({
  table,
  filter,
  event = "*",
  onChange,
}: {
  table:
    | "feeds"
    | "comments"
    | "feed_engagement"
    | "comment_engagement"
    | "notifications"
    | "feed_collections"
    | "user_follows";
  filter?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  onChange: (
    payload: RealtimePostgresChangesPayload<Record<string, any>>,
  ) => void;
}) {
  // Keep the latest callback without resubscribing the channel on every render.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`rt_${table}_${filter ?? "all"}`)
      .on(
        "postgres_changes",
        { event: event as any, schema: "public", table, ...(filter ? { filter } : {}) },
        (payload) => onChangeRef.current(payload),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, event]);
}
