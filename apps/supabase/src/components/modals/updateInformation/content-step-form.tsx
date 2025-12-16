"use-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useContext, useState } from "react";
import { UserRound } from "lucide-react";
import {
  BackIcon,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  toast,
} from "@suzu/ui";
import { ModalContext } from "../provider";
import {
  Avatar as AvatarComponent,
  AvatarImage,
  AvatarFallback,
} from "@suzu/ui";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/ultis";

const formSchema = z.object({
  username: z
    .string({
      required_error: "Vui lòng nhập tên hiển thị.",
    })
    .max(21, {
      message: "Tối đa 20 ký tự",
    }),
  personalname: z
    .string({
      required_error: "Vui lòng nhập tên cá nhân.",
    })
    .max(21, {
      message: "Tối đa 20 ký tự",
    }),
  gender: z.enum(["male", "female", "none"], {
    required_error: "Vui lòng chọn giới tính.",
  }),
});

function ContentStepForm() {
  const [activeButton, setActiveButton] = useState(false);
  const [checkNameAccount, setCheckNameAccount] = useState(false);
  const [toggleGender, setToggleGender] = useState(false);
  const [countName, setCountName] = useState(0);
  const [displayNameValue, setDisplayNameValue] = useState("");
  const [accountPersonal, setAccountPersonal] = useState("");
  const [personalCountName, setPersonalCountname] = useState(0);
  const [suggest1, setSuggest1] = useState("");
  const [suggest2, setSuggest2] = useState("");
  const [suggest3, setSuggest3] = useState("");
  const [suggest4, setSuggest4] = useState("");

  const { setShowUpdateInfoUserModal } = useContext(ModalContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalname: "",
      username: "",
      gender: "none",
    },
  });
  const maxTotalCount = 20;
  const supabase = createClient();
  const handleOpenNameAccount = async () => {
    // Thọ call API ở đây khi user submit step 1
    // Lấy value tên hiển thị là displayNameValue để gửi lên API
    const { data: session } = await supabase.auth.getUser();
    if (session && session.user) {
      const { data: update, error } = await supabase
        .from("profiles")
        .update({
          display_name: displayNameValue,
        })
        .eq("id", session.user.id);
      if (error) {
        toast.error(error.message);
      }
    }
    let slugDisplayName = slugify(displayNameValue, { replacement: "." });
    const { data: search } = await supabase
      .from("profiles")
      .select("full_name")
      .ilike("full_name", `${slugDisplayName}%`)
      .neq("id", session?.user?.id)
      .order("full_name", { ascending: false });

    if (search && search.length > 0) {
      // Extract the maximum number from existing profile names
      let maxLength = 0;
      const existingNumbers = new Set();
      search.forEach((profile) => {
        const match = profile.full_name.match(
          new RegExp(`${slugDisplayName}(\\d+)$`),
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
            setSuggest1("@" + slugDisplayName + missingValues[count]);
            break;
          case 1:
            setSuggest2("@" + slugDisplayName + missingValues[count]);
            break;
          case 2:
            setSuggest3("@" + slugDisplayName + missingValues[count]);
            break;
          case 3:
            setSuggest4("@" + slugDisplayName + missingValues[count]);
            break;
        }
      }
    } else {
      setSuggest1("@" + slugDisplayName + "");
      setSuggest2("@" + slugDisplayName + "1");
      setSuggest3("@" + slugDisplayName + "2");
      setSuggest4("@" + slugDisplayName + "3");
    }
    const response = await fetch(
      `https://ui-avatars.com/api/?name=${slugify(form.getValues("username").length ? form.getValues("username") : "Suzu", { replacement: "+" })}&background=random&color=fff`,
    );
    const blob = await response.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(`avatar_${slugDisplayName}_${new Date().getTime()}.pjeg`, file);

    if (error) {
      console.error("Error uploading avatar:", error);
    } else {
      //@ts-ignore
      let path =
        process.env.NEXT_PUBLIC_SUPABASE_URL +
        "storage/v1/object/public" +
        "/avatars/" +
        data.path;
      const { data: updateAvatar, error: errorUpdateAvatar } = await supabase
        .from("profiles")
        .update({
          avatar_url: path,
        })
        .eq("id", session?.user?.id);
    }
    setCheckNameAccount(true);
  };
  const handleOpenGender = async () => {
    // Thọ call API ở đây khi user submit step 2
    // Lấy value tên cá nhân là accountPersonal để gửi lên API
    const { data: session } = await supabase.auth.getUser();
    if (session && session.user) {
      const { data: update, error } = await supabase
        .from("profiles")
        .update({
          full_name: slugify(accountPersonal, { replacement: "." }),
        })
        .eq("id", session.user.id);
      if (error) {
        toast.error(error.message);
      }
    }
    setCheckNameAccount(false);
    setToggleGender(true);
  };

  const handleChangeNameDisplay = async (e: any) => {
    setCountName(e.target.value.length);
    setDisplayNameValue(e.target.value);
    setActiveButton(true);
  };

  const handleChangePersonalname = (e: any) => {
    setPersonalCountname(e.target.value.length);
    setAccountPersonal(e.target.value);
    setActiveButton(true);
  };

  const handleBackButton = () => {
    if (checkNameAccount) {
      setCheckNameAccount(false);
    } else if (toggleGender) {
      setToggleGender(false);
      setCheckNameAccount(true);
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setShowUpdateInfoUserModal(false);
    const { data: session } = await supabase.auth.getUser();
    if (session && session.user) {
      const { data: update, error } = await supabase
        .from("profiles")
        .update({
          gender: data.gender,
        })
        .eq("id", session.user.id);
      if (error) {
        toast.error(error.message);
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-start self-stretch p-2">
        <div className="flex w-full gap-2">
          {(checkNameAccount || toggleGender) && (
            <button onClick={handleBackButton} className="p-2">
              <BackIcon className="cursor-pointer" />
            </button>
          )}
          <div className="flex-1 text-center text-[15px] font-semibold leading-6 text-white">
            Cập nhật thông tin
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
          ></svg>
        </div>
      </div>

      <div className="rounded-t-2xl bg-white pb-10 md:rounded-2xl">
        <div className="py:4 mx-auto flex w-[354px] flex-col items-center justify-center gap-5 pt-8 md:py-6">
          <div className="flex flex-col items-center">
            {checkNameAccount ? (
              <div className="flex flex-col gap-2.5 self-stretch text-left">
                <div className="text-left text-[23px] font-semibold text-slate-700">
                  Chúng tôi có thể gọi bạn là gì!
                </div>
                <div className="text-[15px] font-normal text-slate-900">
                  Tên tài khoản của bạn là duy nhất trên SuZu.Bạn có thể thay
                  đổi sau này nếu muốn.
                </div>
              </div>
            ) : toggleGender ? (
              <div className="flex flex-col gap-2.5 self-stretch text-left">
                <div className="text-left text-[23px] font-semibold text-slate-700">
                  Cho SuZu biết giới tính nha
                </div>
                <div className="text-[15px] font-normal text-slate-900">
                  Điều này hỗ trợ SuZu đưa những nội dung liên quan đến bạn &
                  SuZu không hiển thị thông tin này trên trang cá nhân của bạn.
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 self-stretch text-left">
                <div className="flex items-center justify-center text-center">
                  {/* <Avatar user={null} className="h-[92px] w-[92px]" /> */}
                  <AvatarComponent className="h-[92px] w-[92px]">
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=Suzu&background=random&color=fff`}
                    />
                    <AvatarFallback>
                      <UserRound />
                    </AvatarFallback>
                  </AvatarComponent>
                </div>
                <div className="text-left text-[23px] font-semibold text-slate-700">
                  Chào mừng đến SuZu nà! 🎉
                </div>
                <div className="text-[15px] font-normal text-slate-900">
                  Các câu trả lời trong một vài câu hỏi tới sẽ giúp SuZu gợi ý
                  những nội dung phù hợp đến với bạn.
                </div>
              </div>
            )}

            <Form {...form}>
              <form
                className="w-full items-center"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <div className="my-2.5 flex flex-col items-start gap-5 rounded-[20px] bg-white">
                  {checkNameAccount ? (
                    <div className="flex flex-col items-start gap-1 self-stretch">
                      <div className="mb-1 flex items-start justify-between self-stretch">
                        <p className="flex-basis-0 leading-150 flex-shrink-0 font-sans text-[15px] font-semibold text-[#334155]">
                          Tên cá nhân
                        </p>
                        <p
                          className={`leading-150 font-sans text-[15px] font-normal ${personalCountName <= 20 ? "text-[#6B7280]" : "text-red-500"}`}
                        >
                          {personalCountName}/{maxTotalCount}
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name="personalname"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl
                              onChange={(e: any) => handleChangePersonalname(e)}
                            >
                              <Input
                                placeholder="Nhập tên cá nhân"
                                {...field}
                                value={accountPersonal}
                                maxLength={21}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="text-[15px] font-normal text-slate-500">
                        Gợi ý dành cho bạn:
                      </div>
                      <div className="flex flex-wrap items-start gap-1 text-start">
                        <span className="text-[15px] font-semibold text-slate-900">
                          {suggest1},
                        </span>
                        <span className="text-[15px] font-semibold text-slate-900">
                          {suggest2},
                        </span>
                        <span className="text-[15px] font-semibold text-slate-900">
                          {suggest3}
                        </span>
                        <span className="text-[15px] font-semibold text-slate-900">
                          {suggest4}
                        </span>
                      </div>
                    </div>
                  ) : toggleGender ? (
                    <div className="flex flex-col items-start gap-1 self-stretch">
                      <div className="w-full items-start space-y-4 self-stretch pb-5">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value ?? "none"}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0 text-slate-700">
                                    <FormControl className="h-[18px] w-[18px] items-center rounded-full border-[2px] border-slate-700 text-slate-700 focus:border-slate-700">
                                      <RadioGroupItem
                                        value="male"
                                        className="items-center"
                                      />
                                    </FormControl>
                                    <FormLabel className="rounded-full text-center text-[15px] font-semibold">
                                      Nam
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0 text-slate-700">
                                    <FormControl className="h-[18px] w-[18px] items-center rounded-full border-[2px] border-slate-700 text-slate-700 focus:border-slate-700">
                                      <RadioGroupItem
                                        value="female"
                                        className="items-center"
                                      />
                                    </FormControl>
                                    <FormLabel className="text-[15px] font-semibold">
                                      Nữ
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0 text-slate-700">
                                    <FormControl className="h-[18px] w-[18px] items-center rounded-full border-[2px] border-slate-700 text-slate-700 focus:border-slate-700">
                                      <RadioGroupItem
                                        value="none"
                                        className="items-center"
                                      />
                                    </FormControl>
                                    <FormLabel className="text-[15px] font-semibold">
                                      Không muốn nói
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full flex-col items-start gap-1 self-stretch">
                      <div className="mb-1 flex items-start justify-between self-stretch">
                        <p className="flex-basis-0 leading-150 flex-shrink-0 font-sans text-[15px] font-semibold text-[#334155]">
                          Tên hiển thị
                        </p>
                        <p
                          className={`leading-150 font-sans text-[15px] font-normal ${countName <= 20 ? "text-[#6B7280]" : "text-red-500"}`}
                        >
                          {countName}/{maxTotalCount}
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl
                              onChange={(e: any) => handleChangeNameDisplay(e)}
                            >
                              <Input
                                placeholder="Nhập tên hiển thị"
                                {...field}
                                value={displayNameValue}
                                className="w-full"
                                maxLength={21}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {toggleGender && (
                    <div className="w-full pb-10 md:pb-0">
                      <div
                        className={`mt-2.5 w-full items-center rounded-full ${activeButton && countName !== 0 ? "cursor-pointer bg-slate-900" : "bg-slate-50"}`}
                      >
                        {/* Button submit cuối cùng */}
                        <button
                          type="submit"
                          disabled={!activeButton || countName === 0}
                          className={`w-full px-4 py-2 ${activeButton && countName !== 0 ? "text-white" : "text-slate-300"}`}
                        >
                          SuZuu 💫
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </Form>

            {checkNameAccount ? (
              <div className="w-full pb-10 md:pb-0">
                <button
                  //Bước này click để vào step 3
                  onClick={handleOpenGender}
                  disabled={
                    !activeButton ||
                    personalCountName === 0 ||
                    personalCountName > 20
                  }
                  className={`mt-2.5 w-full items-center rounded-full ${activeButton && personalCountName <= 20 ? "cursor-pointer bg-slate-900" : "bg-slate-50"}`}
                >
                  <div
                    className={`w-full px-4 py-2 text-center ${activeButton && personalCountName <= 20 ? "text-white" : "text-slate-300"}`}
                  >
                    Tiếp theo
                  </div>
                </button>
              </div>
            ) : (
              checkNameAccount === false &&
              toggleGender === false && (
                <div className="w-full pb-10 md:pb-0">
                  <button
                    // Button đầu tiên
                    // Click để vào step 2
                    onClick={handleOpenNameAccount}
                    disabled={
                      !activeButton || countName === 0 || countName > 20
                    }
                    className={`mt-2.5 w-full items-center rounded-full ${activeButton && countName <= 20 ? "cursor-pointer bg-slate-900" : "bg-slate-50"}`}
                  >
                    <div
                      className={`w-full px-4 py-2 text-center ${activeButton && countName <= 20 ? "text-white" : "text-slate-300"}`}
                    >
                      Tiếp theo
                    </div>
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* 3 dots */}
      <div className="hidden justify-center space-x-2 py-5 md:flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="9"
          viewBox="0 0 8 9"
          fill="none"
        >
          <rect
            y="0.5"
            width="8"
            height="8"
            rx="4"
            fill="white"
            fillOpacity={`${checkNameAccount === false && toggleGender === false ? "0.9" : " 0.3"}`}
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="9"
          viewBox="0 0 8 9"
          fill="none"
        >
          <rect
            y="0.5"
            width="8"
            height="8"
            rx="4"
            fill="white"
            fillOpacity={`${checkNameAccount ? "0.9" : " 0.3"}`}
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="9"
          viewBox="0 0 8 9"
          fill="none"
        >
          <rect
            y="0.5"
            width="8"
            height="8"
            rx="4"
            fill="white"
            fillOpacity={`${toggleGender ? "0.9" : " 0.3"}`}
          />
        </svg>
      </div>
    </>
  );
}

export default ContentStepForm;
