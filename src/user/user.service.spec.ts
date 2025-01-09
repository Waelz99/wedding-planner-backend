import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserExposed } from './models/user.exposed';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UserService', () => {
  let userService: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };
      const passwordHash = 'hashedPassword';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...passwordLessDto } = createUserDto;
      const savedUser = { ...passwordLessDto, password_hash: passwordHash };
      const userExposed = UserExposed.FromUser(savedUser as unknown as User);

      // Mock bcrypt.hash and repository methods
      (bcrypt.hash as jest.Mock).mockResolvedValue(passwordHash);
      mockUserRepository.create.mockReturnValue(savedUser);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await userService.create(createUserDto);
      expect(result).toEqual(userExposed);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...passwordLessDto,
        password_hash: passwordHash,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(savedUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: '1',
          email: 'test1@example.com',
          username: 'testuser1',
          password_hash: 'hash1',
        },
        {
          id: '2',
          email: 'test2@example.com',
          username: 'testuser2',
          password_hash: 'hash2',
        },
      ];
      const userExposedArray = users.map((user) =>
        UserExposed.FromUser(user as unknown as User),
      );

      mockUserRepository.find.mockResolvedValue(users);

      const result = await userService.findAll();
      expect(result).toEqual(userExposedArray);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        password_hash: 'hashedPassword',
      };
      const userExposed = UserExposed.FromUser(user as unknown as User);

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.findOne('1');
      expect(result).toEqual(userExposed);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };
      const updatedUser = {
        id: '1',
        email: 'updated@example.com',
        username: 'testuser',
        password_hash: 'newHash',
      };
      const userExposed = UserExposed.FromUser(updatedUser as unknown as User);

      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue(updatedUser);

      const result = await userService.update('1', updateUserDto);
      expect(result).toEqual(userExposed);
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        '1',
        updateUserDto,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const userId = '1';

      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await userService.remove(userId);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });
  });
});
