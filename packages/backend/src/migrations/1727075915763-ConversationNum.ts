import { MigrationInterface, QueryRunner } from "typeorm";

export class ConversationNum1727075915763 implements MigrationInterface {
    name = 'ConversationNum1727075915763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP COLUMN \`expiresAt\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD \`expiresAt\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP COLUMN \`expiresAt\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD \`expiresAt\` datetime NOT NULL`);
    }

}
