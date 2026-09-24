"use client";

import { Button, Label, RadioGroup, RadioGroupItem, toast } from "@suzu/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { updatePrivacySettingsAction } from "@/lib/actions/privacy/actions";
import {
  COMMENT_PERMISSION_OPTIONS,
  POST_PRIVACY_OPTIONS,
  PROFILE_VISIBILITY_OPTIONS,
} from "@/lib/moderation";
import type { PrivacySettings } from "@/lib/api/moderation/queries";
import { FEATURE_UNAVAILABLE } from "@/lib/supabase/schema-errors";

type Option = { value: string; label: string; description?: string };

function OptionGroup({
  title,
  options,
  value,
  onChange,
  disabled,
}: {
  title: string;
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const id = useId();
  return (
    <fieldset className="flex flex-col gap-3 rounded-2xl bg-white p-4" disabled={disabled}>
      <legend id={`${id}-title`} className="sr-only">
        {title}
      </legend>
      <div aria-hidden className="text-[15px] font-semibold text-slate-900">
        {title}
      </div>
      <RadioGroup
        aria-labelledby={`${id}-title`}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className="gap-3"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start gap-3">
            <RadioGroupItem value={option.value} id={`${id}-${option.value}`} className="mt-1" />
            <Label htmlFor={`${id}-${option.value}`} className="flex flex-col gap-0.5">
              <span className="text-[15px] font-normal text-slate-900">{option.label}</span>
              {option.description && (
                <span className="text-[13px] font-normal text-slate-500">
                  {option.description}
                </span>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

export default function PrivacySettingsForm({
  initial,
  available,
}: {
  initial: PrivacySettings;
  available: boolean;
}) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [pending, startTransition] = useTransition();

  const set = (key: keyof PrivacySettings) => (value: string) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const { error } = await updatePrivacySettingsAction(settings);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Privacy settings saved");
      router.refresh();
    });
  };

  return (
    <form onSubmit={save} className="flex flex-col gap-4 px-4" data-testid="privacy-settings">
      {!available && (
        <div
          className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[15px] text-amber-900"
          data-testid="privacy-unavailable"
        >
          {FEATURE_UNAVAILABLE}
        </div>
      )}
      <OptionGroup
        title="Default audience for new posts"
        options={POST_PRIVACY_OPTIONS}
        value={settings.default_post_privacy}
        onChange={set("default_post_privacy")}
        disabled={!available}
      />
      <OptionGroup
        title="Who can see your posts"
        options={PROFILE_VISIBILITY_OPTIONS}
        value={settings.profile_visibility}
        onChange={set("profile_visibility")}
        disabled={!available}
      />
      <OptionGroup
        title="Who can comment on your posts"
        options={COMMENT_PERMISSION_OPTIONS}
        value={settings.comment_permission}
        onChange={set("comment_permission")}
        disabled={!available}
      />
      <Link
        href="/settings/blocked-users"
        className="rounded-2xl bg-white p-4 text-[15px] font-semibold text-slate-900 hover:bg-slate-50"
      >
        Blocked users
      </Link>
      <div className="flex justify-end">
        <Button type="submit" className="rounded-full" disabled={!available || pending}>
          Save
        </Button>
      </div>
    </form>
  );
}
