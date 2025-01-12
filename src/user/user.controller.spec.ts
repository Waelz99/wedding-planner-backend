import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as dotenv from 'dotenv';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserExposed } from './models/user.exposed';
import { UpdateUserDto } from './dto/update-user.dto';
dotenv.config();

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

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
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return created user exposed', async () => {
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

      mockUserService.create.mockReturnValue(userExposed);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(userExposed);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findMe', () => {
    it('should return requested user exposed', async () => {
      const mockReq = { user: { id: '123' } };

      const existingUser: User = {
        id: '123',
        username: 'testUser',
        email: 'testEmail@example.com',
        password_hash: 'hashedPassword',
        isActive: false,
        createdAt: undefined,
        updatedAt: undefined,
      };
      const existingUserExposed: UserExposed =
        UserExposed.FromUser(existingUser);

      mockUserService.findOne.mockReturnValue(existingUserExposed);
      const result = await controller.findMe(mockReq);

      expect(result).toEqual(existingUserExposed);
      expect(mockUserService.findOne).toHaveBeenCalledWith(mockReq.user.id);
    });
  });

  describe('update', () => {
    it('should return updated user exposed', async () => {
      const mockReq = { user: { id: '123' } };

      const updateUserDto: UpdateUserDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };
      const passwordHash = 'hashedPassword';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...passwordLessDto } = updateUserDto;
      const updatedUser = { ...passwordLessDto, password_hash: passwordHash };
      const userExposed = UserExposed.FromUser(updatedUser as unknown as User);

      mockUserService.update.mockReturnValue(userExposed);

      const result = await controller.update(mockReq, updateUserDto);
      expect(result).toEqual(userExposed);
      expect(mockUserService.update).toHaveBeenCalledWith(
        mockReq.user.id,
        updateUserDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      const mockReq = { user: { id: '123' } };

      await controller.remove(mockReq);
      expect(mockUserService.remove).toHaveBeenCalledWith(mockReq.user.id);
    });
  });
});
