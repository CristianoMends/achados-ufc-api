import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ViewUserDto } from './dto/view-user.dto';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private repo: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.repo.create(createUserDto);
      user.password = await bcrypt.hash(String(user.password), 10);
      const res = await this.repo.save(user);
      return new ViewUserDto(res);
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao criar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateFcm(updateFcm: UpdateFcmTokenDto): Promise<User> {
    try {
      const user = await this.repo.findOne({ where: { id: updateFcm.userId } });

      if (!user) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      user.fcmToken = updateFcm.fcmToken;
      return await this.repo.save(user);

    } catch (e) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
  }

  async findOneByEmail(email: string): Promise<ViewUserDto | null> {
    const user = await this.repo.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    return new ViewUserDto(user);
  }

  async findAll() {
    try {
      const users = await this.repo.find();
      return users.map(user => new ViewUserDto(user));
    } catch (error) {
      throw new HttpException('Erro ao buscar os registros About', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(username: string) {
    try {
      const user = await this.repo.findOne({ where: { username } });
      if (!user) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      return new ViewUserDto(user);
    } catch (error) {
      throw new HttpException('Erro ao buscar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
