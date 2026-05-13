import { Module } from '@nestjs/common'
import { CourtsController } from './courts.controller'
import { CourtsService } from './courts.service'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [UsersModule],
  controllers: [CourtsController],
  providers: [CourtsService],
  exports: [CourtsService],
})
export class CourtsModule {}
