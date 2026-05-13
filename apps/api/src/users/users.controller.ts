import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { UpdateUserDto } from '@pitch-pass/types'

@Controller('users')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll()
  }

  @Get('me')
  getMe(@CurrentUser() user: any) {
    return user
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto)
  }

  @Delete(':id')
  @Roles('ADMIN')
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id)
  }
}
