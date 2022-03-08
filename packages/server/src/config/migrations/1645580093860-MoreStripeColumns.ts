import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoreStripeColumns1645580093860 implements MigrationInterface {
  name = 'MoreStripeColumns1645580093860';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`slack_install_model\` ADD \`stripeCOSId\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`slack_install_model\` ADD \`stripeCusId\` varchar(255) NULL`,
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
      `ALTER TABLE \`slack_install_model\` DROP COLUMN \`stripeCusId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`slack_install_model\` DROP COLUMN \`stripeCOSId\``,
    );
  }
}
