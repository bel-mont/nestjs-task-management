import { User } from '.prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(dto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.create(dto);
  }

  async signIn(dto: AuthCredentialsDto): Promise<string> {
    const { username, password } = dto;
    const user = await this.userRepository.findOne({ username });
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (user && passwordMatches) {
      return 'success';
    } else {
      throw new UnauthorizedException('Double check your credentials.');
    }
  }
}
