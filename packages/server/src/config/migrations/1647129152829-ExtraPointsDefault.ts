import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtraPointsDefault1647129152829 implements MigrationInterface {
  name = 'ExtraPointsDefault1647129152829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`session_model\` CHANGE \`expiresAt\` \`expiresAt\` timestamp NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`character_model\` CHANGE \`extraPoints\` \`extraPoints\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`character_model\` CHANGE \`extraPoints\` \`extraPoints\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`session_model\` CHANGE \`expiresAt\` \`expiresAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    );
  }
}
