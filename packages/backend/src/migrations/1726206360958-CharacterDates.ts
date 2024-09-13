import { MigrationInterface, QueryRunner } from "typeorm";

export class CharacterDates1726206360958 implements MigrationInterface {
    name = 'CharacterDates1726206360958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` ADD \`active\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` DROP COLUMN \`active\``);
    }

}
