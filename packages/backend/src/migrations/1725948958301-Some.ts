import { MigrationInterface, QueryRunner } from "typeorm";

export class Some1725948958301 implements MigrationInterface {
    name = 'Some1725948958301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` DROP FOREIGN KEY \`FK_04c2fb52adfa5265763de8c4464\``);
        await queryRunner.query(`ALTER TABLE \`character\` DROP COLUMN \`userId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`character\` ADD CONSTRAINT \`FK_04c2fb52adfa5265763de8c4464\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
