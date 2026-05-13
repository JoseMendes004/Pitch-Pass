import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import Redis from 'ioredis'
import {
  CourtJoinPayload,
  SlotHoldPayload,
  SlotReleasePayload,
  BookingConfirmedPayload,
  BookingCancelledPayload,
} from '@pitch-pass/types'
import { SLOT_HOLD_SECONDS } from '@pitch-pass/config'

@WebSocketGateway({
  namespace: '/bookings',
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
    credentials: true,
  },
})
export class BookingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  private redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379')

  handleConnection(client: Socket) {
    console.log(`Socket connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket disconnected: ${client.id}`)
  }

  @SubscribeMessage('court:join')
  async handleCourtJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CourtJoinPayload,
  ) {
    const room = `court:${payload.courtId}:${payload.date}`
    await client.join(room)
  }

  @SubscribeMessage('court:leave')
  async handleCourtLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { courtId: string },
  ) {
    const rooms = [...client.rooms].filter((r) => r.startsWith(`court:${payload.courtId}`))
    rooms.forEach((r) => client.leave(r))
  }

  @SubscribeMessage('slot:hold')
  async handleSlotHold(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SlotHoldPayload,
  ) {
    const key = `hold:${payload.slotId}`
    const result = await this.redis.set(key, payload.userId, 'EX', SLOT_HOLD_SECONDS, 'NX')

    if (!result) {
      client.emit('error', { code: 'SLOT_HELD', message: 'Slot is already being reserved' })
      return
    }

    const expiresAt = new Date(Date.now() + SLOT_HOLD_SECONDS * 1000).toISOString()

    this.server.to(`court:${payload.slotId}`).emit('slot:updated', {
      slotId: payload.slotId,
      courtId: '',
      status: 'BOOKED',
      heldBy: payload.userId,
      expiresAt,
    })

    setTimeout(async () => {
      const holder = await this.redis.get(key)
      if (holder === payload.userId) {
        await this.redis.del(key)
        client.emit('slot:hold-expired', { slotId: payload.slotId })
      }
    }, SLOT_HOLD_SECONDS * 1000)
  }

  @SubscribeMessage('slot:release')
  async handleSlotRelease(
    @ConnectedSocket() _client: Socket,
    @MessageBody() payload: SlotReleasePayload,
  ) {
    await this.redis.del(`hold:${payload.slotId}`)
  }

  emitBookingConfirmed(payload: BookingConfirmedPayload) {
    const dateStr = new Date().toISOString().split('T')[0]
    this.server.to(`court:${payload.courtId}:${dateStr}`).emit('booking:confirmed', payload)
    this.server.to(`court:${payload.courtId}:${dateStr}`).emit('slot:updated', {
      slotId: payload.slotId,
      courtId: payload.courtId,
      status: 'BOOKED',
    })
  }

  emitBookingCancelled(payload: BookingCancelledPayload) {
    const dateStr = new Date().toISOString().split('T')[0]
    this.server.to(`court:${payload.courtId}:${dateStr}`).emit('booking:cancelled', payload)
    this.server.to(`court:${payload.courtId}:${dateStr}`).emit('slot:updated', {
      slotId: payload.slotId,
      courtId: payload.courtId,
      status: 'AVAILABLE',
    })
  }
}
