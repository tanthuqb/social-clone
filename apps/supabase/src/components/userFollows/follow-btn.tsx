"use client";

import { Dispatch, SetStateAction, useOptimistic } from "react";
import { followAction, unfollowAction } from "@/lib/actions/userFollows/actions";
import { Button, CheckIcon, cn, toast } from "@suzu/ui";
import { useState, useTransition } from "react";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FollowProps = {
  userId: string;
  followingId: string;
  followingState: boolean;
  setShowPlus?: Dispatch<SetStateAction<boolean>>;
  setFollowingState? : Dispatch<SetStateAction<boolean>>;
  showPlus?: boolean;
};
export const FollowButton = ({
  userId,
  followingId,
  followingState,
  setShowPlus,
  setFollowingState
}: FollowProps) => {
  const { setShowLoginModal } = useContext(ModalContext);
  const [pending, startMutation] = useTransition();
  const [message, setMessage] = useState("" as string);
  const [optimisticState, updateOptimisticState] = useOptimistic(
    followingState,
    (followingState) => followingState,
  );
  const [following, setFollowing] = useState(followingState);
  const [isFollowint, setIsFollowing] = useState(false);

  const pathname = usePathname();
  const supabase = createClient();

  const handleFollow = async () => {
    if (!userId) {
      setShowLoginModal(true)
    } else {
      try {
        startMutation(async () => {
          if (following) {
            const { error } = await unfollowAction(followingId);
            if (error) {
              toast.error(error);
              return;
            }
            updateOptimisticState(false);
            setFollowing(false);
            if(setFollowingState){
              setFollowingState(false);
            }
            toast("Unfollowed successfully", {
              icon: <CheckIcon />,
              duration: 5000,
              // action: <Button className='px-2 py-1 flex-end bg-slate-200 text-foreground' onClick={() => console.log('Action!')}>Action</Button>,
            });
            // if (res === true) {
            //   socket.emit('send-notification', 'unfollow');
            // }
            // unfollow
          } else {
            // follow
            const { error } = await followAction(followingId);
            if (error) {
              toast.error(error);
            } else {
              toast("Followed successfully", {
                icon: <CheckIcon />,
                duration: 5000,
                // action: <Button className='px-2 py-1 flex-end bg-slate-200 text-foreground' onClick={() => console.log('Action!')}>Action</Button>,
              });
              setFollowing(true);
              if(setFollowingState){
                setFollowingState(true);
              }
              if(setShowPlus)
                setShowPlus(false);
              
            }
            updateOptimisticState(true);
          }
        });
      } catch (error) {
        console.error("Error creating feed reaction", error);
      }
    }
  };


  return (
    <>
      {pathname === `/u/${followingId}` ? (
        <>
          <div className="py-2">
            {message || "All good things are wild and free.."}
          </div>
          <div className="flex justify-between gap-1">
            <Button
              size={"sm"}
              className={cn("w-full rounded-full", {
                "border border-slate-100 bg-white text-[15px] font-semibold text-slate-900 hover:bg-white":
                  following,
                "animate-pulse ": pending,
              })}
              onClick={handleFollow}
              data-testid="follow-button"
            >
              {following ? "Following" : "Follow"}
            </Button>
            <Button
              size={"sm"}
              className={cn(
                "w-full rounded-full border border-slate-100 bg-white text-[15px] font-semibold text-slate-900 hover:bg-white",
                { "animate-pulse ": pending },
              )}
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Profile link copied");
              }}
            >
              Mention
            </Button>
          </div>
        </>
      ) : (
        <Button
          size={"sm"}
          className={cn("w-full rounded-full", {
            "border border-slate-100 bg-white text-[15px] font-semibold text-slate-900 hover:bg-white":
              following,
            "animate-pulse ": pending,
          })}
          onClick={handleFollow}
          data-testid="follow-button"
        >
          {following ? "Following" : "Follow"}
        </Button>
      )}
    </>
  );
};
