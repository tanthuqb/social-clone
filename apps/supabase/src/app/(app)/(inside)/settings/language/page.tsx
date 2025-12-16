import Language from "@/components/settings/language";
import { HeaderCommonSettings } from "@/components/shared/header/local/header-common-settings";

function Home() {
  return (
    <div className="flex h-dvh flex-col">
      <HeaderCommonSettings text="Ngôn ngữ" />
      <div className="h-[calc(100dvh_-_60px)] rounded-none bg-neutral-50 py-4 shadow-[0px_1px_2px_0px_#1018280F,_0px_1px_3px_0px_#1018281A] sm:h-[calc(100dvh_-_80px)] sm:rounded-3xl">
        <Language />
      </div>
    </div>
  );
}

export default Home;
