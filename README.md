# FaltaUno — Backend

Backend de la aplicación **FaltaUno**, desarrollado con **NestJS**, **TypeORM** y **PostgreSQL**.  
Este servicio gestiona la lógica principal de usuarios, autenticación y equipos, sirviendo como API para el frontend.

---

## 🚀 Tecnologías

- ⚙️ [NestJS](https://nestjs.com/) — Framework modular de Node.js  
- 🗄️ [PostgreSQL](https://www.postgresql.org/) — Base de datos relacional  
- 🧱 [TypeORM](https://typeorm.io/) — ORM para manejar entidades y migraciones  
- 🔐 [JWT](https://jwt.io/) — Autenticación basada en tokens

---

## 📦 Estructura del proyecto

```
Directory structure: 
└── faltauno-backend/
  ├── src/
  │ ├── app.module.ts # Módulo raíz de la aplicación
  │ ├── main.ts # Punto de entrada
  │ ├── common/ # Entidades base, enums y utilidades
  │ ├── database/ # Configuración del módulo de base de datos
  │ ├── modules/ # Módulos principales
  │ │ ├── auth/ # Autenticación y registro
  │ │ ├── users/ # Gestión de usuarios
  │ │ └── teams/ # Gestión de equipos
  │ └── types/ # Tipos y extensiones globales
  ├── test/ # Pruebas e2e
  ├── .env.example # Variables de entorno de ejemplo
  ├── package.json
  ├── nest-cli.json
  ├── tsconfig.json
  └── README.md
```

---

## ⚙️ Instalación y configuración

1. **Clonar el repositorio**
   ```
   git clone [<url-del-repositorio>](https://github.com/Alekk73/FaltaUno-backend.git)
   ```
2. **Instalar dependencias**
   ```
   npm install
   ```
4. **Configurar variables de entorno**
   - Copiar el archivo de ejemplo:
   ```
   cp .env.example .env
   ```
   - Completar las variables con tus datos (por ejemplo, nombre de la base de datos, usuario, contraseña)
5. Iniciar el servidor en modo desarrollo
   ```
   npm run start:dev
   ```
