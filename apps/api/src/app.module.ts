import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { CourtsModule } from './courts/courts.module'
import { TimeSlotsModule } from './time-slots/time-slots.module'
import { BookingsModule } from './bookings/bookings.module'
import { GatewayModule } from './gateway/gateway.module'
import { UploadsModule } from './uploads/uploads.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CourtsModule,
    TimeSlotsModule,
    BookingsModule,
    GatewayModule,
    UploadsModule,
  ],
})
export class AppModule {}
