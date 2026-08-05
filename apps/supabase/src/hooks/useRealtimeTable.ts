"use client";

import { useEffect, useRef } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

// The browser Supabase client is shared and supabase.channel() returns the SAME
// channel object for an existing topic; calling .on() after subscribe() throws.
// removeChannel() is also async, so a topic can linger after cleanup. A fresh
// suffix per effect run guarantees every subscription gets its own channel.
let channelSeq = 0;

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
      .channel(`rt_${table}_${filter ?? "all"}_${++channelSeq}`)
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
