import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({ type: CreateUserDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the authenticated user' })
  @ApiResponse({ status: 200, description: 'User retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('me')
  findMe(@Req() req: any) {
    const userId = req.user.id;
    return this.usersService.findOne(userId);
  }

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update the authenticated user' })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: UpdateUserDto })
  @Patch('me')
  update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return this.usersService.update(userId, updateUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete the authenticated user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete('me')
  remove(@Req() req: any) {
    const userId = req.user.id;
    return this.usersService.remove(userId);
  }
}
