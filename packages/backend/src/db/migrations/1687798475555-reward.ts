import { MigrationInterface, QueryRunner } from 'typeorm';

export class Reward1687798475555 implements MigrationInterface {
  name = 'Reward1687798475555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`reward_model\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`destination\` varchar(255) NOT NULL, \`source\` varchar(255) NOT NULL, \`teamId\` varchar(255) NOT NULL, \`value\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`reward_model\``);
  }
}
