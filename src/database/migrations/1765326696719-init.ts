import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765326696719 implements MigrationInterface {
    name = 'Init1765326696719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipos" ADD "activo" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipos" DROP COLUMN "activo"`);
    }

}
