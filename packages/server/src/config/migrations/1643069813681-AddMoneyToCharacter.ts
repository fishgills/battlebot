import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoneyToCharacter1643069813681 implements MigrationInterface {
  name = 'AddMoneyToCharacter1643069813681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`character_model\` ADD \`gold\` int NOT NULL`,
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
      `ALTER TABLE \`character_model\` DROP COLUMN \`gold\``,
    );
  }
}
