import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  private logger: Logger = new Logger(WsJwtAuthGuard.name);

  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {

      const client: Socket = context.switchToWs().getClient<Socket>();
      let authToken: string | null = null;

      const authHeader = client.handshake.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.split(' ')[1];
        this.logger.debug('Token encontrado no handshake.headers.authorization');
      }
      else if (client.handshake.auth && client.handshake.auth.token) {
        authToken = client.handshake.auth.token;
        this.logger.debug('Token encontrado no handshake.auth');
      }
      else if (client.handshake.query && client.handshake.query.token) {
        authToken = client.handshake.query.token as string;
        this.logger.debug('Token encontrado no handshake.query');
      }

      if (!authToken) {
        this.logger.warn('Token não encontrado no handshake do WebSocket.');
        return false;
      }

      const payload = await this.jwtService.verifyAsync(authToken, {
        secret: process.env.JWT_SECRET,
      });

      client.data.user = payload;

      return true;

    } catch (err) {
      this.logger.error('Erro na autenticação do WebSocket', err.message);
      const client: Socket = context.switchToWs().getClient<Socket>();
      client.emit('unauthorized', { message: 'Token inválido ou expirado.' });
      client.disconnect();
      return false;
    }
  }
}