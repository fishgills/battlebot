import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service';
import { InstallEntity } from './entities/install.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateInstallDto } from './dto/create-install.dto';
// import { UpdateInstallDto } from './dto/update-install.dto';

@Injectable()
export class InstallService extends BaseService<InstallEntity> {
  constructor(
    @InjectRepository(InstallEntity)
    repo: Repository<InstallEntity>,
  ) {
    super(repo);
  }

  async updateByTeamId(input: Partial<InstallEntity>) {
    return await this.repo.update({ team_id: input.team_id }, input);
  }

  async findByTeamId(id: string) {
    return await this.repo.findOneBy({
      team_id: id,
    });
  }

  public async removeByTeamId(tid: string) {
    const result = await this.repo.delete({
      team_id: tid,
    });
    return result.affected;
  }
}
