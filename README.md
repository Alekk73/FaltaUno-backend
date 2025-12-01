# FaltaUno — Backend

Backend de la aplicación **FaltaUno**, desarrollado con **NestJS**, **TypeORM** y **PostgreSQL**.  
Este servicio gestiona la lógica principal de usuarios, autenticación y equipos, sirviendo como API para el frontend.

---

## Tecnologías

- [NestJS](https://nestjs.com/) — Framework modular de Node.js
- [PostgreSQL](https://www.postgresql.org/) — Base de datos relacional
- [TypeORM](https://typeorm.io/) — ORM para manejar entidades y migraciones
- [JWT](https://jwt.io/) — Autenticación basada en tokens

---

## Instalación y configuración

1. **Clonar el repositorio**
   ```
   git clone https://github.com/Alekk73/FaltaUno-backend.git
   ```
2. **Instalar dependencias**
   ```
   npm install
   ```
3. **Configurar variables de entorno**
   - Copiar el archivo de ejemplo:

   ```
   cp .env.example .env
   ```

   - Completar las variables con tus datos (por ejemplo, nombre de la base de datos, usuario, contraseña)

4. **Iniciar el servidor en modo desarrollo**
   ```
   npm run start:dev
   ```

---

**URLs importante**

- API:

  ```
  http://localhost:3000/api
  ```

- Documentción (Docs):
  ```
  http://localhost:3000/docs
  ```

En caso de cambiar el _PUERTO_ en el archivo _.env_ debe sustituir **3000** por el puerto asignado.
