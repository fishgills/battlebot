import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1725692356274 implements MigrationInterface {
    name = 'Initial1725692356274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`character\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`strength\` int NOT NULL, \`constitution\` int NOT NULL, \`dexterity\` int NOT NULL, \`level\` int NOT NULL DEFAULT '1', \`gold\` int NOT NULL DEFAULT '0', \`experiencePoints\` int NOT NULL DEFAULT '0', \`hitPoints\` int NOT NULL, \`wins\` int NOT NULL DEFAULT '0', \`losses\` int NOT NULL DEFAULT '0', \`extraPoints\` int NOT NULL DEFAULT '0', \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`client\` (\`id\` int NOT NULL AUTO_INCREMENT, \`clientId\` varchar(255) NOT NULL, \`clientSecret\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_6ed9067942d7537ce359e172ff\` (\`clientId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`character\` ADD CONSTRAINT \`FK_04c2fb52adfa5265763de8c4464\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`character\` DROP FOREIGN KEY \`FK_04c2fb52adfa5265763de8c4464\``);
        await queryRunner.query(`DROP INDEX \`IDX_6ed9067942d7537ce359e172ff\` ON \`client\``);
        await queryRunner.query(`DROP TABLE \`client\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`character\``);
    }

}
