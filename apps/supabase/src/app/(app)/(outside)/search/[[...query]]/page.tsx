import { Suspense } from "react";
import Loading from "@/app/(app)/(outside)/loading";
import MainFooter from "@/components/shared/footer/main-footer";
import { ResultSearch } from "@/components/search/result-search";
import { createClient } from "@/lib/supabase/server";
import { fetchSearchDataAction } from "@/lib/actions/user/actions";
import { HeaderSectionSearch } from "@/components/shared/header/global/header-section-search";

const INITIAL_NUMBER_OF_USERSEARCH = 5;
// const NUMBER_OF_FEEDS_TO_USERSEARCH = 5

const fetchUserData = async (id: Profile["id"] | undefined) => {
  if (!id) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
};

const SearchPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search?.toString().trim();
  const searchData = await fetchSearchDataAction(
    search ?? "",
    0,
    INITIAL_NUMBER_OF_USERSEARCH,
  );
  const profile = await fetchUserData(session?.user?.id);
  return (
    <Suspense fallback={<Loading />}>
      <HeaderSectionSearch
        text={search ?? ""}
        session={session}
        profile={profile as Profile}
        searchData={searchData}
      />
      <ResultSearch
        searchData={searchData}
        profile={profile as Profile}
        searchParams={search ?? ""}
        session={session}
      />
      <MainFooter />
    </Suspense>
  );
};

export default SearchPage;
