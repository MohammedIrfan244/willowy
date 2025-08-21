import cloudinary from "../config/cloudniray";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";



const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'pymedaca',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const upload = multer({ storage });

export default upload