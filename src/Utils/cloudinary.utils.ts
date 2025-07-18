import { config } from "dotenv";


config()
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(cloudinary.config());


const uploadPhoto = async(photo :string ) => {
  const result = await cloudinary.uploader.upload(photo, {
      folder: "", // optional: to keep organized in Cloudinary
      use_filename: true,
      unique_filename: false,
  });
  
  return result.secure_url;
}


export default uploadPhoto