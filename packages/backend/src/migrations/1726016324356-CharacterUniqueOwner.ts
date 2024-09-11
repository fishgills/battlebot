import { MigrationInterface, QueryRunner } from "typeorm";

export class CharacterUniqueOwner1726016324356 implements MigrationInterface {
    name = 'CharacterUniqueOwner1726016324356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` ADD UNIQUE INDEX \`IDX_04c2fb52adfa5265763de8c446\` (\`userId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` DROP INDEX \`IDX_04c2fb52adfa5265763de8c446\``);
    }

}
