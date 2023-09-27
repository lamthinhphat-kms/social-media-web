import { IUser } from "../models/IUser";
import supabase from "../supabase/supabaseClient";

async function updateUserInfo({ name, udid }: { name: string; udid: string }) {
  try {
    const { data, error } = await supabase.from("users").upsert([
      {
        id: udid,
        name,
      },
    ]);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchUserProfile({
  userId,
}: {
  userId: string;
}): Promise<IUser[]> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .limit(1);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

async function fetchUserByName({
  search,
}: {
  search: string;
}): Promise<IUser[]> {
  try {
    if (search.length !== 0) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .textSearch("name", `${search}:*`)
        .limit(9);
      if (error) {
        throw error;
      }
      return data || [];
    }
    return [];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const UserService = {
  updateUserInfo,
  fetchUserProfile,
  fetchUserByName,
};

export default UserService;
