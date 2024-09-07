import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(Client)
    protected clientRepository: Repository<Client>,
    private jwtService: JwtService,
  ) {}

  async validateClient(clientId: string, clientSecret: string) {
    const client = await this.clientRepository.findOne({
      where: { clientId },
    });
    if (!client) {
      this.logger.warn(`Client not found: ${clientId}`);
      return null;
    }

    if (client.clientSecret !== clientSecret) {
      this.logger.warn(`Invalid client secret for ID: ${clientId}`);
      return null;
    }

    this.logger.log(`Client validated: ${clientId}`);

    return client;
  }

  async generateToken(client: Client) {
    const payload = { clientId: client.clientId, name: client.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
