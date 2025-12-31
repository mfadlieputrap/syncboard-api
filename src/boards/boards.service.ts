import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
// import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MoveCardDto } from './dto/move-card.dto';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBoardDto: CreateBoardDto) {
    return this.prisma.board.create({
      data: {
        title: createBoardDto.title,
        columns: {
          create: [
            { title: 'To Do', order: 1 },
            { title: 'In Progress', order: 2 },
            { title: 'Done', order: 3 },
          ],
        },
      },
      include: { columns: true },
    });
  }

  findAll() {
    return `This action returns all boards`;
  }

  async findOne(id: string) {
    return this.prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          include: { cards: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async updateCardPosition(payload: MoveCardDto) {
    const { cardId, columnId, newOrder } = payload;
    return this.prisma.card.update({
      where: { id: cardId },
      data: {
        columnId: columnId,
        order: newOrder,
      },
    });
  }

  // update(id: number, updateBoardDto: UpdateBoardDto) {
  //   return `This action updates a #${id} board`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} board`;
  // }
}
