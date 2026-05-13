import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, BadRequestException } from '@nestjs/common'
import { TimeSlotsService } from './time-slots.service'
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { GenerateSlotsDto } from '@pitch-pass/types'

@Controller('courts/:courtId/slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Get()
  findAll(@Param('courtId') courtId: string, @Query('date') date: string) {
    return this.timeSlotsService.findByCourtAndDate(courtId, date ?? new Date().toISOString().split('T')[0])
  }

  @Post('generate')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN')
  generate(@Param('courtId') courtId: string, @Body() dto: GenerateSlotsDto) {
    return this.timeSlotsService.generateSlots(courtId, dto)
  }

  @Patch(':slotId')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStatus(
    @Param('slotId') slotId: string,
    @Body('status') status: 'AVAILABLE' | 'BLOCKED' | 'MAINTENANCE',
  ) {
    return this.timeSlotsService.updateStatus(slotId, status)
  }

  @Delete()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteByDate(
    @Param('courtId') courtId: string,
    @Query('date') date: string,
  ) {
    if (!date) throw new BadRequestException('date query param required')
    return this.timeSlotsService.deleteByCourtAndDate(courtId, date)
  }

  @Delete(':slotId')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN')
  delete(@Param('slotId') slotId: string) {
    return this.timeSlotsService.delete(slotId)
  }
}
