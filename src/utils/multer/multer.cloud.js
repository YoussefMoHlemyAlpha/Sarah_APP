import multer from "multer";
import fs from 'fs'
import path from 'path'

export const fileTypes={
    image:[
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/webp'
    ],
    video:[
        'video/mp4',
        'video/webm'
    ]
};

export const cloudUploadFile = ({ allowedTypes = fileTypes.image } = {}) => {
    const storage = multer.diskStorage({});

    const fileFilter = (req, file, callback) => {
        if (allowedTypes.includes(file.mimetype)) {
            return callback(null, true);
        }
        const error = new Error('Invalid file type');
        error.statusCode = 400;
        return callback(error, false);
    };

    return multer({
        storage,
        fileFilter,
    });
};
