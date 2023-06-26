import { MigrationInterface, QueryRunner } from 'typeorm';

export class Big1687814744618 implements MigrationInterface {
  name = 'Big1687814744618';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`install_entity\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`team_id\` varchar(255) NOT NULL, \`installObj\` text NOT NULL, \`channelId\` varchar(255) NULL, \`stripeSubId\` varchar(255) NULL, \`stripeCOSId\` varchar(255) NULL, \`stripeCusId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`install_entity\``);
  }
}
