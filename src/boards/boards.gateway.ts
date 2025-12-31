import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { BoardsService } from './boards.service';
import { MoveCardDto } from './dto/move-card.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BoardsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('BoardsGateway');

  constructor(private readonly boardsService: BoardsService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinBoard')
  async handleJoinBoard(
    @MessageBody() payload: { boardId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { boardId } = payload;
    await client.join(boardId);

    this.logger.log(`Client ${client.id} joined board: ${boardId}`);
    return { event: 'joined', message: `You joined board ${boardId}` };
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() payload: { boardId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(payload.boardId).emit('newMessage', {
      user: client.id,
      message: payload.message,
    });
  }

  @SubscribeMessage('moveCard')
  async handleMoveCard(
    @MessageBody() payload: MoveCardDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.to(payload.boardId).emit('cardMoved', payload);

    try {
      await this.boardsService.updateCardPosition(payload);
      this.logger.log(`Card ${payload.cardId} position saved to DB`);
    } catch (error) {
      this.logger.log(
        `Failed to save card position: ${(error as Error).message}`,
      );
      client.emit('errorMoved', {
        message: 'Gagal menyimpan posisi, refresh browser!',
      });
    }
  }
}
