"use client";
import { AVATAR_BUCKET, uploadUserFile } from "@/lib/storage";
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
  BackButton,
  CommonButton,
  Input,
  Textarea,
  toast,
} from "@suzu/ui";
import { useEffect, useState, useTransition } from "react";
import UpdateUserUName from "./UpdateUserUName";
import { createClient } from "@/lib/supabase/client";
import { updateProfileAction } from "@/lib/actions/user/actions";
import { UserRound } from "lucide-react";
import slugify from "slugify";
import { redirect } from "next/navigation";
function Profile({ user, session }: { user: Profile; session: Session }) {
  const [selectedValue, setSelectedValue] = useState<string>();
  if (!session?.user?.id) {
    redirect(`/`);
  }
  useEffect(() => {
    setSelectedValue((user?.gender as string) ?? "male");
  }, []);
  const [isPending, startTransition] = useTransition();
  const [openComponent, setOpenComponent] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar_url!);
  const [fileAvatar, setFileAvatar] = useState<any>(null);
  const supabase = createClient();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const { data: session } = await supabase.auth.getUser();
    const target = event.target as HTMLFormElement;
    const form = new FormData(target);
    const { full_name, display_name, description, gender } = Object.fromEntries(
      form.entries(),
    ) as {
      description: string;
      full_name: string;
      display_name: string;
      gender: string;
    };
    if (full_name.length < 5)
      return toast.error("Username must be at least 5 characters long");
    startTransition(async () => {
      let avatar_url: string | undefined;
      if (fileAvatar) {
        if (!session?.user?.id) {
          toast.error("Please log in first.");
          return;
        }
        try {
          avatar_url = await uploadUserFile(
            supabase,
            AVATAR_BUCKET,
            session.user.id,
            fileAvatar,
          );
        } catch (error) {
          toast.error(`Failed to upload avatar: ${(error as Error).message}`);
          return;
        }
      }
      const { error } = await updateProfileAction({
        display_name: display_name,
        full_name: slugify(full_name, { replacement: "." }),
        description: description,
        gender: gender,
        ...(avatar_url ? { avatar_url } : {}),
      });
      if (!error) {
        toast.success("Successfully updated profile!");
        window.location.reload();
      } else {
        toast.error(
          typeof error === "string" ? error : "Failed to update profile!",
        );
      }
    });
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileAvatar(file!);
    const filesUrl = URL.createObjectURL(file);
    setAvatar(filesUrl);
  };

  return (
    <>
      {openComponent ? (
        <div className="relative flex flex-col items-start self-stretch bg-white py-2.5">
          <div className="mb-4 flex items-center gap-2 self-stretch">
            {/* <div
              className="absolute -top-[85px] left-0"
              onClick={() => setOpenComponent(false)}
            >
              <BackButton currentResource="" states="disable" />
            </div> */}
            <div className="px-4 text-[23px] font-semibold text-slate-900">
              Username
            </div>
          </div>
          <UpdateUserUName
            username={user?.full_name! as string}
            session={session!}
            // username={null}
          />
        </div>
      ) : (
        <form
          onSubmit={async (e) => handleSubmit(e)}
          className="h-full max-h-full overflow-y-auto"
        >
          {/* frame */}
          <div className="flex min-h-full max-w-xl flex-col gap-4">
            <div className="flex flex-col gap-4 px-4">
              <div className="mb-1 flex items-end gap-2.5 md:mb-0">
                <div className="flex items-end gap-4">
                  {/* avatar */}
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUploadImage}
                  />
                  <AvatarComponent
                    className="h-[92px] w-[92px] cursor-pointer"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                  >
                    <img
                      src={avatar}
                      alt=""
                      className="h-full w-full rounded-bl-[8px] rounded-br-3xl rounded-tl-3xl rounded-tr-[8px]"
                    />
                    {/* <AvatarImage src={avatar} /> */}
                    <AvatarFallback>
                      <UserRound />
                    </AvatarFallback>
                  </AvatarComponent>
                  <label
                    htmlFor="fileInput"
                    className="btn min-w-[87px] cursor-pointer bg-black/5 text-center font-semibold text-neutral-700"
                  >
                    Change photo
                  </label>
                </div>
              </div>
              <div className="flex flex-col items-start gap-1 self-stretch">
                <div className="mb-1 flex items-start justify-between self-stretch">
                  <p className="flex-basis-0 leading-150 flex-shrink-0 font-sans text-[15px] font-semibold text-[#334155]">
                    Display name
                  </p>
                  <p className="leading-150 font-sans text-[15px] font-normal text-[#6B7280]">
                    1/20
                  </p>
                </div>
                <Input
                  className="h-[40px] items-center gap-2 self-stretch rounded-md border border-[#D1D5DB] bg-white p-2 focus:outline-hidden focus:ring-0"
                  placeholder="Enter display name..."
                  name="display_name"
                  required
                  defaultValue={user?.display_name as string}
                />
              </div>
              <div className="flex flex-col items-start gap-1 self-stretch">
                <div className="mb-1 flex items-start justify-between self-stretch">
                  <p className="flex-basis-0 leading-150 flex-shrink-0 font-sans text-[15px] font-semibold text-[#334155]">
                    Username
                  </p>
                </div>
                <Input
                  className="h-[40px] items-center gap-2 self-stretch rounded-md border border-[#D1D5DB] bg-white p-2 focus:outline-hidden focus:ring-0"
                  placeholder="@username"
                  name="full_name"
                  required
                  defaultValue={user?.full_name as string}
                  // onClick={() => setOpenComponent(!openComponent)}
                />
              </div>
              <div className="flex flex-col items-start gap-1 self-stretch">
                <div className="flex items-start justify-between self-stretch">
                  <p className="flex-basis-0 leading-150 flex-shrink-0 font-sans text-[15px] font-semibold text-[#334155]">
                    Gender
                  </p>
                </div>
                <div className="flex items-start gap-5 self-stretch">
                  <div className="flex h-6 items-center">
                    <div className="flex items-center gap-2">
                      <input
                        id="male"
                        type="radio"
                        name="gender"
                        value="male"
                        onChange={handleChange}
                        checked={selectedValue === "male"}
                      />
                      Male
                    </div>
                  </div>
                  <div className="flex h-6 items-center">
                    <div className="flex items-center gap-2">
                      <input
                        id="female"
                        type="radio"
                        name="gender"
                        value="female"
                        onChange={handleChange}
                        checked={selectedValue === "female"}
                      />
                      Female
                    </div>
                  </div>
                  <div className="flex h-6 items-center">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="none"
                        onChange={handleChange}
                        checked={selectedValue === "none"}
                      />
                      Prefer not to say
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col self-stretch">
                <div className="flex items-start justify-between self-stretch">
                  <div className="flex-basis-0 leading-150 flex-shrink-0 font-sans text-[15px] font-semibold text-[#334155]">
                    Bio
                  </div>
                  <div className="leading-150 font-sans text-[15px] font-normal text-[#6B7280]">
                    1/150
                  </div>
                </div>
                <Textarea
                  name="description"
                  className="max-h-[112px] min-h-[112px] items-center gap-2 self-stretch border border-slate-300 p-2 focus:outline-hidden focus:ring-0"
                  placeholder="Tell us about yourself"
                  defaultValue={user?.description as string}
                />
              </div>
            </div>

            <div className="flex-grow border-b border-b-[#1f1f1f/1]"></div>
            <div
              className={`w-full items-center gap-1 self-stretch px-4 text-center md:text-right ${true ? "cursor-pointer" : ""}`}
            >
              <button
                type="submit"
                className="btn btn-default block w-full md:inline-block md:w-auto"
                disabled={!true}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default Profile;
