import { env } from 'src/config/config.module';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServiceAccount1725692428674 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO client (clientId, clientSecret, name)
            VALUES ('service-client-1', '${env.JWT_SECRET}', 'First Service Account');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM client
            WHERE name = 'service-account';
        `);
  }
}
