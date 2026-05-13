import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import * as admin from 'firebase-admin'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async verifyAndUpsertUser(idToken: string, role?: string) {
    let decoded: admin.auth.DecodedIdToken

    try {
      decoded = await admin.auth().verifyIdToken(idToken)
    } catch {
      throw new UnauthorizedException('Invalid Firebase token')
    }

    const user = await this.usersService.upsert({
      firebaseUid: decoded.uid,
      email: decoded.email ?? '',
      displayName: decoded.name ?? decoded.email ?? 'User',
      avatarUrl: decoded.picture,
      role: (role as any) ?? 'PLAYER',
    })

    return user
  }
}
