"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@suzu/ui";
import { toast } from "@suzu/ui";
import { createClient } from "@/lib/supabase/client";

export default function UpdateUserUName({ username, session }: { username: string,session:Session }) {
  const supabase = createClient();
  const [suggest1, setSuggest1] = useState("@");
  const [suggest2, setSuggest2] = useState("@");
  const [suggest3, setSuggest3] = useState("@");
  const [suggest4, setSuggest4] = useState("@");
  useEffect(() => {
    async function getData(){
    const { data: search } = await supabase
      .from("profiles")
      .select("full_name")
      .ilike("full_name", `${username}%`)
      .neq("id", session?.user?.id)
      .order("full_name", { ascending: false });

    if (search && search.length > 0) {
      // Extract the maximum number from existing profile names
      let maxLength = 0;
      const existingNumbers = new Set();
      search.forEach((profile) => {
        const match = profile?.full_name?.match(
          new RegExp(`${username}(\\d+)$`),
        );
        if (match) {
          const number = parseInt(match[1]);
          existingNumbers.add(number);
          if (number > maxLength) {
            maxLength = number;
          }
        }
      });

      // Generate all numbers up to maxLength + 4 (to account for additional suggestions)
      const allNumbers = Array.from({ length: maxLength + 4 }, (_, i) => i + 1);
      const missingValues = allNumbers
        .filter((number) => !existingNumbers.has(number))
        .slice(0, 4);

      // Set suggestions based on missingValues
      for (let count = 0; count < missingValues.length; count++) {
        switch (count) {
          case 0:
            setSuggest1("@" + username + missingValues[count]);
            break;
          case 1:
            setSuggest2("@" + username + missingValues[count]);
            break;
          case 2:
            setSuggest3("@" + username + missingValues[count]);
            break;
          case 3:
            setSuggest4("@" + username + missingValues[count]);
            break;
        }
      }
    } else {
      setSuggest1("@" + username + "");
      setSuggest2("@" + username + "1");
      setSuggest3("@" + username + "2");
      setSuggest4("@" + username + "3");
    }
  }
  getData();
}, [username])

const [isPending, startTransition] = useTransition();
const [changeBg, setChangeBg] = useState(false)
const [newUserName, setUserNewName] = useState<string>("");
const handleSubmit = async (event: React.SyntheticEvent) => {
  event.preventDefault();
 
  // startTransition(async () => {
  //   const response = await fetch("/api/auth/username-exitsts", {
  //     method: "POST",
  //     body: JSON.stringify({ username: newUserName }),
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   const existingUser = await response.json();
  //   if (existingUser && existingUser.exists) {
  //     toast.error("Username already exists");
  //     return;
  //   }
  //   const res = await fetch("/api/account", {
  //     method: "PUT",
  //     body: JSON.stringify({ username: newUserName }),
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   if (res.status === 200) toast.success("Successfully updated user name!");
  //   router.refresh();
  //   setChangeBg(false)
  // });
};
const handleChange = (val: string) => {
  setUserNewName(val);
  if (val !== '') {
    setChangeBg(true)
  } else {
    setChangeBg(false)
  }
};

return (
  <form onSubmit={handleSubmit} className="w-full">
    <div className="px-4 gap-2.5 items-start bg-white space-y-2">
      <div className="flex border rounded-md">
        <div className="items-center py-2 pl-2 mt-1 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M14.2632 6.21053V12.3038C14.3349 12.9856 14.7928 14.3751 16.0502 14.4785V14.4785C17.7474 14.618 18.7444 12.7364 18.94 11.0449C18.9796 10.7021 19 10.3534 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19C11.5599 19 13.0271 18.6031 14.3062 17.9049M10 14.2632C7.64552 14.2632 5.73684 12.3545 5.73684 10C5.73684 7.64552 7.64552 5.73684 10 5.73684C12.3545 5.73684 14.2632 7.64552 14.2632 10C14.2632 12.3545 12.3545 14.2632 10 14.2632Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <Input
          className="p-2 bg-white border-none"
          placeholder={username}
          name="infoname"
          required
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>

      <div className="text-[15px] font-normal text-slate-500">
        Gợi ý dành cho bạn:
      </div>
      <div className="flex flex-wrap items-start gap-1 text-start">
        <span className="text-[15px] font-semibold text-slate-900">{suggest1},</span>
        <span className="text-[15px] font-semibold text-slate-900">{suggest2},</span>
        <span className="text-[15px] font-semibold text-slate-900">{suggest3}</span>
      </div>
    </div>
    {/* ============ DESKTOP ========== */}
    <div className="items-center self-stretch justify-end hidden gap-1 md:flex">
      <div className={`mt-2.5 bg-slate-50 rounded-full ${changeBg ? 'bg-slate-900' : ''} ${isPending ? 'opacity-50' : ''}`}>
        <button className="px-4 py-2" disabled={!changeBg || isPending}>
          <span className={`text-slate-300 font-semibold ${changeBg ? 'text-white' : ''}`}>Cập nhật thông tin</span>
        </button>
      </div>
    </div>


    {/* ============ MOBILE ========== */}
    <div className="fixed inset-x-0 bottom-0 px-4 pb-10 md:hidden">
      <div className={`mt-2.5 w-full items-center rounded-full bg-slate-50 ${changeBg ? 'bg-slate-900' : ''} text-center ${isPending ? 'opacity-50' : ''}`}>
        <button className="px-4 py-2" disabled={!changeBg || isPending}>
          <span className={`text-slate-300 font-semibold ${changeBg ? 'text-white' : ''}`}>Cập nhật thông tin</span>
        </button>
      </div>
    </div>

  </form>
);
}
