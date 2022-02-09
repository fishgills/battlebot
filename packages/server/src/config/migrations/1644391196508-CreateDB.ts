import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDB1644391196508 implements MigrationInterface {
  name = 'CreateDB1644391196508';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`session_model\` (\`id\` varchar(255) NOT NULL, \`expiresAt\` timestamp NOT NULL, \`data\` json NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`combat_model\` (\`id\` varchar(36) NOT NULL, \`attacker_id\` varchar(255) NOT NULL, \`defender_id\` varchar(255) NOT NULL, \`log\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`character_model\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`owner\` varchar(255) NOT NULL, \`strength\` int NOT NULL DEFAULT '0', \`defense\` int NOT NULL DEFAULT '0', \`vitality\` int NOT NULL DEFAULT '0', \`level\` int NOT NULL DEFAULT '1', \`xp\` int NOT NULL DEFAULT '0', \`hp\` int NOT NULL DEFAULT '0', \`rolls\` int NOT NULL DEFAULT '0', \`gold\` int NOT NULL DEFAULT '0', \`teamId\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_ec45653c1eaae11a121cec5d10\` (\`owner\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`slack_install_model\` (\`id\` int NOT NULL AUTO_INCREMENT, \`team_id\` varchar(255) NOT NULL, \`installObj\` json NOT NULL, \`channelId\` varchar(255) NULL, UNIQUE INDEX \`IDX_d03106a44e1a5c3cf4457ce905\` (\`team_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`reward_model\` (\`id\` varchar(36) NOT NULL, \`to\` varchar(255) NOT NULL, \`from\` varchar(255) NOT NULL, \`value\` int NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD CONSTRAINT \`FK_d39c28762c707de58d423e62a2a\` FOREIGN KEY (\`attacker_id\`) REFERENCES \`character_model\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD CONSTRAINT \`FK_e4798c62f491a7c2ec4dac5da13\` FOREIGN KEY (\`defender_id\`) REFERENCES \`character_model\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE \`query-result-cache\` (\`id\` int NOT NULL AUTO_INCREMENT, \`identifier\` varchar(255) NULL, \`time\` bigint NOT NULL, \`duration\` int NOT NULL, \`query\` text NOT NULL, \`result\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`query-result-cache\``);
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP FOREIGN KEY \`FK_e4798c62f491a7c2ec4dac5da13\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP FOREIGN KEY \`FK_d39c28762c707de58d423e62a2a\``,
    );
    await queryRunner.query(`DROP TABLE \`reward_model\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d03106a44e1a5c3cf4457ce905\` ON \`slack_install_model\``,
    );
    await queryRunner.query(`DROP TABLE \`slack_install_model\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_ec45653c1eaae11a121cec5d10\` ON \`character_model\``,
    );
    await queryRunner.query(`DROP TABLE \`character_model\``);
    await queryRunner.query(`DROP TABLE \`combat_model\``);
    await queryRunner.query(`DROP TABLE \`session_model\``);
  }
}
