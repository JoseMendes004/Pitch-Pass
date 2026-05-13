export type CourtSurface = 'GRASS' | 'ARTIFICIAL_GRASS' | 'CONCRETE' | 'FUTSAL';
export interface Court {
    id: string;
    ownerId: string;
    name: string;
    description?: string;
    address: string;
    city: string;
    latitude?: number;
    longitude?: number;
    surface: CourtSurface;
    maxPlayers: number;
    pricePerHour: string;
    imageUrls: string[];
    amenities: string[];
    isActive: boolean;
    createdAt: string;
}
export interface CreateCourtDto {
    name: string;
    description?: string;
    address: string;
    city: string;
    latitude?: number;
    longitude?: number;
    surface: CourtSurface;
    maxPlayers?: number;
    pricePerHour: number;
    imageUrls?: string[];
    amenities?: string[];
}
export interface UpdateCourtDto extends Partial<CreateCourtDto> {
}
export interface CourtFilters {
    city?: string;
    surface?: CourtSurface;
    date?: string;
    maxPrice?: number;
}
//# sourceMappingURL=court.types.d.ts.map