# FaltaUno — Backend

Backend de la aplicación **FaltaUno**, desarrollado con **NestJS**, **TypeORM** y **PostgreSQL**.  
Este servicio gestiona la lógica principal de usuarios, autenticación y equipos, sirviendo como API para el frontend.

---

## Tecnologías

- **[NestJS](https://nestjs.com/)** — Framework modular de Node.js
- **[PostgreSQL](https://www.postgresql.org/)** — Base de datos relacional
- **[TypeORM](https://typeorm.io/)** — ORM para manejar entidades y migraciones
- **[JWT](https://jwt.io/)** — Autenticación basada en tokens
- **[Docker](https://www.docker.com/)** (opcional) — Para levantar la base de datos si no se tiene PostgeSQL intalado localmente

---

# Instalación y configuración

## 1. **Clonar el repositorio**

```
git clone https://github.com/Alekk73/FaltaUno-backend.git
```

Moverse al directorio en caso de ser necesario

```
cd FaltaUno-backend
```

## 2. **Instalar dependencias**

```
npm install
```

## 3. **Configurar variables de entorno**

- Copiar el archivo de ejemplo:

```
cp .env.example .env
```

- Completar las variables:
  - Nombre de la base de datos
  - Usuario y contraseña
  - Claves JWT
  - Config de SendGrid (si quiere registrar un usuario nuevo, sino no es necesario abra un usuario de prueba)

---

# Opción 1 - **Levantar PostgreSQL con Docker**

El proyecto incluye un `docker-compose.yml` para evitar configuración manual.

#### 1. Crear el contenedor para la base de datos:

```
docker compose up -d
```

Esto inicializa un contenedor PostgreSQL usando las variables del `.env`.

#### 2. Crear la base de datos si no existe e inicializar el servidor backend:

```
npm run setup
npm run start:dev
```

---

# Opción 2 - **Usar PostgreSQL local**

Si ya tenés PostgreSQL instalado:

```
npm run setup
npm run start:dev
```

---

# URLs importante

### **API Base**

```
http://localhost:3000/api
```

### **Documentción (Swagger)**

```
http://localhost:3000/docs
```

> En caso de cambiar el puerto en el archivo `.env` debe sustituir `3000` por el puerto asignado.

---

# Usuarios generados por la seed

La seed crea usuarios iniciales:

`admin@example.com` — rol admin

`capitan@example.com` — rol capitan (Tiene ya equipo creado)

`usuario@example.com` — rol usuario

`propietario@example.com` — rol propietario (podra crear un establecimiento con canchas, dirección y valor de las mismas)

Contraseña para todos: `_Pass1234`
