import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  //@ts-ignore
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../static");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  //@ts-ignore
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    //@ts-ignore
    req.fileName = `/static/${uniqueName}`;
    cb(null, uniqueName);
  },
});

export default multer({ storage });
