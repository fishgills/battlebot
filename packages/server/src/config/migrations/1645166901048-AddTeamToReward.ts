import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTeamToReward1645166901048 implements MigrationInterface {
  name = 'AddTeamToReward1645166901048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reward_model\` ADD \`teamId\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`session_model\` CHANGE \`expiresAt\` \`expiresAt\` timestamp NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`session_model\` CHANGE \`expiresAt\` \`expiresAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reward_model\` DROP COLUMN \`teamId\``,
    );
  }
}
