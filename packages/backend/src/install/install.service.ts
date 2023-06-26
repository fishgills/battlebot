import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service';
import { InstallEntity } from './entities/install.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdateInstallDto } from './dto/update-install.dto';

@Injectable()
export class InstallService extends BaseService<InstallEntity> {
  constructor(
    @InjectRepository(InstallEntity)
    private repo: Repository<InstallEntity>,
  ) {
    super(repo);
  }

  async updateByTeamId(input: Partial<UpdateInstallDto>) {
    return await this.repo.update({ team_id: input.team_id }, input);
  }

  async findByTeamId(id: string) {
    return await this.repo.findOneBy({
      team_id: id,
    });
  }

  // public async remove(conditions: FindOptionsWhere<InstallEntity>) {
  //   const result = await this.repo.delete(conditions);
  //   return result.affected;
  // }
}
