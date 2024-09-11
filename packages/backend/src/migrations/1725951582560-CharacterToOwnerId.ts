import { MigrationInterface, QueryRunner } from "typeorm";

export class CharacterToOwnerId1725951582560 implements MigrationInterface {
    name = 'CharacterToOwnerId1725951582560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` CHANGE \`owner\` \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`character\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`character\` ADD \`userId\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`character\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`character\` CHANGE \`userId\` \`owner\` varchar(255) NOT NULL`);
    }

}
