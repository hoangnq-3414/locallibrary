import { MigrationInterface, QueryRunner } from "typeorm";

export class Gration011708501405695 implements MigrationInterface {
    name = 'Gration011708501405695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`author\` (\`author_id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`family_name\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`lifespan\` varchar(100) NULL, \`date_of_birth\` date NULL, \`date_of_death\` date NULL, \`url\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_f054adfaaf33423fa8ccb5f910\` (\`url\`), PRIMARY KEY (\`author_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`book_instance\` (\`instance_id\` int NOT NULL AUTO_INCREMENT, \`imprint\` varchar(255) NOT NULL, \`status\` enum ('Available', 'Maintenance', 'On Loan', 'Reserved') NOT NULL, \`dueBack\` date NOT NULL, \`bookBookId\` int NULL, PRIMARY KEY (\`instance_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`book\` (\`book_id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`summary\` text NOT NULL, \`ISBN\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`authorAuthorId\` int NULL, PRIMARY KEY (\`book_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`genre\` (\`genre_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`genre_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`book_genre\` (\`book_gender_id\` int NOT NULL AUTO_INCREMENT, \`bookBookId\` int NULL, \`genreGenreId\` int NULL, PRIMARY KEY (\`book_gender_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`book_instance\` ADD CONSTRAINT \`FK_d8b999a217a109000ee17b76010\` FOREIGN KEY (\`bookBookId\`) REFERENCES \`book\`(\`book_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book\` ADD CONSTRAINT \`FK_5331c11d441a19dff27a1a0b10b\` FOREIGN KEY (\`authorAuthorId\`) REFERENCES \`author\`(\`author_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book_genre\` ADD CONSTRAINT \`FK_32ae40d616954f2d84a0a309c8e\` FOREIGN KEY (\`bookBookId\`) REFERENCES \`book\`(\`book_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book_genre\` ADD CONSTRAINT \`FK_804535b55258cc42f93328163db\` FOREIGN KEY (\`genreGenreId\`) REFERENCES \`genre\`(\`genre_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`book_genre\` DROP FOREIGN KEY \`FK_804535b55258cc42f93328163db\``);
        await queryRunner.query(`ALTER TABLE \`book_genre\` DROP FOREIGN KEY \`FK_32ae40d616954f2d84a0a309c8e\``);
        await queryRunner.query(`ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_5331c11d441a19dff27a1a0b10b\``);
        await queryRunner.query(`ALTER TABLE \`book_instance\` DROP FOREIGN KEY \`FK_d8b999a217a109000ee17b76010\``);
        await queryRunner.query(`DROP TABLE \`book_genre\``);
        await queryRunner.query(`DROP TABLE \`genre\``);
        await queryRunner.query(`DROP TABLE \`book\``);
        await queryRunner.query(`DROP TABLE \`book_instance\``);
        await queryRunner.query(`DROP INDEX \`IDX_f054adfaaf33423fa8ccb5f910\` ON \`author\``);
        await queryRunner.query(`DROP TABLE \`author\``);
    }

}
