import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserExposed } from './models/user.exposed';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserExposed> {
    const { password, ...rest } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      ...rest,
      password_hash: passwordHash,
    });

    return UserExposed.FromUser(await this.userRepository.save(user));
  }

  async findAll(): Promise<UserExposed[]> {
    const users = await this.userRepository.find();
    return UserExposed.FromUsers(users);
  }

  async findOne(id: string): Promise<UserExposed> {
    return UserExposed.FromUser(
      await this.userRepository.findOne({ where: { id } }),
    );
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserExposed> {
    await this.userRepository.update(id, updateUserDto);
    return UserExposed.FromUser(
      await this.userRepository.findOne({ where: { id } }),
    );
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
