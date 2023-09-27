import { IFollowing } from "../models/IFollowing";
import { IPost } from "../models/IPost";
import supabase from "../supabase/supabaseClient";

async function fetchFollowingPost(
  followingIdList: IFollowing[]
): Promise<IPost[]> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*,users(name,avatar)")
      .in("user_id", [
        ...followingIdList.map((following) => following.following_id),
      ])
      .order("created_at", {
        ascending: false,
      });
    if (error) {
      throw error;
    }
    return data as IPost[];
  } catch (error) {
    throw error;
  }
}

async function fetchProfilePosts({
  profileId,
}: {
  profileId: string;
}): Promise<IPost[]> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*,users(name,avatar)")
      .eq("user_id", profileId)
      .order("created_at", {
        ascending: false,
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

const PostService = {
  fetchFollowingPost,
  fetchProfilePosts,
};
export default PostService;
