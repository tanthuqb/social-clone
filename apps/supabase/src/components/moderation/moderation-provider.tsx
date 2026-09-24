"use client";

import {
  Button,
  Label,
  Modal,
  RadioGroup,
  RadioGroupItem,
  Textarea,
  toast,
} from "@suzu/ui";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
} from "react";
import { blockUserAction, reportAction } from "@/lib/actions/moderation/actions";
import {
  REPORT_DETAILS_MAX,
  REPORT_REASONS,
  USER_BLOCKED_EVENT,
  type ReportTarget,
} from "@/lib/moderation";

type ReportRequest = { target: ReportTarget; targetId: string };
type BlockRequest = { userId: string; name: string };

const ModerationContext = createContext<{
  openReport: (request: ReportRequest) => void;
  openBlock: (request: BlockRequest) => void;
}>({
  openReport: () => {},
  openBlock: () => {},
});

export const useModeration = () => useContext(ModerationContext);

const TARGET_NOUN: Record<ReportTarget, string> = {
  post: "post",
  comment: "comment",
  user: "user",
};

function ReportForm({ request, onDone }: { request: ReportRequest; onDone: () => void }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [pending, startTransition] = useTransition();
  const noun = TARGET_NOUN[request.target];
  const reasons = REPORT_REASONS.filter(
    (option) => !("userOnly" in option) || request.target === "user",
  );

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!reason) return;
    startTransition(async () => {
      const { error } = await reportAction({
        target: request.target,
        targetId: request.targetId,
        reason,
        details: details.trim() || undefined,
      });
      if (error) {
        toast.error(error);
      } else {
        toast.success("Thanks for reporting. We'll review it.");
      }
      onDone();
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" data-testid="report-form">
      <div className="flex flex-col gap-1">
        <div className="text-[18px] font-semibold text-slate-900">Report {noun}</div>
        <div className="text-[15px] text-slate-500">Why are you reporting this {noun}?</div>
      </div>
      <RadioGroup
        aria-label="Reason"
        value={reason}
        onValueChange={setReason}
        className="gap-3"
      >
        {reasons.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem value={option.value} id={`report-reason-${option.value}`} />
            <Label htmlFor={`report-reason-${option.value}`} className="text-[15px] font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <Textarea
        placeholder="Add details (optional)"
        maxLength={REPORT_DETAILS_MAX}
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        className="min-h-[88px]"
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" className="rounded-full border" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" className="rounded-full" disabled={!reason || pending}>
          Submit report
        </Button>
      </div>
    </form>
  );
}

function BlockForm({ request, onDone }: { request: BlockRequest; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const block = () => {
    startTransition(async () => {
      const { error } = await blockUserAction(request.userId);
      if (error) {
        toast.error(error);
        onDone();
        return;
      }
      toast.success(`${request.name} blocked`);
      window.dispatchEvent(
        new CustomEvent(USER_BLOCKED_EVENT, { detail: { userId: request.userId } }),
      );
      onDone();
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-2.5" data-testid="block-form">
      <div className="text-[18px] font-semibold text-slate-900">Block {request.name}?</div>
      <div className="text-[15px] text-slate-700">
        You won&apos;t see each other&apos;s posts or comments, and they can&apos;t follow you,
        comment on or react to your posts. Blocking also removes follows between you.
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" className="rounded-full border" onClick={onDone}>
          Cancel
        </Button>
        <Button className="rounded-full" onClick={block} disabled={pending}>
          Block
        </Button>
      </div>
    </div>
  );
}

/** Report and block dialogs, opened from post/comment/profile menus. */
export function ModerationProvider({ children }: { children: ReactNode }) {
  const [report, setReport] = useState<ReportRequest | null>(null);
  const [block, setBlock] = useState<BlockRequest | null>(null);

  const openReport = useCallback((request: ReportRequest) => setReport(request), []);
  const openBlock = useCallback((request: BlockRequest) => setBlock(request), []);
  const value = useMemo(() => ({ openReport, openBlock }), [openReport, openBlock]);

  const closeReport = () => setReport(null);
  const closeBlock = () => setBlock(null);

  return (
    <ModerationContext.Provider value={value}>
      {report && (
        <Modal showModal setShowModal={closeReport}>
          <div className="relative z-10 w-full overflow-hidden bg-white p-4 sm:rounded-2xl sm:shadow-xl">
            {/* key: reset the form for every new target */}
            <ReportForm key={report.targetId} request={report} onDone={closeReport} />
          </div>
        </Modal>
      )}
      {block && (
        <Modal showModal setShowModal={closeBlock}>
          <div className="relative z-10 w-full overflow-hidden bg-white p-4 sm:rounded-2xl sm:shadow-xl">
            <BlockForm key={block.userId} request={block} onDone={closeBlock} />
          </div>
        </Modal>
      )}
      {children}
    </ModerationContext.Provider>
  );
}
