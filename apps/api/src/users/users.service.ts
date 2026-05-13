import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto, UpdateUserDto } from '@pitch-pass/types'
import { Role } from '../generated/prisma-client'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(dto: CreateUserDto & { role?: string }) {
    return this.prisma.user.upsert({
      where: { firebaseUid: dto.firebaseUid },
      create: {
        firebaseUid: dto.firebaseUid,
        email: dto.email,
        displayName: dto.displayName,
        avatarUrl: dto.avatarUrl,
        role: (dto.role as Role) ?? Role.PLAYER,
      },
      update: {
        displayName: dto.displayName,
        avatarUrl: dto.avatarUrl,
      },
    })
  }

  async findByFirebaseUid(firebaseUid: string) {
    return this.prisma.user.findUnique({ where: { firebaseUid } })
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async findAll() {
    return this.prisma.user.findMany({ where: { isActive: true } })
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    })
  }

  async deactivate(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    })
  }
}
