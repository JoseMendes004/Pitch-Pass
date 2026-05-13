import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  UsePipes,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { randomBytes } from 'crypto'
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

const storage = diskStorage({
  destination: join(process.cwd(), 'uploads'),
  filename: (_req, file, cb) => {
    const unique = randomBytes(16).toString('hex')
    cb(null, `${unique}${extname(file.originalname)}`)
  },
})

@Controller('uploads')
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UploadsController {
  @Post('image')
  @UsePipes()
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only images allowed'), false)
        }
        cb(null, true)
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided')
    return { url: `/uploads/${file.filename}` }
  }
}
