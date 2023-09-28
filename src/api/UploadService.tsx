import axios from "axios";
import { v4 as uuidv4 } from "uuid";

async function uploadImage(
  blob: Blob,
  userId: string,
  pathName: string,
  imageName?: string
) {
  try {
    const bodyFormData = new FormData();
    let fileName;
    if (imageName) {
      fileName = `${imageName}.${blob.type.substring(
        blob.type.lastIndexOf("/") + 1,
        blob.type.length
      )}`;
    } else {
      fileName = `${uuidv4()}.${blob.type.substring(
        blob.type.lastIndexOf("/") + 1,
        blob.type.length
      )}`;
    }
    bodyFormData.append("image", blob!, fileName);
    bodyFormData.append("userId", userId);
    bodyFormData.append("pathName", pathName);
    const res = await axios.post("file-upload/single", bodyFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

const UploadService = {
  uploadImage,
};

export default UploadService;
