import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStripeID1645515090122 implements MigrationInterface {
  name = 'AddStripeID1645515090122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`slack_install_model\` ADD \`stripeId\` varchar(255) NULL`,
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
      `ALTER TABLE \`slack_install_model\` DROP COLUMN \`stripeId\``,
    );
  }
}
