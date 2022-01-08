import { CreateSlackInstallInput } from './create-install.dto';
import { SlackInstallModel } from './install.model';
import { SlackInstallService } from './install.service';
import { UpdateSlackInstallInput } from './update-install.dto';
export declare class SlackInstallResolver {
    readonly service: SlackInstallService;
    constructor(service: SlackInstallService);
    installs(): Promise<SlackInstallModel[]>;
    install(team_id: string): Promise<SlackInstallModel>;
    createInstall(input: CreateSlackInstallInput): Promise<SlackInstallModel>;
    updateInstall(input: UpdateSlackInstallInput): Promise<SlackInstallModel>;
    removeInstall(team_id: string): Promise<string | null>;
}
