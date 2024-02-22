import { MigrationInterface, QueryRunner } from "typeorm";

export class Gration021708586249589 implements MigrationInterface {
    name = 'Gration021708586249589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_f054adfaaf33423fa8ccb5f910\` ON \`author\``);
        await queryRunner.query(`ALTER TABLE \`author\` DROP COLUMN \`url\``);
        await queryRunner.query(`ALTER TABLE \`genre\` DROP COLUMN \`url\``);
        await queryRunner.query(`ALTER TABLE \`book\` DROP COLUMN \`url\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`book\` ADD \`url\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`genre\` ADD \`url\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`author\` ADD \`url\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f054adfaaf33423fa8ccb5f910\` ON \`author\` (\`url\`)`);
    }

}
