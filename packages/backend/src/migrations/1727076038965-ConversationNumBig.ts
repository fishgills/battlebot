import { MigrationInterface, QueryRunner } from "typeorm";

export class ConversationNumBig1727076038965 implements MigrationInterface {
    name = 'ConversationNumBig1727076038965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP COLUMN \`expiresAt\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD \`expiresAt\` bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP COLUMN \`expiresAt\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD \`expiresAt\` int NOT NULL`);
    }

}
