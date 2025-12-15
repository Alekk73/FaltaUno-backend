import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765818508840 implements MigrationInterface {
    name = 'Init1765818508840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "establecimientos" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "establecimientos" ADD CONSTRAINT "UQ_67cb47683918d4dbaf49dce07b7" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "establecimientos" DROP CONSTRAINT "UQ_67cb47683918d4dbaf49dce07b7"`);
        await queryRunner.query(`ALTER TABLE "establecimientos" DROP COLUMN "slug"`);
    }

}
