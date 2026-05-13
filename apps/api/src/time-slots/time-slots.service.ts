import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { GenerateSlotsDto } from '@pitch-pass/types'
import {
  SLOT_DURATION_MINUTES,
  DEFAULT_SLOTS_START_HOUR,
  DEFAULT_SLOTS_END_HOUR,
} from '@pitch-pass/config'

@Injectable()
export class TimeSlotsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByCourtAndDate(courtId: string, date: string) {
    const start = new Date(`${date}T00:00:00.000Z`)
    const end = new Date(`${date}T23:59:59.999Z`)

    return this.prisma.timeSlot.findMany({
      where: {
        courtId,
        startsAt: { gte: start, lte: end },
      },
      include: {
        booking: {
          select: { id: true, userId: true, status: true },
        },
      },
      orderBy: { startsAt: 'asc' },
    })
  }

  async generateSlots(courtId: string, dto: GenerateSlotsDto) {
    const court = await this.prisma.court.findUnique({ where: { id: courtId } })
    if (!court) throw new NotFoundException('Court not found')

    const startHour = dto.startHour ?? DEFAULT_SLOTS_START_HOUR
    const endHour = dto.endHour ?? DEFAULT_SLOTS_END_HOUR
    const date = dto.date

    const slots: { courtId: string; startsAt: Date; endsAt: Date }[] = []
    let hour = startHour

    while (hour < endHour) {
      const startsAt = new Date(`${date}T${String(hour).padStart(2, '0')}:00:00.000Z`)
      const endsAt = new Date(startsAt.getTime() + SLOT_DURATION_MINUTES * 60 * 1000)
      slots.push({ courtId, startsAt, endsAt })
      hour++
    }

    await this.prisma.timeSlot.createMany({
      data: slots,
      skipDuplicates: true,
    })

    return this.findByCourtAndDate(courtId, date)
  }

  async updateStatus(
    slotId: string,
    status: 'AVAILABLE' | 'BLOCKED' | 'MAINTENANCE',
  ) {
    return this.prisma.timeSlot.update({
      where: { id: slotId },
      data: { status },
    })
  }

  async delete(slotId: string) {
    return this.prisma.timeSlot.delete({ where: { id: slotId } })
  }

  async deleteByCourtAndDate(courtId: string, date: string) {
    const start = new Date(`${date}T00:00:00.000Z`)
    const end = new Date(`${date}T23:59:59.999Z`)
    return this.prisma.timeSlot.deleteMany({
      where: {
        courtId,
        startsAt: { gte: start, lte: end },
        status: { not: 'BOOKED' },
      },
    })
  }
}
