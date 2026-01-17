import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/login';

@Controller('customer/auth')
@Throttle({
  default: {
    limit: 5,
    ttl: 60000,
  },
})
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
