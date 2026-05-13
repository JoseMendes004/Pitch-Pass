import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { UploadsController } from './uploads.controller'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [MulterModule, UsersModule],
  controllers: [UploadsController],
})
export class UploadsModule {}
