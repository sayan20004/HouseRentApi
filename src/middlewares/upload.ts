import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import cloudinary from '../config/cloudinary';
import { BadRequestError } from '../utils/ApiError';

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

export const uploadImages = upload.array('images', 5);

export const handleImageUpload = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return next();
    }

    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = [];

    const uploadPromises = files.map((file) => {
      return new Promise<void>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'house-rent-app' },
          (error, result) => {
            if (error) return reject(error);
            if (result) {
              imageUrls.push(result.secure_url);
            }
            resolve();
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    await Promise.all(uploadPromises);

    req.body.images = imageUrls;
    
    if(req.body.rent) req.body.rent = Number(req.body.rent);
    if(req.body.bhk) req.body.bhk = Number(req.body.bhk);
    if(req.body.securityDeposit) req.body.securityDeposit = Number(req.body.securityDeposit);
    if(req.body.builtUpArea) req.body.builtUpArea = Number(req.body.builtUpArea);
    
    if(req.body.maintenance && typeof req.body.maintenance === 'string') {
        try {
            req.body.maintenance = JSON.parse(req.body.maintenance);
        } catch (e) {}
    }
    
    if(req.body.location && typeof req.body.location === 'string') {
        try {
            req.body.location = JSON.parse(req.body.location);
        } catch (e) {}
    }
    
    if(req.body.amenities && typeof req.body.amenities === 'string') {
        try {
            req.body.amenities = JSON.parse(req.body.amenities);
        } catch (e) {}
    }

    next();
  } catch (error) {
    next(new BadRequestError('Image upload failed'));
  }
};