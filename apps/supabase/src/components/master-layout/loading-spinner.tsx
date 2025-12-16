import { LoadingSpinner } from "@suzu/ui";

function LoadingSpinnerUI() {
    return (
        <div className="flex justify-center gap-2 py-4 pb-20 md:pb-0">
            <LoadingSpinner />
            <div className="text-[15px] font-semibold leading-6 text-slate-500">
                Chờ tí nhé, bên dưới còn nhiều lắm...
            </div>
        </div>
    );
}

export default LoadingSpinnerUI;