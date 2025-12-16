"use client";

import {
  Dispatch,
  SetStateAction,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";
import { HeaderModal } from "./header-modal";
// import { ModalContext } from "../../provider";
import { Avatar } from "@/components/shared/avatar";
import { BaseIconBTN } from "@/components/master-layout";
import { FooterModal } from "./footer-modal";
import { Tiptap } from "@/components/tiptap/tiptap";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CheckIcon,
  ScrollArea,
  toast,
} from "@suzu/ui";
import { useMediaQuery } from "node_modules/@suzu/ui/src/components/hooks";
import { BaseText } from "@/components/master-layout/base-text";
import { useParams, useRouter } from "next/navigation";
import { ModalContext } from "../../provider";
import { createClient } from "@/lib/supabase/client";
import { createFeedImageAction } from "@/lib/actions/feedImages/actions";
import { FeedPrivacy, FeedStatus } from "@/lib/supabase/database.types";
import { useContentTiptap } from "@/components/tiptap/providers/content-provider";
import { toastFeed } from "@/app/(app)/(outside)/toast/toast";
interface ContentFormProps {
  user: Profile;
  type: boolean;
  feed: Feed_Detail;
  parentFeedId: string | undefined;
  session: Session;
}
/*
    ContentForm: This component is used to render the content form in the feed modal.
    Includes:
    - HeaderModal: used to render the header modal in the feed modal.
    - FooterModal: used to render the footer modal in the feed modal.

*/

const ContentForm = memo(
  ({ user, type, feed, parentFeedId, session }: ContentFormProps) => {
    const editing = !!feed?.id;
    const { setShowFeedCreateModal } = useContext(ModalContext);
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { content } = useContentTiptap();
    let feedImage = feed?.feed_images ?? null;
    const supabase = createClient();
    const [filesPreview, setFilesPreview] = useState<any[]>(
      feed?.feed_images ?? [],
    );

    const { isMobile } = useMediaQuery();

    useEffect(() => {
      if (editing) {
        setFiles((feed?.feed_images as any[]) ?? []);
      }
    }, []);

    const router = useRouter();
    const searchParams = useParams();
    const { feedId } = searchParams;

    /**
     * Submit to create a new feed or edit exists feed
     */
    const handleSubmit = async (event: React.SyntheticEvent) => {
      event.preventDefault();
      setLoading(true);
      const { data: session, error } = await supabase.auth.getUser();

      /**
       * Editing or Create a new feed
       */
      if (editing) {
        const { data, error } = await supabase
          .from("feeds")
          .update({
            // ...payload,
            content: content,
            type: type ? "comment" : "feed",
            user_id: session?.user?.id!,
          })
          .eq("id", feed.id)
          .select(`*, feed_images(*)`)
          .single();

        if (typeof data === "object" && data !== null && files?.length > 0) {
          /**
           * Push new images
           */
          const uploadPromises = await Promise.all(
            files.map(async (file, index) => {
              if (!file?.name && feedImage) {
                feedImage = feedImage.filter(
                  (existingUrl) => existingUrl.image !== file?.image,
                );
                return false;
              }
              let path = file?.name;
              const { data: url, error } = await supabase.storage
                .from("suzu")
                .upload(path + `_${Date.now()}`, file);
              if (!error) {
                await createFeedImageAction({
                  feed_id: data?.id as string,
                  image:
                    process.env.NEXT_PUBLIC_SUPABASE_URL +
                    "storage/v1/object/public" +
                    "/suzu/" +
                    url?.path,
                });
              } else toast.error(error.message);
            }),
          );

          /**
           * Remove images
           */
          if (feedImage && feedImage.length > 0) {
            const deleteImage = await Promise.all(
              feedImage?.map(async (imageUrl) => {
                const url: string = imageUrl?.image!;
                const { data: image } = await supabase
                  .from("feed_images")
                  .delete()
                  .eq("image", url)
                  .select();
                const parts: string[] = url?.split("/");
                if (url && parts.length > 0) {
                  const filename: string = parts[parts?.length - 1];
                  const { data, error } = await supabase.storage
                    .from("suzu")
                    .remove([filename!]);
                }
              }),
            );
          }
        }

        setShowFeedCreateModal(false);
        type
          ? toast("Cập nhật bình luận thành công!", {
            icon: <CheckIcon />,
            duration: 5000,
          })
          : toastFeed(
            "Chỉnh sửa thành công",
            "checkIcon",
            "Xem",
            `/p/${data.id}`,
          );
        setLoading(false);
        router.refresh();
      } else {
        const { data, error } = await supabase
          .from("feeds")
          .insert({
            content: content,
            type: type ? "comment" : "feed",
            user_id: session?.user?.id!,
            privacy: FeedPrivacy.PUBLIC,
            status: FeedStatus.ACTIVE,
            parent_id: parentFeedId! ? parentFeedId! : (feedId! as string),
          })
          .select(`*`)
          .single();

        if (typeof data === "object" && data !== null) {
          /**
           * Push images
           */
          if (data?.id! && files?.length > 0) {
            const uploadPromises = await Promise.all(
              files.map(async (file, index) => {
                let path = file?.name;
                const { data: url, error } = await supabase.storage
                  .from("suzu")
                  .upload(path + `_${Date.now()}`, file);
                if (!error) {
                  await createFeedImageAction({
                    feed_id: data?.id as string,
                    image:
                      process.env.NEXT_PUBLIC_SUPABASE_URL +
                      "storage/v1/object/public" +
                      "/suzu/" +
                      url?.path,
                  });
                } else toast.error(error.message);
              }),
            );
          }
        }
        setShowFeedCreateModal(false);
        router.refresh();
        type
          ? toast("Bình luận thành công", {
            icon: <CheckIcon />,
            duration: 5000,
            // action: <Button className='px-2 py-1 flex-end bg-slate-200 text-foreground' onClick={() => console.log('Action!')}>Action</Button>,
          })
          : toastFeed(
            "Đăng bài thành công",
            "checkIcon",
            "Xem",
            `/p/${data.id}`,
          );
        setLoading(false);
        router.refresh();
      }
      // end "Editing"
    };

    /**
     * handleValidateImageFiles:
     *      - Validate size and the kind of images before preview
     * @param fileList
     * @returns
     */
    const handleValidateImageFiles = (fileList: File[]) => {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5Mb
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      for (const file of fileList) {
        //@ts-ignore
        if (!allowedExtensions.exec(file.name)) {
          toast.error(
            "Invalid file type. Only JPG, JPEG, PNG, and GIF files are allowed.",
          );
          return;
        }
        //@ts-ignore
        if (file.size > MAX_FILE_SIZE) {
          //@ts-ignore
          toast.error(`File ${file.name} is too large and has been excluded.`);
          return false;
        }
      }
      if (files && files?.length > 0) {
        setFiles((file) => [...file, ...fileList]);
      } else setFiles(fileList);
      handlePreviewImages(fileList);
    };
    // end handleValidateImageFiles

    /**
     * handlePreviewImages for drop, paste, select file from input
     * @param files
     */
    const handlePreviewImages = (fileList: File[]) => {
      const filesArray = fileList.map(
        (file: File) => URL.createObjectURL(file), // Transfer every file image into a url.
      );
      setFilesPreview((prevImages) => prevImages.concat(filesArray)); // Append new URLs to the current array.
      fileList.map((file: any) => URL.revokeObjectURL(file)); // Frees memory after the URL has been generated (to avoid memory leaks)
    };
    // end handlePreviewImages

    /**
     * handleFileSelect
     * @param e
     * @returns
     */
    const handleFileSelect = (e: any) => {
      let selectedFiles: File[] = Array.from(e.target.files);
      if (selectedFiles) {
        handleValidateImageFiles(selectedFiles);
      }
    };
    // end handleFileSelect

    /**
     * handleDeleteImage
     * @param data
     */
    const handleDeleteImage = (data: { image: string; key: number }) => {
      // Xử lý xóa ảnh khi update feed
      if (feed?.feed_images && feed?.feed_images?.length > 0) {
        setFilesPreview(
          filesPreview.filter((e) => {
            if (e?.image) {
              return e?.image !== data?.image;
            } else {
              return e !== data?.image;
            }
          }),
        );
        setFiles(files?.filter((_, index) => index !== data?.key));
      } else {
        setFilesPreview(
          filesPreview.filter(
            (e) => e !== data?.image || e?.image === data?.image,
          ),
        );
        setFiles(files?.filter((_, index) => index !== data?.key));
      }
    };
    // end handleDeleteImage

    // trigger input when click button
    const triggerFileInput = () => {
      document.getElementById("fileInput")?.click();
    };

    /**
     * Handle drag and drop with content-box of modal
     */
    useEffect(() => {
      const contentBox = document.getElementById("content-box-feed-common");

      function dragoverHandler(ev: DragEvent) {
        ev.preventDefault();
        if (!ev.dataTransfer) return;
        ev.dataTransfer.dropEffect = "move";
      }

      function dropHandler(ev: DragEvent) {
        ev.preventDefault();
        if (!ev.dataTransfer) return;
        const fileList = ev.dataTransfer.files;
        const files: File[] = [];
        for (const key of Object.keys(fileList)) {
          files.push(fileList[Number(key)]);
        }
        handleValidateImageFiles(files);
      }

      if (contentBox) {
        contentBox.addEventListener("drop", dropHandler);
        contentBox.addEventListener("dragover", dragoverHandler);
      }
    }, []);

    return (
      <div className="flex w-full flex-col items-center justify-center gap-2.5">
        <HeaderModal
          type={type}
          editing={editing}
          parentFeedId={parentFeedId}
        />

        {/* Content box */}
        <div className="flex w-full flex-col" id="content-box-feed-common">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className={`${isMobile ? "rounded-t-[20px]" : "rounded-[20px]"} bg-white`}
          >
            <div className="flex items-start justify-end gap-2.5 self-stretch">
              {/* avatar */}
              <div className="flex flex-col py-4 pl-4">
                <Avatar user={user!} session={session!} />
              </div>

              {/* Articale creation */}
              <div className="max-h-custom flex flex-1 flex-col items-start gap-2.5 py-4">
                {/* show name */}
                <div className="self-stretch">
                  <BaseText
                    className="sz-parag-semi"
                    text={user?.display_name!}
                    textColor="slate-900"
                  />
                  {/* <div onClick={triggerFileInput}>
                    <BaseIconBTN
                      className="absolute top-0 py-2 pr-2"
                      src={"/assets/icons-24/add-photo-alternate.png"}
                      width={24}
                      height={24}
                    />
                  </div> */}
                </div>
                <ScrollArea className="flex w-full flex-col overflow-hidden pr-1">
                  {/* Tiptap - TODO */}
                  <Tiptap handleValidateImageFiles={handleValidateImageFiles} />

                  {/* Preview Image - TODO */}
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    className="max-w-full mt-2"
                  >
                    <CarouselContent className="flex max-w-full items-start justify-between gap-2">
                      {filesPreview &&
                        filesPreview.map((item, index) => (
                          <CarouselItem
                            key={index}
                            className={`h-auto max-w-[220px] rounded-[8px] bg-slate-50`}
                          >
                            <div className="relative flex aspect-square items-center overflow-hidden rounded-[8px] p-0">
                              <img
                                src={
                                  typeof item === "object" ? item.image : item
                                }
                                alt=""
                                className="h-full w-full rounded-[8px] object-cover"
                              />
                              <div
                                onClick={() =>
                                  handleDeleteImage({
                                    image:
                                      typeof item === "object"
                                        ? item.image
                                        : item,
                                    key: index,
                                  })
                                }
                                className="absolute right-2 top-2 cursor-pointer rounded-full bg-[rgba(31,31,31,0.30)]"
                              >
                                <BaseIconBTN
                                  className="p-2"
                                  src={"/assets/icons/close-icon-24.png"}
                                  width={24}
                                  height={24}
                                />
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                    </CarouselContent>
                    {(feed?.feed_images && feed?.feed_images
                      ? feed?.feed_images
                      : filesPreview
                    )?.length > 2 && <CarouselPrevious />}
                    {(feed?.feed_images && feed?.feed_images
                      ? feed?.feed_images
                      : filesPreview
                    )?.length > 2 && <CarouselNext />}
                  </Carousel>

                  {/* type = true is feedDetail */}
                  {type ? null : (
                    <div className="relative h-10 w-10 cursor-pointer text-center">
                      <input
                        title="get-image-file"
                        id="fileInput"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileSelect(e)}
                      />
                      <div onClick={triggerFileInput}>
                        <BaseIconBTN
                          className="absolute top-0 py-2 pr-2"
                          src={"/assets/icons-24/add-photo-alternate.png"}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>

            {/* Footer Modal */}
            <FooterModal
              type={type}
              files={files}
              editing={editing}
              parentFeedId={parentFeedId}
              loading={loading}
            />
          </form>
        </div>
      </div>
    );
  },
);

export { ContentForm };
