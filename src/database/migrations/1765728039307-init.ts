import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765728039307 implements MigrationInterface {
    name = 'Init1765728039307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "establecimientos" ("id" SERIAL NOT NULL, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), "nombre" character varying(50) NOT NULL, "activo" boolean NOT NULL DEFAULT true, "direccion" character varying(100) NOT NULL, "valor_canchas" numeric(10,2) NOT NULL, "usuario_id" integer, CONSTRAINT "UQ_2643886eb544f55c33696780364" UNIQUE ("nombre"), CONSTRAINT "UQ_f8b4482cb044e7e4bb1a1069a91" UNIQUE ("direccion"), CONSTRAINT "REL_2d3b23d011dd89f87f2970ab44" UNIQUE ("usuario_id"), CONSTRAINT "PK_fc6001fb84c8c6d309c237c915a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "canchas" DROP CONSTRAINT "UQ_230f654bdd9bebf9e33d644be0f"`);
        await queryRunner.query(`ALTER TABLE "canchas" DROP COLUMN "nombre"`);
        await queryRunner.query(`ALTER TABLE "canchas" ADD "numero_cancha" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "canchas" ADD "establecimiento_id" integer`);
        await queryRunner.query(`ALTER TYPE "public"."usuarios_rol_enum" RENAME TO "usuarios_rol_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_rol_enum" AS ENUM('admin', 'capitan', 'jugador', 'usuario', 'propietario')`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "rol" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "rol" TYPE "public"."usuarios_rol_enum" USING "rol"::"text"::"public"."usuarios_rol_enum"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "rol" SET DEFAULT 'usuario'`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_rol_enum_old"`);
        await queryRunner.query(`ALTER TABLE "canchas" ADD CONSTRAINT "unique_field_est" UNIQUE ("numero_cancha", "establecimiento_id")`);
        await queryRunner.query(`ALTER TABLE "canchas" ADD CONSTRAINT "FK_33b15ab25105ca0fba6879a513d" FOREIGN KEY ("establecimiento_id") REFERENCES "establecimientos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "establecimientos" ADD CONSTRAINT "FK_2d3b23d011dd89f87f2970ab44c" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "establecimientos" DROP CONSTRAINT "FK_2d3b23d011dd89f87f2970ab44c"`);
        await queryRunner.query(`ALTER TABLE "canchas" DROP CONSTRAINT "FK_33b15ab25105ca0fba6879a513d"`);
        await queryRunner.query(`ALTER TABLE "canchas" DROP CONSTRAINT "unique_field_est"`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_rol_enum_old" AS ENUM('admin', 'capitan', 'jugador', 'usuario')`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "rol" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "rol" TYPE "public"."usuarios_rol_enum_old" USING "rol"::"text"::"public"."usuarios_rol_enum_old"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "rol" SET DEFAULT 'usuario'`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_rol_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."usuarios_rol_enum_old" RENAME TO "usuarios_rol_enum"`);
        await queryRunner.query(`ALTER TABLE "canchas" DROP COLUMN "establecimiento_id"`);
        await queryRunner.query(`ALTER TABLE "canchas" DROP COLUMN "numero_cancha"`);
        await queryRunner.query(`ALTER TABLE "canchas" ADD "nombre" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "canchas" ADD CONSTRAINT "UQ_230f654bdd9bebf9e33d644be0f" UNIQUE ("nombre")`);
        await queryRunner.query(`DROP TABLE "establecimientos"`);
    }

}
