export type UserRole = 'PLAYER' | 'OWNER' | 'ADMIN';
export interface UserProfile {
    id: string;
    firebaseUid: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    phone?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
}
export interface CreateUserDto {
    firebaseUid: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    role?: UserRole;
}
export interface UpdateUserDto {
    displayName?: string;
    avatarUrl?: string;
    phone?: string;
}
//# sourceMappingURL=user.types.d.ts.map