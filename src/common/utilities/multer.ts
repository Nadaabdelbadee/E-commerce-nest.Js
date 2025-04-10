import { diskStorage } from "multer"
import { Express, Request } from "express"
import { BadRequestException } from "@nestjs/common"

interface MulterOptions {
    allowedExtenstions: string[]
}

export const multerCloud = ({ allowedExtenstions }) => {
    const storage = diskStorage({})
    const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
        if (!allowedExtenstions) {
            return cb(new BadRequestException("only image files are allowed"))
        }
        cb(null, true)
    }
    return { storage, fileFilter }
}