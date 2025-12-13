import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765613920966 implements MigrationInterface {
    name = 'Init1765613920966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipos" DROP CONSTRAINT "FK_b508fc6bb0df7687f900473eed5"`);
        await queryRunner.query(`ALTER TABLE "equipos" DROP CONSTRAINT "REL_b508fc6bb0df7687f900473eed"`);
        await queryRunner.query(`ALTER TABLE "equipos" ADD CONSTRAINT "FK_b508fc6bb0df7687f900473eed5" FOREIGN KEY ("creador_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipos" DROP CONSTRAINT "FK_b508fc6bb0df7687f900473eed5"`);
        await queryRunner.query(`ALTER TABLE "equipos" ADD CONSTRAINT "REL_b508fc6bb0df7687f900473eed" UNIQUE ("creador_id")`);
        await queryRunner.query(`ALTER TABLE "equipos" ADD CONSTRAINT "FK_b508fc6bb0df7687f900473eed5" FOREIGN KEY ("creador_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
