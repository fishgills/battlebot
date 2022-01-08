import { Repository } from 'typeorm';
import { CreateSlackInstallInput } from './create-install.dto';
import { SlackInstallModel } from './install.model';
import { UpdateSlackInstallInput } from './update-install.dto';
export declare class SlackInstallService {
    readonly slackRepo: Repository<SlackInstallModel>;
    constructor(slackRepo: Repository<SlackInstallModel>);
    findAll(): Promise<SlackInstallModel[]>;
    findOne(team_id: string): Promise<SlackInstallModel>;
    createInstall(input: CreateSlackInstallInput): Promise<import("typeorm").InsertResult>;
    update(input: UpdateSlackInstallInput): Promise<SlackInstallModel>;
    deleteInstall(team_id: string): Promise<string | null>;
}
