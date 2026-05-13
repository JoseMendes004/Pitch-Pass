import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { CreateBookingDto, CancelBookingDto } from '@pitch-pass/types'

@Controller('bookings')
@UseGuards(FirebaseAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles('PLAYER', 'ADMIN')
  @UseGuards(RolesGuard)
  create(@CurrentUser('id') userId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(userId, dto)
  }

  @Get('mine')
  findMine(@CurrentUser('id') userId: string) {
    return this.bookingsService.findByUser(userId)
  }

  @Get('all')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  findAll() {
    return this.bookingsService.findAll()
  }

  @Get('validate/:qrCode')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  validateQr(@Param('qrCode') qrCode: string) {
    return this.bookingsService.validateQr(qrCode)
  }

  @Get('court/:courtId')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  findByCourt(@Param('courtId') courtId: string) {
    return this.bookingsService.findByCourt(courtId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findById(id)
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(id, userId, dto)
  }
}
