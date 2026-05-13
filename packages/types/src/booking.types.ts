export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'MAINTENANCE'

export interface TimeSlot {
  id: string
  courtId: string
  startsAt: string
  endsAt: string
  status: SlotStatus
  priceOverride?: string
  booking?: BookingRef
}

export interface BookingRef {
  id: string
  userId: string
  status: BookingStatus
}

export interface Booking {
  id: string
  userId: string
  timeSlotId: string
  status: BookingStatus
  totalAmount: string
  notes?: string
  qrCode?: string
  confirmedAt?: string
  cancelledAt?: string
  cancelReason?: string
  createdAt: string
  timeSlot?: TimeSlot
}

export interface CreateBookingDto {
  timeSlotId: string
  notes?: string
}

export interface CancelBookingDto {
  reason?: string
}

export interface GenerateSlotsDto {
  date: string
  startHour?: number
  endHour?: number
}
