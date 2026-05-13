"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COURT_SURFACE = exports.SLOT_STATUS = exports.BOOKING_STATUS = exports.ROLES = exports.DEFAULT_SLOTS_END_HOUR = exports.DEFAULT_SLOTS_START_HOUR = exports.SLOT_HOLD_SECONDS = exports.SLOT_DURATION_MINUTES = void 0;
exports.SLOT_DURATION_MINUTES = 60;
exports.SLOT_HOLD_SECONDS = 90;
exports.DEFAULT_SLOTS_START_HOUR = 7;
exports.DEFAULT_SLOTS_END_HOUR = 23;
exports.ROLES = {
    PLAYER: 'PLAYER',
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
};
exports.BOOKING_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED',
    NO_SHOW: 'NO_SHOW',
};
exports.SLOT_STATUS = {
    AVAILABLE: 'AVAILABLE',
    BOOKED: 'BOOKED',
    BLOCKED: 'BLOCKED',
    MAINTENANCE: 'MAINTENANCE',
};
exports.COURT_SURFACE = {
    GRASS: 'GRASS',
    ARTIFICIAL_GRASS: 'ARTIFICIAL_GRASS',
    CONCRETE: 'CONCRETE',
    FUTSAL: 'FUTSAL',
};
//# sourceMappingURL=constants.js.map