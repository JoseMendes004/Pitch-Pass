import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { BookingGateway } from '../gateway/booking.gateway'
import { CreateBookingDto, CancelBookingDto } from '@pitch-pass/types'
import { Prisma } from '../generated/prisma-client'
import { randomBytes } from 'crypto'

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: BookingGateway,
  ) {}

  async create(userId: string, dto: CreateBookingDto) {
    const booking = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const slot = await tx.timeSlot.findUnique({
        where: { id: dto.timeSlotId },
        include: { court: true },
      })

      if (!slot) throw new NotFoundException('Time slot not found')
      if (slot.status !== 'AVAILABLE') throw new ConflictException('Slot not available')

      await tx.timeSlot.update({
        where: { id: slot.id },
        data: { status: 'BOOKED' },
      })

      const price = slot.priceOverride ?? slot.court.pricePerHour
      const qrCode = randomBytes(16).toString('hex')

      return tx.booking.create({
        data: {
          userId,
          timeSlotId: slot.id,
          totalAmount: price,
          notes: dto.notes,
          status: 'CONFIRMED',
          confirmedAt: new Date(),
          qrCode,
        },
        include: { timeSlot: { include: { court: true } } },
      })
    })

    const courtId = booking.timeSlot.courtId
    this.gateway.emitBookingConfirmed({
      bookingId: booking.id,
      slotId: dto.timeSlotId,
      courtId,
    })

    return booking
  }

  async findByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { timeSlot: { include: { court: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { timeSlot: { include: { court: true } }, user: true },
    })
    if (!booking) throw new NotFoundException('Booking not found')
    return booking
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        timeSlot: { include: { court: true } },
        user: { select: { id: true, displayName: true, email: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findByCourt(courtId: string) {
    return this.prisma.booking.findMany({
      where: { timeSlot: { courtId } },
      include: { timeSlot: true, user: { select: { id: true, displayName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async cancel(id: string, userId: string, dto?: CancelBookingDto) {
    const booking = await this.findById(id)

    if (booking.userId !== userId) throw new ForbiddenException('Not your booking')
    if (booking.status === 'CANCELLED') throw new ConflictException('Already cancelled')

    const updated = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.timeSlot.update({
        where: { id: booking.timeSlotId },
        data: { status: 'AVAILABLE' },
      })

      return tx.booking.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: dto?.reason,
        },
        include: { timeSlot: { include: { court: true } } },
      })
    })

    this.gateway.emitBookingCancelled({
      slotId: booking.timeSlotId,
      courtId: booking.timeSlot.courtId,
    })

    return updated
  }

  async validateQr(qrCode: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { qrCode },
      include: { user: true, timeSlot: { include: { court: true } } },
    })
    if (!booking) throw new NotFoundException('Invalid QR code')
    return booking
  }
}
