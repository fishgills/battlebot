import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConvoStore1645339492380 implements MigrationInterface {
  name = 'AddConvoStore1645339492380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`convo_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`convoId\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, \`expiresAt\` int NOT NULL, UNIQUE INDEX \`IDX_bcf72167a9dd4f88d670f20885\` (\`convoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
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
      `DROP INDEX \`IDX_bcf72167a9dd4f88d670f20885\` ON \`convo_entity\``,
    );
    await queryRunner.query(`DROP TABLE \`convo_entity\``);
  }
}
