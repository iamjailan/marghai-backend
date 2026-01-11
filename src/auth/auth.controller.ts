import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/login';

@Controller('customer/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    const fields = ['id', 'createdAt', 'email', 'profile_picture'];

    return this.authService.register(body, fields);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    const fields = ['id', 'createdAt', 'email', 'profile_picture', 'password'];

    return this.authService.login(body, fields);
  }
}
