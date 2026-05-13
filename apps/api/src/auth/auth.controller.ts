import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  verify(@Body() body: { idToken: string; role?: string }) {
    return this.authService.verifyAndUpsertUser(body.idToken, body.role)
  }

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  me(@CurrentUser() user: any) {
    return user
  }
}
