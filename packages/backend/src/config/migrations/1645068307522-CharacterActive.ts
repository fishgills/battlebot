import { MigrationInterface, QueryRunner } from 'typeorm';

export class CharacterActive1645068307522 implements MigrationInterface {
  name = 'CharacterActive1645068307522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`character_model\` ADD \`active\` tinyint NOT NULL DEFAULT 0`,
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
      `ALTER TABLE \`character_model\` DROP COLUMN \`active\``,
    );
  }
}
