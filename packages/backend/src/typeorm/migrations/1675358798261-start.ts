import { MigrationInterface, QueryRunner } from 'typeorm';

export class start1675358798261 implements MigrationInterface {
  name = 'start1675358798261';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`session_model\` (\`id\` varchar(255) NOT NULL, \`expiresAt\` timestamp NOT NULL, \`data\` json NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`character_model\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`owner\` varchar(255) NOT NULL, \`strength\` int NOT NULL DEFAULT '0', \`defense\` int NOT NULL DEFAULT '0', \`vitality\` int NOT NULL DEFAULT '0', \`level\` int NOT NULL DEFAULT '1', \`xp\` int NOT NULL DEFAULT '0', \`hp\` int NOT NULL DEFAULT '0', \`rolls\` int NOT NULL DEFAULT '0', \`gold\` int NOT NULL DEFAULT '0', \`teamId\` varchar(255) NOT NULL, \`extraPoints\` int NOT NULL DEFAULT '0', \`active\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_ec45653c1eaae11a121cec5d10\` (\`owner\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`combat_model\` (\`id\` varchar(36) NOT NULL, \`attacker_id\` varchar(255) NOT NULL, \`defender_id\` varchar(255) NOT NULL, \`log\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`rewardGold\` int NOT NULL DEFAULT '0', \`winner_id\` varchar(36) NULL, \`loser_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`slack_install_model\` (\`id\` int NOT NULL AUTO_INCREMENT, \`team_id\` varchar(255) NOT NULL, \`installObj\` json NOT NULL, \`channelId\` varchar(255) NULL, \`stripeSubId\` varchar(255) NULL, \`stripeCOSId\` varchar(255) NULL, \`stripeCusId\` varchar(255) NULL, UNIQUE INDEX \`IDX_d03106a44e1a5c3cf4457ce905\` (\`team_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`reward_model\` (\`id\` varchar(36) NOT NULL, \`destination\` varchar(255) NOT NULL, \`source\` varchar(255) NOT NULL, \`teamId\` varchar(255) NOT NULL, \`value\` int NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`convo_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`convoId\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, \`expiresAt\` int NOT NULL, UNIQUE INDEX \`IDX_bcf72167a9dd4f88d670f20885\` (\`convoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_entity\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('web', 'bot') NOT NULL DEFAULT 'web', UNIQUE INDEX \`IDX_9b998bada7cff93fcb953b0c37\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD CONSTRAINT \`FK_d39c28762c707de58d423e62a2a\` FOREIGN KEY (\`attacker_id\`) REFERENCES \`character_model\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD CONSTRAINT \`FK_e4798c62f491a7c2ec4dac5da13\` FOREIGN KEY (\`defender_id\`) REFERENCES \`character_model\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD CONSTRAINT \`FK_a16d60a46864f72caaa3fa23793\` FOREIGN KEY (\`winner_id\`) REFERENCES \`character_model\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD CONSTRAINT \`FK_21ece03624ee914704daf3a3afa\` FOREIGN KEY (\`loser_id\`) REFERENCES \`character_model\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP FOREIGN KEY \`FK_21ece03624ee914704daf3a3afa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP FOREIGN KEY \`FK_a16d60a46864f72caaa3fa23793\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP FOREIGN KEY \`FK_e4798c62f491a7c2ec4dac5da13\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP FOREIGN KEY \`FK_d39c28762c707de58d423e62a2a\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_9b998bada7cff93fcb953b0c37\` ON \`user_entity\``,
    );
    await queryRunner.query(`DROP TABLE \`user_entity\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_bcf72167a9dd4f88d670f20885\` ON \`convo_entity\``,
    );
    await queryRunner.query(`DROP TABLE \`convo_entity\``);
    await queryRunner.query(`DROP TABLE \`reward_model\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d03106a44e1a5c3cf4457ce905\` ON \`slack_install_model\``,
    );
    await queryRunner.query(`DROP TABLE \`slack_install_model\``);
    await queryRunner.query(`DROP TABLE \`combat_model\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_ec45653c1eaae11a121cec5d10\` ON \`character_model\``,
    );
    await queryRunner.query(`DROP TABLE \`character_model\``);
    await queryRunner.query(`DROP TABLE \`session_model\``);
  }
}
