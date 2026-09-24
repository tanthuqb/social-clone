import { LoadingSpinner } from "@suzu/ui";

function LoadingSpinnerUI() {
    return (
        <div className="flex justify-center gap-2 py-4 pb-20 md:pb-0">
            <LoadingSpinner />
            <div className="text-[15px] font-semibold leading-6 text-slate-500">
                Hang on, there's plenty more below...
            </div>
        </div>
    );
}

export default LoadingSpinnerUI;