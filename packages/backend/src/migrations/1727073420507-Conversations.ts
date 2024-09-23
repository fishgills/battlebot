import { MigrationInterface, QueryRunner } from "typeorm";

export class Conversations1727073420507 implements MigrationInterface {
    name = 'Conversations1727073420507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversation\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD \`id\` varchar(255) NOT NULL PRIMARY KEY`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`conversation\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
    }

}
