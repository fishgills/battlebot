import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostGresCreate1647661030699 implements MigrationInterface {
  name = 'PostGresCreate1647661030699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session_model" ("id" uuid NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "data" json NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3c8671916fb700dcbc8128a8768" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "character_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "owner" character varying NOT NULL, "strength" integer NOT NULL DEFAULT '0', "defense" integer NOT NULL DEFAULT '0', "vitality" integer NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '1', "xp" integer NOT NULL DEFAULT '0', "hp" integer NOT NULL DEFAULT '0', "rolls" integer NOT NULL DEFAULT '0', "gold" integer NOT NULL DEFAULT '0', "teamId" character varying NOT NULL, "extraPoints" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_ec45653c1eaae11a121cec5d108" UNIQUE ("owner"), CONSTRAINT "PK_1b34db3619000eb3925153d78de" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "combat_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "attacker_id" uuid NOT NULL, "defender_id" uuid NOT NULL, "log" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "rewardGold" integer NOT NULL DEFAULT '0', "winner_id" uuid, "loser_id" uuid, CONSTRAINT "PK_a51b47fa20356fca5751c2d7637" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "slack_install_model" ("id" SERIAL NOT NULL, "team_id" character varying NOT NULL, "installObj" json NOT NULL, "channelId" character varying, "stripeSubId" character varying, "stripeCOSId" character varying, "stripeCusId" character varying, CONSTRAINT "UQ_d03106a44e1a5c3cf4457ce905e" UNIQUE ("team_id"), CONSTRAINT "PK_25bf22b7605cacddc92fcea42da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reward_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "to" character varying NOT NULL, "from" character varying NOT NULL, "teamId" character varying NOT NULL, "value" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ad84fafa1e7df485dc68a99a2a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "convo_entity" ("id" SERIAL NOT NULL, "convoId" character varying NOT NULL, "value" character varying NOT NULL, "expiresAt" integer NOT NULL, CONSTRAINT "UQ_bcf72167a9dd4f88d670f20885c" UNIQUE ("convoId"), CONSTRAINT "PK_e9c100ea8c110389c0bb53ad7eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_entity_role_enum" AS ENUM('web', 'bot')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_entity_role_enum" NOT NULL DEFAULT 'web', CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "combat_model" ADD CONSTRAINT "FK_d39c28762c707de58d423e62a2a" FOREIGN KEY ("attacker_id") REFERENCES "character_model"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "combat_model" ADD CONSTRAINT "FK_e4798c62f491a7c2ec4dac5da13" FOREIGN KEY ("defender_id") REFERENCES "character_model"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "combat_model" ADD CONSTRAINT "FK_a16d60a46864f72caaa3fa23793" FOREIGN KEY ("winner_id") REFERENCES "character_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "combat_model" ADD CONSTRAINT "FK_21ece03624ee914704daf3a3afa" FOREIGN KEY ("loser_id") REFERENCES "character_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `insert into user_entity (username, password, role) values ('bot', 'bot', 'bot')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "combat_model" DROP CONSTRAINT "FK_21ece03624ee914704daf3a3afa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "combat_model" DROP CONSTRAINT "FK_a16d60a46864f72caaa3fa23793"`,
    );
    await queryRunner.query(
      `ALTER TABLE "combat_model" DROP CONSTRAINT "FK_e4798c62f491a7c2ec4dac5da13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "combat_model" DROP CONSTRAINT "FK_d39c28762c707de58d423e62a2a"`,
    );
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(`DROP TYPE "public"."user_entity_role_enum"`);
    await queryRunner.query(`DROP TABLE "convo_entity"`);
    await queryRunner.query(`DROP TABLE "reward_model"`);
    await queryRunner.query(`DROP TABLE "slack_install_model"`);
    await queryRunner.query(`DROP TABLE "combat_model"`);
    await queryRunner.query(`DROP TABLE "character_model"`);
    await queryRunner.query(`DROP TABLE "session_model"`);
  }
}
