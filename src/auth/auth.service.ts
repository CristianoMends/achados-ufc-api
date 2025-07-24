import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private repo: Repository<User>,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async validateUser(email: string, password: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password as string)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginWithGoogle(idToken: string): Promise<{ access_token: string }> {
    try {

      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new UnauthorizedException('Falha na autenticação com Google.');
      }

      let user = await this.usersService.findOneByEmail(payload.email);

      if (!user) {
        user = await this.usersService.create({
          username: payload.email,
          email: payload.email,
          password: payload.sub,
          name: payload.given_name || "",
          surname: payload.family_name || "",
          phone: null,
          imageUrl: payload.picture || null,
        })
      }

      const jwtPayload = {
        sub: user.id,
        email: user.email,
      };

      const accessToken = await this.jwtService.signAsync(jwtPayload);

      return {
        access_token: accessToken,
      };
    } catch (error) {
      console.error('Erro na autenticação com Google:', error);
      throw new UnauthorizedException('Token do Google inválido ou expirado.');
    }
  }
}
