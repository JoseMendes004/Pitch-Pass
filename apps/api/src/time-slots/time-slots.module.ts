import { Module } from '@nestjs/common'
import { TimeSlotsController } from './time-slots.controller'
import { TimeSlotsService } from './time-slots.service'
import { UsersModule } from '../users/users.module'
import { CourtsModule } from '../courts/courts.module'

@Module({
  imports: [UsersModule, CourtsModule],
  controllers: [TimeSlotsController],
  providers: [TimeSlotsService],
  exports: [TimeSlotsService],
})
export class TimeSlotsModule {}
