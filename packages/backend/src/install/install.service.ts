import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from 'src/base/service';
import { InstallEntity } from './entities/install.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import { UpdateInstallDto } from './dto/update-install.dto';

@Injectable()
export class InstallService extends BaseService<InstallEntity> {
  constructor(
    @InjectRepository(InstallEntity)
    protected repo: Repository<InstallEntity>,
  ) {
    super();
    this.logger = new Logger('InstallService');
  }

  async updateByTeamId(input: Partial<InstallEntity>) {
    this.logger.debug(`Updating Team ${input.team_id}`);
    return await this.repo.update({ team_id: input.team_id }, input);
  }

  async findByTeamId(id: string) {
    this.logger.debug(`Finding ${id}`);
    return await this.repo.findOneBy({
      team_id: id,
    });
  }

  public async removeByTeamId(tid: string) {
    this.logger.debug(`Removing ${tid}`);
    const result = await this.repo.delete({
      team_id: tid,
    });
    return result.affected;
  }
}
