import { Module } from '@nestjs/common';
import { WeddingModule } from './wedding/wedding.module';
import { UserModule } from './user/user.module';
import { TodoListModule } from './todo-list/todo-list.module';
import { BudgetModule } from './budget/budget.module';
import { EventModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    WeddingModule,
    UserModule,
    TodoListModule,
    BudgetModule,
    EventModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
