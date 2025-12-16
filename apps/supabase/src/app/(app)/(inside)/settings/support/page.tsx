import Support from "@/components/settings/support";
import { HeaderCommonSettings } from "@/components/shared/header/local/header-common-settings";

function Home() {
  return (
    <div className="flex h-dvh flex-col">
      <HeaderCommonSettings text="Hỗ trợ" />
      <div className="h-[calc(100dvh_-_68px)] sm:h-[calc(100dvh_-_80px)]">
        <div className="shadow-common-sm h-full overflow-hidden rounded-none bg-neutral-50 py-4 sm:rounded-3xl">
          <Support />
        </div>
      </div>
    </div>
  );
}

export default Home;
