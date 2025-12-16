export default function Loading() {
  return (
    <div
      className="my-12 w-full animate-pulse place-items-center"
      role="status"
    >
      <div className="flex justify-between">
        <div className="grow-1 relative">
          <div className="flex items-center space-x-2">
            <div className="h-12 w-12 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-slate-200"></div>
            <div className="flex flex-col space-y-2">
              <div className="h-3 w-24 rounded bg-slate-200"></div>
              <div className="h-2 w-16 rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <div className="h-2 w-24 rounded bg-slate-200"></div>
          <div className="h-1 w-6 rounded-full bg-slate-200"></div>
        </div>
      </div>
      <div className="mt-4">
        <div className="space-y-2 whitespace-pre-line">
          <div className="h-2 w-full rounded bg-slate-200"></div>
          <div className="h-2 w-3/4 rounded bg-slate-200"></div>
          <div className="h-2 w-3/4 rounded bg-slate-200"></div>
          <div className="h-2 w-1/2 rounded bg-slate-200"></div>
          <div className="h-2 w-1/2 rounded bg-slate-200"></div>
          <div className="h-2 w-1/2 rounded bg-slate-200"></div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center space-x-3">
          <div className="flex gap-0.5">
            <div className="h-6 w-12 rounded-l-full bg-slate-200"></div>
            <div className="h-6 w-6 rounded-r-full bg-slate-200"></div>
          </div>
          <div className="h-6 w-12 rounded-full bg-slate-200"></div>
          <div className="h-6 w-12 rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}
