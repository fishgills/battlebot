import { MigrationInterface, QueryRunner } from 'typeorm';

export class SkillPointAdd1644899651048 implements MigrationInterface {
  name = 'SkillPointAdd1644899651048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`character_model\` ADD \`extraPoints\` int NOT NULL`,
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
      `ALTER TABLE \`character_model\` DROP COLUMN \`extraPoints\``,
    );
  }
}
