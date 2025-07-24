import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

  ) { }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('google')
  async loginWithGoogle(@Body() googleLogin: GoogleLoginDto) {
    return this.authService.loginWithGoogle(googleLogin.idToken);
  }

}
