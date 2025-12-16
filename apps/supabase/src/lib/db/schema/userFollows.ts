

import { z } from "zod";


// Schema for userFollows - used to validate API requests
const userFollows = z.object({
  user_id: z.coerce.string().min(1),
  following_id: z.coerce.string().min(1),
});


export const insertUserFollowSchema =userFollows;
export const insertUserFollowParams = userFollows

export const updateUserFollowSchema = userFollows;
export const updateUserFollowParams = userFollows;
export const userFollowIdSchema = userFollows.pick({
  user_id: true,
  following_id: true,
});
export const userIdParams = userFollowIdSchema.omit({
  following_id: true,
});

// Types for userFollows - used to type API request params and within Components
export type UserFollows = z.infer<typeof userFollows>;
export type NewUserFollow = z.infer<typeof insertUserFollowSchema>;
export type NewUserFollowParams = z.infer<typeof insertUserFollowParams>;
export type UpdateUserFollowParams = z.infer<typeof updateUserFollowParams>;
export type UserFollowId = z.infer<typeof userFollowIdSchema>;
export type userIdParams = z.infer<typeof userIdParams>;
