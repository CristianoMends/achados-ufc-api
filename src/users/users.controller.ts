import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto';
import { ViewUserDto } from './dto/view-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);

    return await this.usersService.create(createUserDto);
  }

  @Post("fcm")
  async updateFcm(
    @Body() updateFcm: UpdateFcmTokenDto
  ) {
    console.log('recebendo');
    console.table(updateFcm);
    const user = this.usersService.updateFcm(updateFcm);
    const dto = new ViewUserDto(await user);

    console.log('passando')
    console.table(dto);
    return dto;
  }

  @Get('search')
  findByEmail(
    @Query('email') email: string,
  ) {
    return this.usersService.findOneByEmail(email);
  }


  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  findOneByUsername(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
