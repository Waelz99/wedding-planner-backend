import { Controller } from '@nestjs/common';
import { TodoListService } from './todo-list.service';

@Controller('todo-list')
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) {}
}
