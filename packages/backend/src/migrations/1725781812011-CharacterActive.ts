import { MigrationInterface, QueryRunner } from "typeorm";

export class CharacterActive1725781812011 implements MigrationInterface {
    name = 'CharacterActive1725781812011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` ADD \`active\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` DROP COLUMN \`active\``);
    }

}
