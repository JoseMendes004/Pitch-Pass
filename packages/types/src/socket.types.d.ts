import type { SlotStatus } from './booking.types';
export interface CourtJoinPayload {
    courtId: string;
    date: string;
}
export interface SlotHoldPayload {
    slotId: string;
    userId: string;
}
export interface SlotReleasePayload {
    slotId: string;
}
export interface SlotUpdatedPayload {
    slotId: string;
    courtId: string;
    status: SlotStatus;
    heldBy?: string;
    expiresAt?: string;
}
export interface BookingConfirmedPayload {
    bookingId: string;
    slotId: string;
    courtId: string;
}
export interface BookingCancelledPayload {
    slotId: string;
    courtId: string;
}
export interface SlotHoldExpiredPayload {
    slotId: string;
}
export interface SocketErrorPayload {
    code: string;
    message: string;
}
export interface ServerToClientEvents {
    'slot:updated': (payload: SlotUpdatedPayload) => void;
    'booking:confirmed': (payload: BookingConfirmedPayload) => void;
    'booking:cancelled': (payload: BookingCancelledPayload) => void;
    'slot:hold-expired': (payload: SlotHoldExpiredPayload) => void;
    error: (payload: SocketErrorPayload) => void;
}
export interface ClientToServerEvents {
    'court:join': (payload: CourtJoinPayload) => void;
    'court:leave': (payload: {
        courtId: string;
    }) => void;
    'slot:hold': (payload: SlotHoldPayload) => void;
    'slot:release': (payload: SlotReleasePayload) => void;
}
//# sourceMappingURL=socket.types.d.ts.map