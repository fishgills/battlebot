import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWinnerLoserGoldToCombat1644617911631
  implements MigrationInterface
{
  name = 'AddWinnerLoserGoldToCombat1644617911631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD \`rewardGold\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD \`winner_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD \`loser_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`session_model\` CHANGE \`expiresAt\` \`expiresAt\` timestamp NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD CONSTRAINT \`FK_a16d60a46864f72caaa3fa23793\` FOREIGN KEY (\`winner_id\`) REFERENCES \`character_model\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` ADD CONSTRAINT \`FK_21ece03624ee914704daf3a3afa\` FOREIGN KEY (\`loser_id\`) REFERENCES \`character_model\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP FOREIGN KEY \`FK_21ece03624ee914704daf3a3afa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP FOREIGN KEY \`FK_a16d60a46864f72caaa3fa23793\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`session_model\` CHANGE \`expiresAt\` \`expiresAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP COLUMN \`loser_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP COLUMN \`winner_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`combat_model\` DROP COLUMN \`rewardGold\``,
    );
  }
}
