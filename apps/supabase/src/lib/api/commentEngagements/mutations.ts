import { 
  CommentReactionId, 
  NewCommentReactionParams,
  UpdateCommentReactionParams, 
  insertCommentReactionSchema, 
  commentReactionIdSchema,
  UpsertCommentReactionParams,
  upsertCommentReactionSchema,
  upsertCommentReactionParams,
} from "@/lib/db/schema/commentReactions";
import { createClient } from "@/lib/supabase/server";



export const createCommentReaction = async (commentReaction: any) => {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser();
  // const newCommentReaction = upsertCommentReactionSchema.parse({ 
  //   ...commentReaction, user_id: session?.user?.id! });
  try {
    const { data: c, error } = await supabase
      .from('comment_engagement')
      .insert({
        ...commentReaction,
        user_id: session?.user?.id!
      })
      .select()
    
    if(error){
      throw {error: error}
    }
    return { commentReaction: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCommentReaction = async (id: any, commentReaction: any) => {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser();
  try {
    const { data : c, error } = await supabase
  .from('comment_engagement')
  .upsert({
    ...commentReaction,
    user_id: session?.user?.id!
  })
  .eq('id',id)
  .eq('user_id', session?.user?.id!)
  .select()
  
    if(error) throw {error:error}
    return { commentReaction: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCommentReaction = async (id: CommentReactionId) => {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser();
  const { id: commentReactionId } = commentReactionIdSchema.parse({ id });
  try {
    const {data:c,error} =  await supabase.from('comment_engagement').delete()
    .eq('id', commentReactionId)
    .eq('user_id', session?.user?.id!)
    .select()
    return { commentReaction: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

