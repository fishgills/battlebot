import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStripeSubColumn1646844483447 implements MigrationInterface {
  name = 'AddStripeSubColumn1646844483447';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`slack_install_model\` ADD \`stripeSubId\` varchar(255) NULL`,
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
      `ALTER TABLE \`slack_install_model\` DROP COLUMN \`stripeSubId\``,
    );
  }
}
