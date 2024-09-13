import { MigrationInterface, QueryRunner } from "typeorm";

export class CharacterNameLength1726207010922 implements MigrationInterface {
    name = 'CharacterNameLength1726207010922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`character\` ADD \`name\` varchar(25) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`character\` ADD \`name\` varchar(255) NOT NULL`);
    }

}
