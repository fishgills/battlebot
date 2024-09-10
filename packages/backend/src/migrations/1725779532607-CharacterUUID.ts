import { MigrationInterface, QueryRunner } from "typeorm";

export class CharacterUUID1725779532607 implements MigrationInterface {
    name = 'CharacterUUID1725779532607'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

}
