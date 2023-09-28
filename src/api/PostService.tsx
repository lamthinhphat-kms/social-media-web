import axios from "axios";
import { IFollowing } from "../models/IFollowing";
import { IPost } from "../models/IPost";
import supabase from "../supabase/supabaseClient";
import UploadService from "./UploadService";

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

async function uploadImagePost({
  blob,
  caption,
  userId,
}: {
  blob: Blob;
  caption: string;
  userId: string;
}) {
  try {
    const resUploadImage = await UploadService.uploadImage(
      blob,
      userId,
      "posts"
    );
    const resInsertPost = await supabase.from("posts").insert([
      {
        user_id: userId,
        caption: caption,
        image_url: resUploadImage.imageUrl,
      },
    ]);
    if (resInsertPost.error) {
      throw resInsertPost.error;
    }
    return resInsertPost.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios request failed",
        error.response?.data,
        error.toJSON()
      );
    } else {
      console.error(error);
    }
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
  uploadImagePost,
};
export default PostService;
