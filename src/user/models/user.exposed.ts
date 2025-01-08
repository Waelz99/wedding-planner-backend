import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserExposed extends OmitType(User, ['password_hash'] as const) {
  static FromUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...exposedUser } = user;
    return exposedUser as UserExposed;
  }

  static FromUsers(users: User[]) {
    const usersExposed = [];
    users.forEach((user) => {
      usersExposed.push(UserExposed.FromUser(user));
    });

    return usersExposed;
  }
}
