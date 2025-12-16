"use client";
import { BaseCommonIHL } from "../master-layout";
import { BaseText } from "../master-layout/base-text";
import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@suzu/ui";
import { getFeaturedUserAction } from "@/lib/actions/user/actions";
import { ListUserSuggestSidebar } from "./list-user-suggest-sidebar";

type ContentDrawerProps = {
  profile: Profile | null;
  user: Session;
};

const ContentDrawer = React.forwardRef<HTMLDivElement, ContentDrawerProps>(
  ({ profile, user }, ref) => {
    const supbase = createClient();
    const inputRef = (ref = useRef(null));
    const [valueInput, setValueInput] = useState<string>("");
    const [searchUser, setSearchUser] = useState<UserFeatured[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (value: string) => {
      setValueInput(value);
    };

    const handleDelete = () => {
      setValueInput("");
    };

    useEffect(() => {
      const fetchData = async () => {
        if (valueInput === "") {
          const userFeatured = await getFeaturedUserAction(profile?.id!, 0, 20);
          if (userFeatured) {
            setSearchUser(userFeatured);
            setIsLoading(true);
          }
        } else {
          const supabase = createClient();
          const { data, error } = await supbase
            .from("profiles")
            .select("*")
            .textSearch("display_name", valueInput, {
              type: "websearch",
              config: "english",
            });
          if (data?.length === 0) {
            setIsLoading(true);
          }
          await Promise.all(
            data!.map(async (user: UserFeatured) => {
              const { count } = await supabase
                .from("user_follows")
                .select("*", { count: "exact" })
                .eq("following_id", user.id);
              const { data: rows } = await supabase
                .from("user_follows")
                .select("*")
                .eq("user_id", profile?.id)
                .eq("following_id", user?.id)
                .maybeSingle();
              user.countFollowing = count!;
              user.user_follower = rows;
            }),
          );
          if (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
          }
          setSearchUser(data!);
        }
      };
      fetchData();
    }, [valueInput]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        window.location.href = `/search?search=${valueInput}`;
      }
    };

    return (
      <div className="flex h-full w-full flex-col items-start pb-10 sm:pb-0">
        <div className="border-b-trans-black-10 border-l-trans-black-10 flex w-full flex-col items-start gap-2 border-b-[1px] border-l-[1px] px-4 pb-4 pt-5 sm:ml-[82px] sm:max-w-[390px]">
          {/* Header */}
          <div className="hidden h-10 justify-center sm:flex">
            <div className="flex flex-col items-start justify-center gap-2.5">
              <BaseText
                text={"Tìm kiếm"}
                textColor="neutral-700"
                className="sz-text-h5-semi"
              />
            </div>
          </div>

          {/* Form input search */}
          {/* <form onSubmit={handleSubmit} className="flex items-start w-full"> */}
          <div className="w-full rounded-[8px] border bg-white">
            <BaseCommonIHL
              srcLeft={"/assets/icons-24/search.png"}
              placeholder={"Tìm kiếm tại đây"}
              onChange={(e) => handleChange(e.target.value as string)}
              srcRight={valueInput !== "" ? "/assets/icons-24/cancel.png" : ""}
              onClick={handleDelete}
              valueInput={valueInput}
              inputRef={inputRef}
              handleKeyDown={handleKeyDown}
            />
          </div>
          {/* </form> */}
        </div>

        {/* List User Suggest */}
        <ListUserSuggestSidebar
          searchUser={searchUser!}
          profile={profile}
          session={user!}
          isLoading={isLoading}
        />
      </div>
    );
  },
);

export { ContentDrawer };
