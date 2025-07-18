import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthenticatedUser } from '../chat/dto/authenticatedUser.interface'
import { PrivateMessageDto } from '../chat/dto/privateMessage.dto';



@WebSocketGateway({
  cors: {
    origin: '*', 
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');   
  private userSocketMap = new Map<number, string>();

  /**
   * Chamado quando um cliente se conecta.
   * Aqui, autenticamos o usuário e o adicionamos ao nosso mapa de rastreamento.
   */
  async handleConnection(client: Socket) {
    try {     
      
      const userId = client.handshake.query.userId as string; 
      if (!userId) {
        throw new Error('User ID não fornecido na conexão');
      }
      const user: AuthenticatedUser = { id: parseInt(userId, 10), name: `User-${userId}` };     
      
      client.data.user = user;

      
      this.userSocketMap.set(user.id, client.id);

      this.logger.log(`Cliente conectado: ${user.name} (ID: ${user.id}), Socket ID: ${client.id}`);
      this.logger.log(`Mapa de usuários atual: ${JSON.stringify(Array.from(this.userSocketMap.entries()))}`);
      
    } catch (error) {
      this.logger.error(`Autenticação de conexão falhou: ${error.message}`);
      client.disconnect();
    }
  }

  /**
   * Chamado quando um cliente se desconecta.
   * Removemos o usuário do nosso mapa de rastreamento para limpeza.
   */
  handleDisconnect(client: Socket) {
    const user: AuthenticatedUser = client.data.user;

    if (user) {
      
      this.userSocketMap.delete(user.id);
      this.logger.log(`Cliente desconectado: ${user.name} (ID: ${user.id})`);
      this.logger.log(`Mapa de usuários atual: ${JSON.stringify(Array.from(this.userSocketMap.entries()))}`);
    } else {
        this.logger.log(`Um cliente desconectado (não autenticado) com Socket ID: ${client.id}`);
    }
  }

  /**
   * Escuta por mensagens privadas enviadas de um cliente para outro.
   */
  @SubscribeMessage('sendPrivateMessage')
  handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PrivateMessageDto,
  ): void {
    const sender: AuthenticatedUser = client.data.user;
    
    
    const recipientSocketId = this.userSocketMap.get(payload.recipientId);

    this.logger.log(
        `Mensagem de ${sender.name} para o usuário ID ${payload.recipientId}. Texto: "${payload.text}"`
    );

    
    if (recipientSocketId) {
      
      
      this.server.to(recipientSocketId).emit('receivePrivateMessage', {
        senderId: sender.id,
        senderName: sender.name,
        text: payload.text,
        timestamp: new Date(),
      });
      this.logger.log(`Mensagem enviada para ${recipientSocketId} (Usuário ID: ${payload.recipientId})`);
    } else {
      
      
      this.logger.warn(
        `Destinatário com ID ${payload.recipientId} está offline. Mensagem será salva no banco.`,
      );
      
    }
  }
}