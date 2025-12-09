import { AppDS } from './data.source';
import { QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seed() {
  const dataSource = AppDS;
  await dataSource.initialize();
  console.log('DataSource initialized');

  const queryRunner: QueryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.startTransaction();

    console.log('Insertando usuarios iniciales...');

    const hashedPass = await bcrypt.hash('_Pass1234', 10);

    await queryRunner.query(
      `DELETE FROM "usuarios" WHERE correo_electronico IN ($1,$2,$3)`,
      ['admin@example.com', 'capitan@example.com', 'usuario@example.com'],
    );

    const insertedUsers = await queryRunner.query(
      `
        INSERT INTO "usuarios" (
          nombre, apellido, correo_electronico, documento, contrasena_hash,
          rol, visible, verificado, equipo_id
        )
        VALUES 
          ('admin', 'prueba', 'admin@example.com', '12345678', $1, 'admin', false, true, null),
          ('capitan', 'prueba', 'capitan@example.com', '87654321', $1, 'capitan', false, true, null),
          ('usuario', 'prueba', 'usuario@example.com', '11223344', $1, 'usuario', true, true, null)
        RETURNING id;
      `,
      [hashedPass],
    );

    console.log('Usuarios insertados:', insertedUsers);

    const captainID = insertedUsers[1]?.id;

    const createdTeam = await queryRunner.query(
      `
          INSERT INTO "equipos" (nombre, cantidad_jugadores, creador_id)
          VALUES ('Equipo 1', $1, $2)
          ON CONFLICT DO NOTHING
          RETURNING id;
        `,
      [1, captainID],
    );

    const teamId = createdTeam[0]?.id;

    if (teamId) {
      await queryRunner.query(
        `UPDATE "usuarios" SET equipo_id = $1 WHERE id IN ($2)`,
        [teamId, captainID],
      );
    }

    await queryRunner.commitTransaction();
    console.log('Seed ejecutada correctamente');
  } catch (error) {
    console.error('Error en seed, haciendo rollback:', error);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
    console.log('Conexión cerrada');
  }
}

seed().catch(console.error);
