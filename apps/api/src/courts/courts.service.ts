import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCourtDto, UpdateCourtDto, CourtFilters } from '@pitch-pass/types'

@Injectable()
export class CourtsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(adminId: string, dto: CreateCourtDto) {
    return this.prisma.court.create({
      data: {
        ownerId: adminId,
        ...dto,
        pricePerHour: dto.pricePerHour,
      },
    })
  }

  async findAll(filters?: CourtFilters) {
    return this.prisma.court.findMany({
      where: {
        isActive: true,
        ...(filters?.city && { city: { contains: filters.city, mode: 'insensitive' } }),
        ...(filters?.surface && { surface: filters.surface }),
        ...(filters?.maxPrice && { pricePerHour: { lte: filters.maxPrice } }),
      },
      include: { owner: { select: { id: true, displayName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    const court = await this.prisma.court.findUnique({
      where: { id },
      include: { owner: { select: { id: true, displayName: true, avatarUrl: true } } },
    })
    if (!court) throw new NotFoundException('Court not found')
    return court
  }

  async findAll_admin() {
    return this.prisma.court.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  async update(id: string, dto: UpdateCourtDto) {
    const court = await this.prisma.court.findUnique({ where: { id } })
    if (!court) throw new NotFoundException('Court not found')
    return this.prisma.court.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    const court = await this.prisma.court.findUnique({ where: { id } })
    if (!court) throw new NotFoundException('Court not found')
    return this.prisma.court.delete({ where: { id } })
  }
}
