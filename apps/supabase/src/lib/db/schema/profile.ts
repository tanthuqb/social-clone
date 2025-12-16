

import { z } from "zod";
import { FeedPrivacy, convertEnumToArray } from "./feeds";

// Schema for userFollows - used to validate API requests
const Profile = z.object({
  id : z.string().uuid(),
  display_name: z.string().nullable(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  website: z.string().nullable(),
  description: z.string().nullable(),
  gender: z.string().nullable(),
  types: z.string().nullable(),
  birthday: z.string().date().nullable(),
  trial_end: z.string().date().nullable(),
  privacy: z.enum(convertEnumToArray(FeedPrivacy)),
});


export const insertProfileSchema = Profile.omit({
  id: true
});

export const insertProfileParams = insertProfileSchema

export const updateProfilewSchema = Profile;
export const updateProfileParams = Profile;
export const ProfileIdSchema = Profile.pick({
  id: true,
});


// Types for userFollows - used to type API request params and within Components
export type Profile = z.infer<typeof Profile>;
export type NewProfile = z.infer<typeof insertProfileSchema>;
export type NewProfileParams = z.infer<typeof insertProfileParams>;
export type UpdateProfileParams = z.infer<typeof updateProfileParams>;
export type ProfileIdSchema = z.infer<typeof ProfileIdSchema>;
export type ProfileParams = z.infer<typeof Profile>;
export type ProfileIdParams = z.infer<typeof ProfileIdSchema>['id'];
