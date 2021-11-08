import { Prisma, User } from '.prisma/client';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/db/services/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: AuthCredentialsDto): Promise<User> {
    try {
      return await this.prisma.user.create({ data: dto });
    } catch {
      throw new ConflictException('Username already exists');
    }
  }
}
