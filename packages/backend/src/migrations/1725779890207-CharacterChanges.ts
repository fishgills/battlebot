import { MigrationInterface, QueryRunner } from "typeorm";

export class CharacterChanges1725779890207 implements MigrationInterface {
    name = 'CharacterChanges1725779890207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` ADD \`owner\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`character\` ADD \`teamId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`character\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`character\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`character\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`character\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`character\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`character\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`character\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`character\` DROP COLUMN \`teamId\``);
        await queryRunner.query(`ALTER TABLE \`character\` DROP COLUMN \`owner\``);
    }

}
