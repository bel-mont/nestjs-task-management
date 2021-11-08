import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(dto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.create(dto);
  }
}
