import { IFollowing } from "../models/IFollowing";
import supabase from "../supabase/supabaseClient";

async function fetchFollowingList(
  currentUserId: string
): Promise<IFollowing[]> {
  try {
    const { data, error } = await supabase
      .from("following")
      .select("following_id,user_id")
      .eq("user_id", currentUserId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const FollowingService = {
  fetchFollowingList,
};
export default FollowingService;
