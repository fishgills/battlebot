import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServerUsers1646329176832 implements MigrationInterface {
  name = 'ServerUsers1646329176832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_entity\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('web', 'bot') NOT NULL DEFAULT 'web', UNIQUE INDEX \`IDX_9b998bada7cff93fcb953b0c37\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
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
      `DROP INDEX \`IDX_9b998bada7cff93fcb953b0c37\` ON \`user_entity\``,
    );
    await queryRunner.query(`DROP TABLE \`user_entity\``);
  }
}
