import { Prisma, User } from '.prisma/client';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/services/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: AuthCredentialsDto): Promise<User> {
    try {
      const { username, password } = dto;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      return await this.prisma.user.create({
        data: { username, password: hashedPassword },
      });
    } catch {
      throw new ConflictException('Username already exists');
    }
  }

  async findOne(where: Prisma.UserWhereInput): Promise<User> {
    return this.prisma.user.findFirst({ where });
  }
}
