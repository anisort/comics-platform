import { BadRequestException } from "@nestjs/common";

export const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Only jpg, jpeg, and png files are allowed'), false);
    }
  };
  