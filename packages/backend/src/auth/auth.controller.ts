import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  async getToken(@Body() body: { client_id: string; client_secret: string }) {
    const client = await this.authService.validateClient(
      body.client_id,
      body.client_secret,
    );
    if (!client) {
      throw new UnauthorizedException('Invalid client');
    }
    return this.authService.generateToken(client);
  }
}
