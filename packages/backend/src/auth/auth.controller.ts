import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  async getToken(@Body() body: { clientId: string; clientSecret: string }) {
    const client = await this.authService.validateClient(
      body.clientId,
      body.clientSecret,
    );
    if (!client) {
      throw new UnauthorizedException('Invalid client');
    }
    return this.authService.generateToken(client);
  }
}
