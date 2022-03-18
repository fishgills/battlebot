import { MigrationInterface, QueryRunner } from 'typeorm';

export class CascadeDelete1644478485821 implements MigrationInterface {
  name = 'CascadeDelete1644478485821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP FOREIGN KEY \`FK_d39c28762c707de58d423e62a2a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP FOREIGN KEY \`FK_e4798c62f491a7c2ec4dac5da13\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`session_model\` CHANGE \`expiresAt\` \`expiresAt\` timestamp NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD CONSTRAINT \`FK_d39c28762c707de58d423e62a2a\` FOREIGN KEY (\`attacker_id\`) REFERENCES \`character_model\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD CONSTRAINT \`FK_e4798c62f491a7c2ec4dac5da13\` FOREIGN KEY (\`defender_id\`) REFERENCES \`character_model\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP FOREIGN KEY \`FK_e4798c62f491a7c2ec4dac5da13\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP FOREIGN KEY \`FK_d39c28762c707de58d423e62a2a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`session_model\` CHANGE \`expiresAt\` \`expiresAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD CONSTRAINT \`FK_e4798c62f491a7c2ec4dac5da13\` FOREIGN KEY (\`defender_id\`) REFERENCES \`character_model\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD CONSTRAINT \`FK_d39c28762c707de58d423e62a2a\` FOREIGN KEY (\`attacker_id\`) REFERENCES \`character_model\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
