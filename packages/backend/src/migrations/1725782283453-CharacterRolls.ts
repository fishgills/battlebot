import { MigrationInterface, QueryRunner } from "typeorm";

export class CharacterRolls1725782283453 implements MigrationInterface {
    name = 'CharacterRolls1725782283453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` ADD \`rolls\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` DROP COLUMN \`rolls\``);
    }

}
