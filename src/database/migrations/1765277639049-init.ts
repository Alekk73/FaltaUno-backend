import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765277639049 implements MigrationInterface {
    name = 'Init1765277639049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."invitaciones_estado_enum" AS ENUM('aceptada', 'rechazada', 'pendiente', 'caducado')`);
        await queryRunner.query(`CREATE TABLE "invitaciones" ("id" SERIAL NOT NULL, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), "estado" "public"."invitaciones_estado_enum" NOT NULL DEFAULT 'pendiente', "creador_id" integer, "invitado_id" integer, "equipo_id" integer, CONSTRAINT "PK_224c1573f98dbf3c1c825bc447f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "canchas" ("id" SERIAL NOT NULL, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), "nombre" character varying(100) NOT NULL, CONSTRAINT "UQ_230f654bdd9bebf9e33d644be0f" UNIQUE ("nombre"), CONSTRAINT "PK_b0895a3e86f4558816d42e8b1d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."partidos_estado_resultado_enum" AS ENUM('sin_cargar', 'confirmacion_pendiente', 'confirmado', 'indefinido')`);
        await queryRunner.query(`CREATE TABLE "partidos" ("id" SERIAL NOT NULL, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), "hora_dia" TIMESTAMP, "estado_resultado" "public"."partidos_estado_resultado_enum" NOT NULL DEFAULT 'sin_cargar', "cancha_id" integer, CONSTRAINT "unique_match_hour_field" UNIQUE ("hora_dia", "cancha_id"), CONSTRAINT "PK_41be14bdfa8a15d820711908e71" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "partidos_equipos" ("id" SERIAL NOT NULL, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), "goles_local" integer, "goles_visitante" integer, "es_local" boolean NOT NULL DEFAULT false, "partido_id" integer, "equipo_id" integer, CONSTRAINT "PK_a8d0eb2eaadeeea3a425d0b1388" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "equipos" ("id" SERIAL NOT NULL, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), "nombre" character varying(75) NOT NULL, "cantidad_jugadores" integer NOT NULL DEFAULT '0', "creador_id" integer, CONSTRAINT "REL_b508fc6bb0df7687f900473eed" UNIQUE ("creador_id"), CONSTRAINT "PK_451fffd8d175b5b7aadbf5ba760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tokens_tipo_enum" AS ENUM('activacion', 'cambio_contrasena')`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), "tipo" "public"."tokens_tipo_enum", "token" character varying(64), "expiracion" TIMESTAMP, "usuario_id" integer, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_rol_enum" AS ENUM('admin', 'capitan', 'jugador', 'usuario')`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), "nombre" character varying(50) NOT NULL, "apellido" character varying(50) NOT NULL, "correo_electronico" character varying(100) NOT NULL, "documento" character varying(15) NOT NULL, "contrasena_hash" character varying(255) NOT NULL, "rol" "public"."usuarios_rol_enum" NOT NULL DEFAULT 'usuario', "visible" boolean NOT NULL DEFAULT false, "verificado" boolean NOT NULL DEFAULT false, "equipo_id" integer, CONSTRAINT "UQ_e871b7157e4b74290df9baa9c93" UNIQUE ("correo_electronico"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invitaciones" ADD CONSTRAINT "FK_a95f40d29bb9cb4a2c85e2f888c" FOREIGN KEY ("creador_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitaciones" ADD CONSTRAINT "FK_213497ae7bd58eae50c2ab52bfc" FOREIGN KEY ("invitado_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitaciones" ADD CONSTRAINT "FK_459baddf3f7e2bf685945fd60cd" FOREIGN KEY ("equipo_id") REFERENCES "equipos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partidos" ADD CONSTRAINT "FK_39c2c9dee86b47cca206fca83d4" FOREIGN KEY ("cancha_id") REFERENCES "canchas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partidos_equipos" ADD CONSTRAINT "FK_2a75b7b81a1bec959c8e1ef64ff" FOREIGN KEY ("partido_id") REFERENCES "partidos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partidos_equipos" ADD CONSTRAINT "FK_374ca2c3775baead14b695c1e2e" FOREIGN KEY ("equipo_id") REFERENCES "equipos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipos" ADD CONSTRAINT "FK_b508fc6bb0df7687f900473eed5" FOREIGN KEY ("creador_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_80f527532c56253b116fa8d1cc9" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "FK_bc9f9bcd3ee2f3be097a0e10242" FOREIGN KEY ("equipo_id") REFERENCES "equipos"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "FK_bc9f9bcd3ee2f3be097a0e10242"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_80f527532c56253b116fa8d1cc9"`);
        await queryRunner.query(`ALTER TABLE "equipos" DROP CONSTRAINT "FK_b508fc6bb0df7687f900473eed5"`);
        await queryRunner.query(`ALTER TABLE "partidos_equipos" DROP CONSTRAINT "FK_374ca2c3775baead14b695c1e2e"`);
        await queryRunner.query(`ALTER TABLE "partidos_equipos" DROP CONSTRAINT "FK_2a75b7b81a1bec959c8e1ef64ff"`);
        await queryRunner.query(`ALTER TABLE "partidos" DROP CONSTRAINT "FK_39c2c9dee86b47cca206fca83d4"`);
        await queryRunner.query(`ALTER TABLE "invitaciones" DROP CONSTRAINT "FK_459baddf3f7e2bf685945fd60cd"`);
        await queryRunner.query(`ALTER TABLE "invitaciones" DROP CONSTRAINT "FK_213497ae7bd58eae50c2ab52bfc"`);
        await queryRunner.query(`ALTER TABLE "invitaciones" DROP CONSTRAINT "FK_a95f40d29bb9cb4a2c85e2f888c"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_rol_enum"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TYPE "public"."tokens_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "equipos"`);
        await queryRunner.query(`DROP TABLE "partidos_equipos"`);
        await queryRunner.query(`DROP TABLE "partidos"`);
        await queryRunner.query(`DROP TYPE "public"."partidos_estado_resultado_enum"`);
        await queryRunner.query(`DROP TABLE "canchas"`);
        await queryRunner.query(`DROP TABLE "invitaciones"`);
        await queryRunner.query(`DROP TYPE "public"."invitaciones_estado_enum"`);
    }

}
