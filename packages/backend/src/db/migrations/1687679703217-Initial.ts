import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1687679703217 implements MigrationInterface {
  name = 'Initial1687679703217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`combat_entity\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`attacker_id\` varchar(255) NOT NULL, \`defender_id\` varchar(255) NOT NULL, \`log\` json NULL, \`rewardGold\` int NOT NULL DEFAULT '0', \`winner_id\` varchar(36) NULL, \`loser_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`character_entity\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(100) NOT NULL, \`owner\` varchar(255) NOT NULL, \`strength\` int NOT NULL DEFAULT '0', \`defense\` int NOT NULL DEFAULT '0', \`vitality\` int NOT NULL DEFAULT '0', \`level\` int NOT NULL DEFAULT '1', \`xp\` int NOT NULL DEFAULT '0', \`hp\` int NOT NULL DEFAULT '0', \`rolls\` int NOT NULL DEFAULT '0', \`gold\` int NOT NULL DEFAULT '0', \`teamId\` varchar(255) NOT NULL, \`extraPoints\` int NOT NULL DEFAULT '0', \`active\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_161855b323105d75f6e25ca0e3\` (\`owner\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_entity\` ADD CONSTRAINT \`FK_18e7afc7591cce29282eecf2d60\` FOREIGN KEY (\`attacker_id\`) REFERENCES \`character_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_entity\` ADD CONSTRAINT \`FK_aa679a3f88b6b56bd7398ff43a6\` FOREIGN KEY (\`defender_id\`) REFERENCES \`character_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_entity\` ADD CONSTRAINT \`FK_5389932baaa5ae2105a41cc6365\` FOREIGN KEY (\`winner_id\`) REFERENCES \`character_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_entity\` ADD CONSTRAINT \`FK_873f3aa306fbc675f83ea8f530c\` FOREIGN KEY (\`loser_id\`) REFERENCES \`character_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`combat_entity\` DROP FOREIGN KEY \`FK_873f3aa306fbc675f83ea8f530c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_entity\` DROP FOREIGN KEY \`FK_5389932baaa5ae2105a41cc6365\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_entity\` DROP FOREIGN KEY \`FK_aa679a3f88b6b56bd7398ff43a6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_entity\` DROP FOREIGN KEY \`FK_18e7afc7591cce29282eecf2d60\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_161855b323105d75f6e25ca0e3\` ON \`character_entity\``,
    );
    await queryRunner.query(`DROP TABLE \`character_entity\``);
    await queryRunner.query(`DROP TABLE \`combat_entity\``);
  }
}
