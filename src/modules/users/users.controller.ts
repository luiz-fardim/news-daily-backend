import { Controller, Get, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/guards/roles/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/browser';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { CurrentUser } from 'src/guards/roles/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number, 
    @CurrentUser('id') requestUserId: string
  ) {
    return this.usersService.findOne(id, Number(requestUserId));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @CurrentUser('id') requestUserId: string,
    @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto, Number(requestUserId));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') requestUserId: string  
  ) {
    return this.usersService.remove(id, Number(requestUserId));
  }
}
