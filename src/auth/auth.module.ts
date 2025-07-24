import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { WsJwtAuthGuard } from './ws-jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '30d' },
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, WsJwtAuthGuard, UsersService],
  exports: [JwtModule, WsJwtAuthGuard]
})
export class AuthModule { }
