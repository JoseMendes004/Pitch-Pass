import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from '../../users/users.service'
import * as admin from 'firebase-admin'

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token')
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = await admin.auth().verifyIdToken(token)
      const user = await this.usersService.findByFirebaseUid(decoded.uid)

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive')
      }

      request.user = user
      return true
    } catch {
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
