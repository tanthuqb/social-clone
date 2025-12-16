import { Suspense } from "react";
import Loading from "@/app/(app)/(outside)/loading";
import MainFooter from "@/components/shared/footer/main-footer";
import { ResultSearch } from "@/components/search/result-search";
import { createClient } from "@/lib/supabase/server";
import { fetchSearchDataAction } from "@/lib/actions/user/actions";
import { HeaderSectionSearch } from "@/components/shared/header/global/header-section-search";

const INITIAL_NUMBER_OF_USERSEARCH = 5;
// const NUMBER_OF_FEEDS_TO_USERSEARCH = 5

const fetchUserData = async (id: Profile["id"]) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/user?userId=${id}`,
    { cache: "no-cache" },
  );
  const data = await res.json();
  return data;
};

const SearchPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getUser();
  const search = searchParams?.search?.toString().trim();
  const searchData = await fetchSearchDataAction(
    search!,
    0,
    INITIAL_NUMBER_OF_USERSEARCH,
  );
  const profile = await fetchUserData(session?.user?.id!);
  return (
    <Suspense fallback={<Loading />}>
      <HeaderSectionSearch
        text={search!}
        session={session}
        profile={profile}
        searchData={searchData}
      />
      <ResultSearch
        searchData={searchData}
        profile={profile}
        searchParams={search!}
        session={session}
      />
      <MainFooter />
    </Suspense>
  );
};

export default SearchPage;
