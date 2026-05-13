import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CourtsService } from './courts.service'
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { CreateCourtDto, UpdateCourtDto, CourtFilters } from '@pitch-pass/types'

@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Get()
  findAll(@Query() filters: CourtFilters) {
    return this.courtsService.findAll(filters)
  }

  @Get('owner/mine')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findMine() {
    return this.courtsService.findAll_admin()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courtsService.findById(id)
  }

  @Post()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@CurrentUser('id') adminId: string, @Body() dto: CreateCourtDto) {
    return this.courtsService.create(adminId, dto)
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateCourtDto) {
    return this.courtsService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.courtsService.remove(id)
  }
}
