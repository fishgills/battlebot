import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameRewardColumns1659120313940 implements MigrationInterface {
  name = 'RenameRewardColumns1659120313940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reward_model" DROP COLUMN "to"`);
    await queryRunner.query(`ALTER TABLE "reward_model" DROP COLUMN "from"`);
    await queryRunner.query(
      `ALTER TABLE "reward_model" ADD "destination" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reward_model" ADD "source" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reward_model" DROP COLUMN "source"`);
    await queryRunner.query(
      `ALTER TABLE "reward_model" DROP COLUMN "destination"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reward_model" ADD "from" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reward_model" ADD "to" character varying NOT NULL`,
    );
  }
}
